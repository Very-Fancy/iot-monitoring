/*
Program for Intel Edison, which gets temperature value and sends it to Zabbix Server with Zabbix Sender.
*/

#include <unistd.h>
#include <mraa/aio.h>
#include <stdlib.h>
#include <stdio.h>
#include <math.h>

const double B = 4275.0;               // B value of the thermistor
const double R0 = 100000.0;            // R0 = 100k
#define TEMP_ADC_PIN 0    // ADC pin is 0

int main(int argc, char **argv)
{
    mraa_init();
    mraa_aio_context adc_a0;
    float raw_value = 0.0;
    adc_a0 = mraa_aio_init(TEMP_ADC_PIN);
    if (adc_a0 == NULL) {
        fprintf(stderr, "Failed to initialize AIO\n");
        mraa_deinit();
        return EXIT_FAILURE;
    }

    float temperature = 0.0;

    for (;;) {
	raw_value = mraa_aio_read(adc_a0);
         float R = (1023.0 - raw_value)*(10000.0 / raw_value);
          temperature = 1.0 / (log(R/10000.0) / B + 1.0 / 298.15) - 273.15;
        char* message = (char*)malloc(160);
        sprintf(message, "./zabbix_sender -z 192.168.43.148 -p 10051 -I 192.168.43.142 -s Edison -k temperature -o %0.2f", temperature);
        system(message);
        fprintf(stdout, "Temperature raw: %0.2f\n", raw_value);
        fprintf(stdout, "Temperature: %0.2f\n", temperature);
        fprintf(stdout, "%s\n", message);
        free(message);
        usleep(500000);
    }
    printf("Done!");
    mraa_aio_close(adc_a0);
    return MRAA_SUCCESS;
}



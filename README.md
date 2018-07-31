System for monitoring the condition of the air in the room.

Devices and technologies:
  - Several Intel Edison devices with temperature sensors.
  - Zabbix Server installed and configurated for saving the data from the sensors.
  - Zabbix Sender installed on Intel Edison and configured to send the data to the Server.
  - For web interface: jquery-3.3.1.min, xolor.umd, heatmap.min
  
The system collects the data from temperature sensors of placed in the room devices (Intel Edison). The web application provides the real-time visualization of the data.  

If Server is unreachable / Host or Graph not found / etc. – the Interface will generate random values instead of real temperature.

 function initVals(){

        global:
            devs_N = 0,
            devs = [],//['Edison', 'Edison2'];
            graphs = [],//['Temperature', 'Edison2 Temperature'];
            g = new Gauss(),
            altText = undefined,
            heatmapInstance = new Object(),
            heatmapInstance.data = [],
            zurl = "192.168.43.148",
            key = undefined,
                user = "Kate",
                pass = "111"
    }

    function initStyle(){
        $('.set_firstpart').css("position","absolute");
        $('.set_firstpart').css("width","100%");
        $('.set_firstpart').css("max-height",window.innerHeight - 40);
        $('#user').css("width","100%");
        $('.set_secpart').css("display","none");
    }

 function successFunc(data){
        if(data=='invalid') {
            $("#err").html("Invalid File !").fadeIn();
        }
        else{
            if ($(".toggle").css('display') != 'none'){

                $("#preview").animate({height:'toggle'},
                    function(){
                        $("#preview").html(data).fadeIn();
                        $("#preview").css('width','100%');
                        var im=new Image();
                        im.src = $('.prev').get(0).src;

                        im.onload = img_load(im);
                    });
            }
            else{
                $("#preview").html(data).fadeIn();
                var im=new Image();
                im.src = $('.prev').get(0).src;
                $("#preview").css('width','100%');
                im.onload = img_load(im);
            }

            $("#err").html("Preview:").fadeIn();

            $("#form")[0].reset();

            $("#DynamicExtraFieldsContainer").css("display","inline-block");
            $("#DynamicExtraFieldsContainer").css("float","left");

            $(".toggle").css("float","right");
        }
    }

 function uploadRequest(dataFunc,param){
        $.ajax({
            url: "ajaxupload.php",
            type: "POST",
            data:  new FormData(param),
            contentType: false,
            cache: false,
            processData:false,

            success: function(data) {
                dataFunc(data);
            },
            error: function(e) {
                $("#err").html(e).fadeIn();
            }
        })

    }

 function initEvents(){

    $('.fill-in').on('click', function(){
        $('#user').get(0).value = user;
        $('#password').get(0).value = pass;
        $('#address').get(0).value = zurl;
        return false;
    });

    $('.sets-but').on('click', function(){
        $('.login-holder').toggle('slow');
        $('.holder').toggle('slow');
        zurl = "http://" + $('#address').get(0).value + "/zabbix/api_jsonrpc.php";
        pass = $('#password').get(0).value;
        user = $('#user').get(0).value;

        return false;
    });

	 $('.prm-cross').on('click', function(){
	  	$(this).parent().hide('fast'); 
	  	return false; 
	  });

	  
        $('.htmap').mousedown(function(e){
            heatmapClick(e,this);
        });

        $('.AddDevice').click(function(event) {
            addDeviceBut(event,this);
        });

        $('.DeleteDynamicExtraField').click(function(event) {
            delDeviceBut(event,this);
        });

        setInterval(function(){
            if (heatmapInstance.data.length>0) {
                heatmapInstance = update_vals();
            }
        }, 1000);

        $('.htmap').bind('contextmenu', function (e) {
            return false;
        });

        $('#addDynamicExtraFieldButton').click(function(event) {
            addDynamicExtraField();

            return false;
        });

        $("#form").on('change',(function(e) {
            e.preventDefault();

            uploadRequest(successFunc,this);
        }));

    }

    function heatmapClick(e,param){
        if (e.button == 0) {
                var coords = getXY(e, $(param).offset());

                for (var i = 0; i < heatmapInstance.data.length; i++) {
                    if (Math.pow((coords.x - heatmapInstance.data[i].x), 2) + Math.pow((coords.y - heatmapInstance.data[i].y), 2) <= Math.pow(heatmapInstance.data[i].radius, 2)) {
                        $('.htmap').mousemove({e, i}, function (ev) {
                            $('.canvdiv').unbind('mousemove');
                            altText = undefined;

                            var coords = getXY(ev,  $('.htmap').offset());
                            var tmppoint = heatmapInstance.data[i];

                            tmppoint.x = coords.x;
                            tmppoint.y = coords.y;
                            heatmapInstance.data[i] = tmppoint;
                            showMap(heatmapInstance);

                            $('.htmap').click(heatmapInstance, function (e) {
                                $('.htmap').unbind('mousemove');
                                $('.canvdiv').mousemove(function(ev){
                                    showDegree(ev);
                                });
                            });
                        });
                        null;
                        break;
                    }
                }
            }
        }

    function elems(img_src,perc){
        var newImg = new Image();
        newImg.src = img_src;

        newImg.onload = function() {
            var inf_width = 70;
            var height = newImg.height;
            var width = newImg.width;
            
            var im = $('.imdiv');

            if (height >= width) {
		$('.map_holder').css('width','90%');
                im[0].innerHTML = " <img class = 'backimg' src = " + newImg.src + " style ='height: 100% '></img>";
                $(".par_id").css("width", inf_width);
                $(".par_id").css("position", "relative");
                $(".par_id").css("display", "inline-block");

                $(".holder").css("height",window.innerHeight - 10);
                $(".holder").css('text-align','center');
                //$(".htmap").css("width", $('.backimg').width());
                $('.map_holder').css("text-align",'center');
                //$('.mapsDiv').css("width", $(".htmap").width() + inf_width + 10);
                $('.map_holder').css("padding-right",0);
            }
            else {
		$('.map_holder').css('width','95%');
                $(".par_id").css("width", inf_width);
                $(".par_id").css("position", "absolute");
                $(".par_id").css("display", "inline-block");
                $('.map_holder').css("text-align",'right');
                $('.map_holder').css("padding-right",5);
                $(".holder").css('text-align','right');
                im[0].innerHTML = " <img class = 'backimg' src = " + newImg.src + " style ='width: 100%'></img>";
                $(".htmap").css("width", "95%");
                $('.mapsDiv').css("width", $('.map_holder').width());
            }

            $('.togSet').css('max-height', "100%");

            $('.max_val').css("width", "100%");
            $('.max_val').css("text-align", "center");
            $('.min_val').css("text-align", "center");
            $('.min_val').css("width", "100%");

            var parents = document.getElementsByClassName('par_id');
            var min_pr = parents[0].children[0];
            var max_pr = parents[0].children[2];

            min_pr.innerHTML = "35.0&#176 C";
            max_pr.innerHTML = "15.0&#176 C";

            $(".htmap").css("position", "relative");
            $(".htmap").css("display", "inline-block");
            $(".htmap").css("right", 0);

            $('.map_holder').css("position", "relative");
            $('.map_holder').css("display", "inline-block");

            $(".canvdiv").css("position", "absolute");
            $(".canvdiv").css("top", 0);

            $("#myCanvas").css("width", $('.backimg').width());
            $("#myCanvas").css("height",  $('.backimg').height());
            $("#myCanvas").css("position", "relative");
            $("#myCanvas").css("top", 0);
	    $(".htmap").css("width", $('.backimg').width());


            canvas = document.getElementById('myCanvas');
            canvas.width = parseInt($("#myCanvas").css('width'));
            canvas.height = parseInt($("#myCanvas").css('height'));

            context = canvas.getContext('2d');

            $('.canvdiv').unbind('mousemove');

            $('.canvdiv').mousemove(function(ev){
                showDegree(ev);
            });

            $(".par_id").css("height", "100%");
            $(".par_id").css("left", 0);

            $(".info_map").css("height",$('.par_id').height() - 40);
            $(".info_map").css("width", "100%");
            $(".info_map").css("position", "relative");

            $('.max_val').css("height", 20);
            $('.min_val').css("height", 20);

            var inf_config = {
                container: document.querySelector('.info_map'),
                opacity: .6,
                blur: .95,
                gradient: {
                    '1': '#ff2837',
                    '.75': '#FFFF00',
                    '.5': '#00FF33',
                    '.25': '#0099FF',
                }
            };

            $(".info_map").get(0).innerHTML = '';

            var point = {
                x: $(".info_map").width() / 2,
                y: 0,
                radius: $(".info_map").height(),
                value: 20,
            };

            var points = [];
            points.push(point);

            var data = {
                min: 0,
                max: 20,
                data: points,
            };

            var heatmapInfo = h337.create(inf_config);
            heatmapInfo.setData(data);
            heatmapInfo.repaint();
        }
    }

    function getXY(evt, offset) {
        var relativeX = (evt.pageX - offset.left);
        var relativeY = (evt.pageY - offset.top);

        return {x:Math.round(relativeX), y:Math.round(relativeY)};
    }

    function get_col(degree){
        var gradientColorsYR = [];
        var gradientColorsGY = [];
        var gradientColorsBG = [];
        var color;
        var opacityVal = (degree - 15)/(20/0.7)+ 0.15;

        var startColor = "#00FF33", endColor = "#0099FF";
        var start = xolor(startColor);
        for(var n=0; n<5; n++) {
            gradientColorsBG.push(start.gradient(endColor, n/5))
        }

        startColor = "#FFFF00";
        endColor = "#00FF33";
        start = xolor(startColor);
        for(var n=0; n<4; n++) {
            gradientColorsGY.push(start.gradient(endColor, n/4))
        }

        startColor = "#ff2837";
        endColor = "#FFFF00";
        start = xolor(startColor);
        for(var n=0; n<4; n++) {
            gradientColorsYR.push(start.gradient(endColor, n/4))
        }

        if (degree < 17){
            color = "#0099FF";
        }

        if (degree >= 17 && degree <=21){
            color = gradientColorsBG[Math.ceil(21 - degree)].hex;
        }

        if (degree < 23 && degree > 21){
            color = "#00FF33";
        }

        if (degree >= 23 && degree <=26){
            color = gradientColorsGY[Math.ceil(26 - degree)].hex;
        }

        if (degree > 26 && degree < 29){
            color = "#FFFF00";
        }

        if (degree >= 29 && degree <=32){
            color = gradientColorsYR[Math.ceil(32-degree)].hex;
        }

        if (degree > 32){
            color = "#ff2837";
        }

        return {color:color, opacityVal:opacityVal};
    }

    function update_vals(){
        for (var i = 0; i < heatmapInstance.data.length; i++){
            
	    var init = send_request(devs[i],graphs[i],i);
           // if (i < devs_N){
            heatmapInstance.data[i].value = init.val;
         //   }
         //   else{
         //       heatmapInstance.data[i].value = t;
         //   }
            var tmp = get_col(heatmapInstance.data[i].value);
            heatmapInstance.data[i].color = tmp.color;
            heatmapInstance.data[i].opacityVal = tmp.opacityVal;
        }
        if (altText != undefined) {
            altText.text =  heatmapInstance.data[altText.i].value.toFixed(1) + "\u00B0 C";
        }
        showMap(heatmapInstance);

        return heatmapInstance;
    }

    function showMap(heatmapInstance){

        var canvas = document.getElementById('myCanvas');
        canvas.width = parseInt($("#myCanvas").css('width'));
        canvas.height = parseInt($("#myCanvas").css('height'));

        var context = canvas.getContext('2d');

        for (var i = 0; i < heatmapInstance.data.length; i++) {
            context.globalAlpha = heatmapInstance.data[i].opacityVal;
            context.beginPath();
            context.arc(heatmapInstance.data[i].x, heatmapInstance.data[i].y, heatmapInstance.data[i].radius, 0, 2 * Math.PI, false);
            context.fillStyle = heatmapInstance.data[i].color;
            context.fill();
        }

        if (altText != undefined) {

            context.globalAlpha = 1;
            context.fillStyle = "black";
            context.font = "15pt status-bar";

            context.fillText(altText.text, altText.x, altText.y);
            var textWidth = context.measureText(altText.text).width;

            context.fillStyle = 'white';
            context.fillRect(altText.x, altText.y+4,textWidth, -24);

            context.fillStyle = "black";
            context.font = "15pt status-bar";
            context.fillText(altText.text, altText.x, altText.y);

            var textWidth = context.measureText(altText.text).width;

            context.strokeStyle = 'black';
            context.lineWidth = 0.5;
            context.strokeRect(altText.x, altText.y+4,textWidth, -24);
            context.beginPath();

            if (altText.x < heatmapInstance.data[altText.i].x) {
                context.moveTo(altText.x + textWidth, altText.y);
                context.lineTo(heatmapInstance.data[altText.i].x, heatmapInstance.data[altText.i].y);
                context.stroke();
            } else {
                context.moveTo(altText.x, altText.y);
                context.lineTo(heatmapInstance.data[altText.i].x, heatmapInstance.data[altText.i].y);
                context.stroke();
            }
            return true;
        }
    }

    function add_new(heatmapInstance,point){
        var tmp = get_col(point.value);
        point.color = tmp.color;
        point.opacityVal = tmp.opacityVal;
        heatmapInstance.data.push(point);
        showMap(heatmapInstance);

        return heatmapInstance;
    }

    function img_load(im){
        if (im.height > im.width) {
            $('.prev').css('height', '90%');
        }
        else {
            $('.prev').css('width', '100%');
        }

        $('<div id="ok_div">'+
            '<input class="ok_but button-like" value="Ok" type="button">'+
            '</div>').appendTo($('#preview'));

        $('.ok_but').click(function (event) {
            okclick();
        });
        if  ( $('.toggle').css('display') == 'none') {
            $('#preview').css('display', 'none');
            $('.toggle').css('display', 'inline-block');

            $('.contain-block').css('display', 'inline-block')
            $(".toggle").animate({width: "45%"},
                function () {
                    $('#preview').animate({height: 'toggle'});
                }
            );

            $("#DynamicExtraFieldsContainer").animate({width: "45%"});

            $(".put_together").animate({
                width: "74%"
            });
        }
        else{
            if (im.height > im.width) {
                $(".prev").css('width',0);
                $(".prev").animate({width:'100%'});
            }
            else {
                $(".prev").css('width',0);
                $(".prev").animate({width:'100%'});
            }
        }
    }

    function showDegree(e){
        var coords = getXY(e,  $('.canvdiv').offset());

        for (var i = 0; i < heatmapInstance.data.length; i++) {
            if (Math.pow((coords.x - heatmapInstance.data[i].x), 2) + Math.pow((coords.y - heatmapInstance.data[i].y), 2) <= Math.pow(heatmapInstance.data[i].radius, 2)) {
                var canvas = document.getElementById('myCanvas');
                canvas.width = parseInt($("#myCanvas").css('width'));
                canvas.height = parseInt($("#myCanvas").css('height'));

                var context = canvas.getContext('2d');

                if (coords.x < heatmapInstance.data[i].x){
                    coords.x = coords.x - 60;
                }
                else{
                    coords.x = coords.x ;
                }

                if (coords.y < heatmapInstance.data[i].y){
                    coords.y = coords.y ;
                }
                else{
                    coords.y = coords.y + 30;
                }

                altText = {
                    text: heatmapInstance.data[i].value.toFixed(1) + "\u00B0 C",
                    x: coords.x,
                    y:coords.y,
                    i:i,
                }
                showMap(heatmapInstance);

                return true;
            }
        }
        if (altText!= undefined){
            altText = undefined;
            showMap(heatmapInstance);
        }
    }

    function laterSuccess(data){
        if(data=='invalid'){
            $("#err").html("Invalid File !").fadeIn();
        }
        else{
            $('.toggle').css('float','unset');

            $("#preview").animate({height:'toggle'},
                function(){
                    $("#preview").html(data).fadeIn();
                    $('.toggle').css('max-height',$('.put_together').css('max-height')/2)

                    $("#preview").css('max-height', $('.put_together').css('max-height')/2);
                    $("#preview").css('text-align','center');

                    $("#form")[0].reset();
                    var im=new Image();
                    im.src = $('.prev').get(0).src;

                    im.onload = function(){
                        $('<div id="ok_div">'+
                            '<input class="ok_but button-like" value="Ok" type="button">'+
                            '</div>').appendTo($('#preview'));

                        $('.ok_but').click(function (event) {
                            okclick();
                        });
                        if (im.height > im.width) {
                            $(".prev").css('width',0);
                            $(".prev").animate({width:'100%'});
                        }
                        else {
                            $(".prev").css('width',0);
                            $(".prev").animate({width:'100%'});
                        }
                    }
                }
            );
        }
    }

    function okclick () {
        heatmapInstance.data = [];
        showMap(heatmapInstance);
        $('.AddDevice').show();
        var img = $(".prev").get(0).src;

        $('.togSet').css('width', $('#hidBut').width());
	$('#hidSet').css('height', 30);
        elems(img);
        $('.set_firstpart').css('position', "relative");
        $('.set_firstpart').css('width', "100%");
        $(".put_together").css("width","95%");
        $(".put_together").css("max-height","96%");
        $('#hidSet').css('min-width', 57);
        $('#hidSet').show();
	$('#hidBut').css('z-index',1);
        $('.set_firstpart').hide();

        $('#hidBut').unbind('click');

        $('#hidBut').click(function(e){
            if ($('.set_firstpart').css('display') != 'none') {
                $('.set_firstpart').animate({
                    width: 'toggle'
                });

                $('.map_holder').animate({
                        width: '95%',
                        overflow:'hidden'
                    },
                    function(){
                        $('.map_holder').css('overflow','hidden');
                    });

                $('.togSet').animate({width: $('#hidBut').width()});
            }
            else {
                $('.map_holder').animate({
                        width: '79%',overflow:'hidden'
                    },
                    function(){
                        $('.map_holder').css('overflow','hidden');
                    });

                $('.set_firstpart').show();
                $('.togSet').animate({width: '20%'});

            }
        });

        $('.toggle').css('border-left-style','none');
        $('.toggle').css('border-top-style','solid');
        $('.toggle').css('padding-left',0);

        $('#DynamicExtraFieldsContainer').css('float','unset');

        $("#form").unbind('change');

        $("#form").on('change',(function(e) {
                e.preventDefault();

                uploadRequest(laterSuccess,this);

            })
        );

        $('#DynamicExtraFieldsContainer').css('display','block');
        $('#DynamicExtraFieldsContainer').css('width','100%');
        $('#DynamicExtraFieldsContainer').css('max-height','40%');

        $('.toggle').css('width','100%');
        $('.toggle').css('max-height','60%');
        $('#preview').css('max-height','50%');
        $('.put_together').css('width','96%');
    }

    function delDeviceBut(event,param){
        for (var i = 0; i < devs.length; i++){
            if (devs[i]==$(param).parent().parent().children().children().children().children().get(1).value){
                if (graphs[i] == $(param).parent().parent().children().children().children().children().get(3).value){
                    devs.splice(i,1);
                    graphs.splice(i,1);
                    heatmapInstance.data.splice(i,1);
                    showMap(heatmapInstance);
                    break;
                }
            }
        }

        $(param).parent().parent().get(0).remove();
	devs_N--;

        if ($('.set_firstpart').height() < $('.put_together').height()){
            $('#DynamicExtraFieldsContainer').css('height', $('.set_firstpart').height() -  $('.toggle').height());
            $('#DynamicExtraFieldsContainer').css('overflow','auto');
        }
        else{
            $('#DynamicExtraFieldsContainer').css('overflow','auto');
        }

        return false;
    }

    function addDeviceBut(event,param){
        var childval = $(param).parent().parent().children().children().children().children();
        if ( childval.get(1).value == '' || childval.get(3).value == ''){
            $('.hint-text').get(1).innerHTML = 'Both fields must be filled in';

            var RealHint =  $(param).data('hint');

            $(RealHint).css('left',event.pageX - 15);
            $(RealHint).css('top',event.pageY - 50);
            $(RealHint).toggle('fast');

            $(document).unbind('click');
            setTimeout(function(){
                $(document).click(function (e){
                    if ($(e.target).hasClass('real-hint')==false) {
                    $('.real-hint').hide('fast');
                    return;}
                });
                setTimeout(function (){
                    $('.real-hint').hide('slow');
                },4000);
             },1000);

            return;
        }
	
        $(param).hide();
	
        childval[1].setAttribute('readonly','');
        childval[3].setAttribute('readonly','');

        devs.push(childval.get(1).value);
        graphs.push(childval.get(3).value);

        devs_N++;

        $('.htmap').mousemove(function (ev) {
            $('.canvdiv').unbind('mousemove');
            altText = undefined;
            var coords = getXY(ev,  $('.htmap').offset());
            var new_point = getXY(ev,  $('.htmap').offset());

            new_point.radius = 80;
            heatmapInstance.data.push(new_point);
            showMap(heatmapInstance);
            heatmapInstance.data.pop();
        });
        $('.htmap').unbind('mousedown');
        $('.htmap').unbind('click');
        $('.htmap').click( function (e) {
            $('.htmap').unbind('mousemove');
            
            $('.canvdiv').mousemove(function(ev){
                showDegree(ev);
        });
        altText = undefined;
        var new_point = getXY(e,  $('.htmap').offset());

		var response = send_request(devs[devs_N - 1], graphs[devs_N - 1], -1);
        new_point.value = response.val;//

		$('.hint-text').get(0).innerHTML = '';
		setTimeout(function(){
			$('.hint-text').get(0).innerHTML = response.mes;},500);

	  	var RealHint =  $('.htmap').data('hint');
		if (new_point.y - 104 >0){
	  	    $(RealHint).css('top',new_point.y - 104);
		} else{
		    $(RealHint).css('top',new_point.y + 104);
		}
	  	$(RealHint).css('left',e.pageX);
	  	$(RealHint).toggle('fast'); 

	    $(document).unbind('click');
	    setTimeout(function(){
		$(document).click(function (e){ 
		    if ($(e.target).hasClass('real-hint')==false) {
		        $('.real-hint').hide('fast');
		  	return;}
		});
		setTimeout(function (){
            $('.real-hint').hide('slow');
            },4000);
				
	    },1000);

	    $('.htmap').unbind('click');
	    $('.htmap').mousedown(function(e){
			    heatmapClick(e,this);
	    });
	    new_point.radius = 80;
        heatmapInstance.data.push(new_point);
        showMap(heatmapInstance);
        });
    }

 function addDynamicExtraField() {
        var div = $('<div/>', {
            'class': 'DynamicExtraField'
        }).appendTo($('#DynamicExtraFieldsContainer'));

        var	first_subdiv = $('<div/>', {
            'class': 'dev-nam'
        }).appendTo($('.DynamicExtraField'));

        var sec_subdiv = $('<div/>', {
            'class': 'graph-nam'
        }).appendTo($('.DynamicExtraField'));

        var third_subdiv = $('<div/>', {
            'class': 'del_but'
        }).appendTo($('.DynamicExtraField'));

        var add_num = $('.dev-nam').get().length - 1;

        $('.dev-nam').get(add_num).innerHTML = ''+
            '<div class = "lab_tex">'+
            '	<div class = "lab">'+
            '		<label>Device name</label>'+
            '	</div>'+
            '	<div class = "tex">'+
            '		<input type="textfield" name="DynamicDev[]" cols="50"></input>'+
            '	</div>'+
            '</div>';

        $('.graph-nam').get(add_num).innerHTML = ''+
            '<div class = "lab_tex">'+
            '	<div class = "lab">'+
            '		<label>Graph name</label>'+
            '	</div>'+
            '	<div class = "tex">'+
            '		<input type="textfield" name="DynamicGraph[]" cols="50"></input>'+
            '	</div>'
        '</div>';

        $('.del_but').get(add_num).innerHTML = ''+
            '<input value="Place" type="button" data-hint="#real-hint-2" class="button-like AddDevice"/>'+
            '<input value="Delete" type="button" class="button-like DeleteDynamicExtraField">';

        if ($('.set_firstpart').height() < $('.put_together').height()){
            $('#DynamicExtraFieldsContainer').css('height', $('#DynamicExtraFieldsContainer').css('max-height'));
            $('#DynamicExtraFieldsContainer').css('overflow','auto');
        }
        else{
            $('#DynamicExtraFieldsContainer').css('overflow','auto');
        }

        $('.AddDevice').unbind('click');

        $('.AddDevice').click(function(event) {
            addDeviceBut(event,this);
        });

	$('.DeleteDynamicExtraField').unbind('click');

        $('.DeleteDynamicExtraField').click(function(event) {
            delDeviceBut(event,this);
        });
    }

function Gauss() {
    var ready = false;
    var second = 0.0;

    this.next = function(mean, dev) {
        mean = mean == undefined ? 0.0 : mean;
        dev = dev == undefined ? 0.1 : dev;//1.0 : dev;

        if (this.ready) {
            this.ready = false;
            return this.second * dev + mean;
        }
        else {
            var u, v, s;
            do {
                u = 2.0 * Math.random() - 1.0;
                v = 2.0 * Math.random() - 1.0;
                s = u * u + v * v;
            } while (s > 1.0 || s == 0.0);

            var r = Math.sqrt(-2.0 * Math.log(s) / s);
            this.second = r * u;
            this.ready = true;
            return r * v * dev + mean;
        }
    };
}

function start() {
    initVals();
    initStyle();
    initEvents();
}

function get_json(request){
    var r = {val:{},toString:function(){return this.val}};

    var jso = $.ajax ({
        url: zurl,
        type: "POST",
        async: false,
        data: JSON.stringify(request),
        dataType: "json",
        contentType:"application/json"
    }).done(function( res) {
        return res;
    }).responseJSON;
    return jso;
}

function send_request(device, item_name, number){
    var t;

    var request = {
        "jsonrpc": "2.0",
        "method": "user.login",
        "params": {
            "user": user,
            "password": pass
        },
        "id": 1,
        "auth": null
    };

    key = get_json(request);

    if (key == undefined){
        if (number < 0){
            t = (20 * Math.random()) + 15;
        }
        else {
            t = heatmapInstance.data[number].value;
            var d_t = 10*g.next();
            t = (t + d_t)%20 + 15;
        }
        return {mes: "Authorization error<br>Random values initialized", val: t} ;
    }

    key  = key.result;
    var request = {
        "jsonrpc": "2.0",
        "method": "host.get",
        "params": {
            "output": [
                "hostid",
                "host"
            ],
            "selectInterfaces": [
                "interfaceid",
                "ip"
            ]
        },
        "id": 2,
        "auth": key
    }

    var res = get_json(request);

    for (var i = 0; i < res.result.length; i++){
        if(res.result[i].host == device){
            var host_num = i;
        }
    }

    if (host_num == undefined){
        if (number < 0){
            t = (20 * Math.random()) + 15;
        }
        else {
            t = heatmapInstance.data[number].value;
            var d_t = 10*g.next();
            t = (t + d_t)%20 + 15;
        }
        return {mes: "Host '" + device + "' not found<br>Random values initialized", val: t} ;
    }

    request = {
        "jsonrpc": "2.0",
        "method": "graph.get",
        "params": {
            "output": "extend",
            "hostids": res.result[host_num].hostid,
            "sortfield": "name",
            "selectItems": "id",
        },
        "auth": key,
        "id": 3
    }

    var item_res = get_json(request);
    for (var i = 0; i < item_res.result.length; i++)
    {
        if(item_res.result[i].name == item_name){
            var temp_graph = item_res.result[i];
        }

    }

    if (temp_graph == undefined){
        if (number < 0){
            t = (20 * Math.random()) + 15;
        }
        else {
            t = heatmapInstance.data[number].value;
            var d_t = 10*g.next();
            t = (t + d_t)%20 + 15;
        }
        return {mes: "Graph '" + item_name + "' not found<br>Random values initialized", val: t} ;

    }

    request = {
        "jsonrpc": "2.0",
        "method": "history.get",
        "params": {
            "output": "extend",
            "history": 0,
            "itemids": temp_graph.items["0"],
            "sortfield": "clock",
            "sortorder": "DESC",
            "limit": 1
        },
        "auth": key,
        "id": 4
    }

    var item_key = get_json(request);
    var point1 = parseFloat(item_key.result["0"].value);

    return {mes: "Host '" + device + "' initialized", val:point1};
}

function fetch(){
    $("#resultscontainer *").prop('disabled',true);
    if ($('#icao').val() != ""){
        $.ajax({
            url: "https://avwx.rest/api/metar/"+$('#icao').val()+"?options=&format=json&onfail=cache",
            dataType : 'json',
            type : 'get',
            cache : false,
            success : function (data){
                fetchAirportInfo(data.flight_rules);
                $('#errormsg').empty();
                if ($('#rawdecoded').val() == "raw"){
                    raw(data);
                }
                else{
                    decode(data); 
                }
            },
            error : function (data){
                $('#airportname').empty();
                $('#flightrules').empty();
                $('#results').empty();
                $('#errormsg').text("Invalid ICAO or service is unavailable please try again later.");
            }
        });
    }
}

function fetchAirportInfo(flight_rules){
    if ($('#icao').val() != ""){
        $.ajax({
            url: "https://avwx.rest/api/station/"+$('#icao').val(),
            dataType : 'json',
            type : 'get',
            cache : false,
            success : function (data){
                $('#airportname').text(data.city + " " + data.name + ", " + data.country); //"<br>"+flight_rules+"<span class=\""+flight_rules+"dot\"></span>"
                $('#flightrules').html("<span class=\""+flight_rules+"dot\"></span>("+flight_rules+")");
            },
            error : function (data){
                $('#errormsg').text("Invalid ICAO or service is unavailable please try again later.");
            }
        });
    }
}

function raw(data){
    $('#results').text(data.raw);
}

function decode(data){
    report = "<table id=\"resultstable\">"
    //Wind - #TODO Report gusting - and VRB
    report = report + "<tr><td id=\"leftcol\">Winds</td><td id=\"rightcol\">"+data.wind_direction.repr+" degrees at "+data.wind_speed.repr+" "+data.units.wind_speed+"</td></tr>"
    
    //Altimiter
    report = report + "<tr><td id=\"leftcol\">Altimeter</td><td id=\"rightcol\">"+data.altimeter.repr+" "+data.units.altimeter+"</td></tr>"
    //Clouds
    cloud = ""
    $.each(data.clouds,function(index,item){
        cloud = cloud + item.type + " at " + item.altitude*100 +data.units.altitude+"<br>";
    });
    report = report + "<tr><td id=\"leftcol\">Clouds</td><td id=\"rightcol\">"+cloud+"</td></tr>"

    //Vis
    report = report + "<tr><td id=\"leftcol\">Visiblity</td><td id=\"rightcol\">"+data.visibility.value+" "+data.units.visibility+"</td></tr>"

    //Temp
    report = report + "<tr><td id=\"leftcol\">Temperature</td><td id=\"rightcol\">"+data.temperature.value+" "+data.units.temperature+"</td></tr>"
    report = report + "<tr><td id=\"leftcol\">Dew point</td><td id=\"rightcol\">"+data.dewpoint.value+" "+data.units.temperature+"</td></tr>"
    //Remarks
    report = report + "<tr><td id=\"leftcol\">Remarks</td><td id=\"rightcol\">"+data.remarks+"</td></tr>"
    //Display
    report = report + "</table>"
    $('#results').html(report);
}


$(document).on('keypress',function(e) {
    if(e.which == 13) {
        fetch();
    }
});
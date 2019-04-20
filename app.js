function fetch(){
    console.log($('#icao').val());
    if ($('#icao').val()!= ""){
        $.getJSON("https://avwx.rest/api/metar/"+$('#icao').val()+"?options=&format=json&onfail=cache", function(data){
            $('#results').text(data.raw);
        });
    }
}
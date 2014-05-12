function resetCompetition() {
    $.post("admin-reset", function(data){
        console.log("Result: " + JSON.stringify(data));
    });
}

function changeBand () {
    var bandName = $('#bandName')[0].value;
    $.post("admin-band-name", {'bandName': bandName}, function(data){
        console.log("Result: " + JSON.stringify(data));
    })
        .done(function(data) {alert(data.message);})
        .fail(function() {alert("Failed to update band.");});
}

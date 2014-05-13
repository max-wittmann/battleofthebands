function resetCompetition() {
    $.post("admin-reset", function(data){
        console.log("Result: " + JSON.stringify(data));
    });
}

function changeBand () {
    var bandName = $('#bandName')[0].value;
    $.post("admin-band-name", {'bandName': bandName}, function(data){
        console.log("Change Band: " + JSON.stringify(data));
    }).success(function(data) {alert(data.message);})
      .fail(function() {alert("Failed to update band.");});
}

function pickWinner() {
    $.post("admin-pick-winner", {}, function(data){
        console.log("Pick Winner: " + JSON.stringify(data));
    }).success(function(data) { alert("The winner is " + data.name); })
      .fail(function(data) {alert("Failed to pick winner - " + JSON.stringify(data));})
}

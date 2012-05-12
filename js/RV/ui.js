/**
 * @johnwilander
 */
RV = window.RV ? window.RV : {};

RV.ui = (function() {
    "use strict";

    var lastButtonClicked = 0;

    $("#loadButton1").click(function(e) {
        $.getScript($("#robotSrcOne").val());
        lastButtonClicked = 1;
    });

    $("#loadButton2").click(function(e) {
        $.getScript($("#robotSrcTwo").val());
        lastButtonClicked = 2;
    });

    $("#varButton").click(function(e) {
        var interval = $("#interval").val();
        if (!interval) {
            interval = 200;
        }
        window.RV_INTERVAL = setInterval(RV.engine.update, interval);
        RV.engine.update();
    });

    return {
        populateUi: function(robotName, eyes, tracks, lasers, shields, uiNumber) {
            var number = uiNumber? uiNumber : lastButtonClicked;
            console.log("Populating UI");
            $("#robotName" + number).html(robotName);
            $("#eyes" + number).html(eyes);
            $("#tracks" + number).html(tracks);
            $("#lasers" + number).html(lasers);
            $("#shields" + number).html(shields);
            return number;
        }
    };
}());

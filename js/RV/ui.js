/**
 * @johnwilander
 */
RV = window.RV ? window.RV : {};

RV.ui = (function() {
    var lastButtonClicked;

    $("#loadButton1").click(function(e) {
        $.getScript($("#robotSrcOne").val());
        lastButtonClicked = 1;
    });

    $("#loadButton2").click(function(e) {
        $.getScript($("#robotSrcTwo").val());
        lastButtonClicked = 2;
    });

    return {
        populateUi : function(robotName, eyes, tracks, lasers, shields) {
            $("#robotName" + lastButtonClicked).text(robotName);
            $("#robotEyes" + lastButtonClicked).text(eyes);
            $("#robotTracks" + lastButtonClicked).text(tracks);
            $("#robotLasers" + lastButtonClicked).text(lasers);
            $("#robotShields" + lastButtonClicked).text(shields);
            return lastButtonClicked;
        }
    };
}());


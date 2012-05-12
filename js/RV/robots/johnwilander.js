/**
 * @johnwilander
 */

(function() {
    var name = "johnwilander",
        configuration = {
            eyes: 2, tracks: 2, lasers: 3, shields: 3
        },
        _init = function() {
            return {
                getMoves: function(viewOfTheWorld, status) {
                    var i, shots = 0, trackMoves = 0, tileContains, move = [], arr = viewOfTheWorld.array;
                    for (i = 0; i < arr.length; i++) {
                        tileContains = arr[i].contains;
                        if (shots < configuration.lasers && tileContains.indexOf("robot") !== -1) {
                            for (; shots < configuration.lasers; shots++){
                                move.push("shoot:" + arr[i].direction);
                            }
                        }
                        if (trackMoves < configuration.tracks && tileContains.indexOf("empty") !== -1) {
                            for (; trackMoves < configuration.tracks; trackMoves++){
                                move.push("move:" + arr[i].direction);
                            }
                        }
                    }
                    return move;
                },
                warCry: "Bohica!",
                killCry: "#Winning",
                defeatedCry: "Screw you guys"
            };

        };
    RV.engine.registerRegularRobot({
        name: name,
        configuration: configuration,
        init: function() {
            return _init();
        }
    });
}());

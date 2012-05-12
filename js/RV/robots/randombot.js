/**
 * @johnwilander
 */

(function() {
    var name = "randombot",
        configuration = {
            eyes: 3, tracks: 3, lasers: 3, shields: 3
        },
        _init = function() {
            return {
                getMoves: function(viewOfTheWorld, status) {
                    var i, shots = 0, trackMoves = 0, tileContains, move = [], arr = viewOfTheWorld.array,
                        randomDirection;
                    switch (Math.floor(Math.random() * 4)) {
                        case 0:
                            randomDirection = "north";
                            break;
                        case 1:
                            randomDirection = "east";
                            break;
                        case 2:
                            randomDirection = "south";
                            break;
                        case 3:
                            randomDirection = "west";
                            break;
                    }

                    for (i = 0; i < arr.length; i++) {
                        tileContains = arr[i].contains;
                        if (shots < configuration.lasers && tileContains.indexOf("robot") !== -1) {
                            for (; shots < configuration.lasers; shots++){
                                move.push("shoot:" + arr[i].direction);
                            }
                        }
                        if (trackMoves < configuration.tracks && tileContains.indexOf("empty") !== -1 && arr[i].direction === randomDirection) {
                            for (; trackMoves < configuration.tracks; trackMoves++){
                                move.push("move:" + arr[i].direction);
                            }
                        }
                    }
                    return move;
                },
                warCry: "Fight!",
                killCry: "I did it for the lulz",
                groan: "Just a flesh wound",
                defeatedCry: "Pure luck"
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

/**
 * @johnwilander
 */

(function() {
    var name = "johnwilander",
        configuration = {
            eyes: 3, tracks: 3, lasers: 3, shields: 3
        },
        whereILastSawAnOpponent = "nowhere",
        haventSeenAnOpponentFor = 0,
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
                        if (tileContains.indexOf("robot") !== -1) {
                            whereILastSawAnOpponent = arr[i].direction;
                            haventSeenAnOpponentFor = 0;
                            if (shots < configuration.lasers) {
                                for (; shots < configuration.lasers; shots++){
                                    move.push("shoot:" + arr[i].direction);
                                }
                            }
                        } else {
                            haventSeenAnOpponentFor++;
                        }

                        // Move in this direction if ...
                        // I *can* move in this direction AND
                        // I recently saw an opponent in this direction OR
                        // 20% of the times when I haven't seen an opponent lately or ever
                        if (trackMoves < configuration.tracks && tileContains.indexOf("empty") !== -1 &&
                            (whereILastSawAnOpponent === arr[i].direction && haventSeenAnOpponentFor < 6) ||
                            arr[i].direction === randomDirection) {
                            for (; trackMoves < configuration.tracks; trackMoves++) {
                                move.push("move:" + arr[i].direction);
                            }
                        }
                    }

                    return move;
                },
                warCry: "Bohica!",
                killCry: "#Winning",
                groan: "Gaah",
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

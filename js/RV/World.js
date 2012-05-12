/**
 * @johnwilander
 */
RV = window.RV ? window.RV : {};

RV.World = function(width, height) {
    "use strict";

    var world,
        view = RV.view(),
        robotPositions = [],

        _createWorld = function() {
            var x, y;
            // World array is accessed via world[x][y]
            world = new Array(width);
            for (x = 0; x < width; x++) {
                world[x] = new Array(height);
                for (y = 0; y < height; y++) {
                    if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
                        world[x][y] = "wall";
                    } else {
                        world[x][y] = "empty";
                    }
                }
            }
        },

        _getWhatAPositionContains = function(position) {
            var column = world[position.x];
            if (column === undefined || column[position.y] === undefined) {
                return "invisible";
            } else {
                return column[position.y];
            }
        },

        _getViewOfTheWorld = function(robotName, sightLength) {
            var viewOfTheWorld, i, column, positionInfo, viewAsArray, obj,
                posX = robotPositions[robotName].x, posY = robotPositions[robotName].y;
            if(posX < 0 || posX >= width || posY < 0 || posY >= height) {
                throw new Error("Position outside world. Cannot give view of the world.");
            } else {
                viewOfTheWorld = {};
                viewOfTheWorld.array = [];
                // i start at 1 since the robot sees one step ahead per iteration
                for (i = 1; i <= sightLength; i++) {

                    // North, aka y-i
                    viewOfTheWorld["north" + i+1] = {contains: _getWhatAPositionContains({ x: posX, y: posY-i }), direction: "north"};
                    viewOfTheWorld.array.push(viewOfTheWorld["north" + i+1]);

                    // East, aka x+i
                    viewOfTheWorld["east" + i+1] = {contains: _getWhatAPositionContains({ x: posX+i, y: posY }), direction: "east"};
                    viewOfTheWorld.array.push(viewOfTheWorld["east" + i+1]);

                    // South, aka y+i
                    viewOfTheWorld["south" + i+1] = {contains: _getWhatAPositionContains({ x: posX, y: posY+i }), direction: "south"};
                    viewOfTheWorld.array.push(viewOfTheWorld["south" + i+1]);

                    // West, aka x-i
                    viewOfTheWorld["west" + i+1] = {contains: _getWhatAPositionContains({ x: posX-i, y: posY }), direction: "west"};
                    viewOfTheWorld.array.push(viewOfTheWorld["west" + i+1]);
                }
            }
            return viewOfTheWorld;
        },

        _getEmptyPosition = function() {
            var randX, randY;
            do {
                randX = Math.floor(Math.random() * width);
                randY = Math.floor(Math.random() * height);
            } while (world[randX][randY].indexOf("empty") === -1);
            return {
                x: randX,
                y: randY
            };
        },

        _placeRobotInEmptyPosition = function(robotName) {
            var emptyPosition = _getEmptyPosition();
            robotPositions[robotName] = emptyPosition;
            world[emptyPosition.x][emptyPosition.y] = robotName;
//            console.log("Placed robot " + robotName + " in position x: " + robotPositions[robotName].x + ", y: " + robotPositions[robotName].y);
        },

        _parseAction = function(action) {
            var parsedAction;
            if (!(typeof action === "string") || action.indexOf(":") === -1 || action.length > 11) {
                throw new Error("Error parsing action: " + action);
            }
            parsedAction = action.split(":");
            if (parsedAction.length === 2 &&
                (parsedAction[0] === "move" || parsedAction[0] === "shoot") &&
                (parsedAction[1] === "north" || parsedAction[1] === "east" || parsedAction[1] === "south" || parsedAction[1] === "west")) {
                return parsedAction;
            } else {
                throw new Error("Error parsing action, unrecognized action or direction: " + action);
            }
        },

        _isPositionEmpty = function(position) {
            return _getWhatAPositionContains(position) === "empty";
        },

        _setPositionEmpty = function(position) {
            world[position.x][position.y] = "empty";
        },

        _setPositionContained = function(position, containsWhat) {
            world[position.x][position.y] = containsWhat;
        },

        _containsRobot = function(position) {
            var contained = world[position.x][position.y];
            if (contained.indexOf("robot") !== -1) {
                return contained.split(":")[1];
            } else {
                return false;
            }
        },

        _move = function(robotName, direction) {
            var x = robotPositions[robotName].x, y = robotPositions[robotName].y;
//            console.log("About to move robot " + robotName + " to the " + direction);

            switch (direction) {
                case "north":
                    if(_isPositionEmpty( { x: x, y: y - 1 })) {
                        robotPositions[robotName].y = y - 1;
                        _setPositionContained( { x: x, y: (y-1) }, "robot:" + robotName);
                        _setPositionEmpty( { x: x, y: y } );
                    }
                    break;
                case "east":
                    if(_isPositionEmpty( { x: x + 1, y: y })) {
                        robotPositions[robotName].x = x + 1;
                        _setPositionContained( { x: (x+1), y: y }, "robot:" + robotName);
                        _setPositionEmpty( { x: x, y: y } );
                    }
                    break;
                case "south":
                    if(_isPositionEmpty( { x: x, y: y + 1 })) {
                        robotPositions[robotName].y = y + 1;
                        _setPositionContained( { x: x, y: (y+1) }, "robot:" + robotName);
                        _setPositionEmpty( { x: x, y: y } );
                    }
                    break;
                case "west":
                    if(_isPositionEmpty( { x: x - 1, y: y })) {
                        robotPositions[robotName].x = x - 1;
                        _setPositionContained( { x: (x-1), y: y }, "robot:" + robotName);
                        _setPositionEmpty( { x: x, y: y } );
                    }
                    break;
            }
            return true;
        },

        _shoot = function(robotName, direction) {
            var x = robotPositions[robotName].x, y = robotPositions[robotName].y,
                hasHit = false, position, robotHit = false;
//            console.log("About to let robot " + robotName + " to shoot to the " + direction);

            while (!hasHit) {
                switch (direction) {
                    case "north":
                        position = { x: x, y: y - 1 };
                        if(_isPositionEmpty(position)) {
                            y--;
                        } else {
                            hasHit = true;
                            robotHit = _containsRobot(position);
                        }
                        break;
                    case "east":
                        position = { x: x + 1, y: y };
                        if(_isPositionEmpty(position)) {
                            x++;
                        } else {
                            hasHit = true;
                            robotHit = _containsRobot(position);
                        }
                        break;
                    case "south":
                        position = { x: x, y: y + 1 };
                        if(_isPositionEmpty(position)) {
                            y++;
                        } else {
                            hasHit = true;
                            robotHit = _containsRobot(position);
                        }
                        break;
                    case "west":
                        position = { x: x - 1, y: y };
                        if(_isPositionEmpty(position)) {
                            x--;
                        } else {
                            hasHit = true;
                            robotHit = _containsRobot(position);
                        }
                        break;
                }
            }  // end while

            return robotHit;  // Robot's name if hit, else just false
        },

        _act = function (robotName, action) {
            var parsedAction = _parseAction(action);
            switch (parsedAction[0]) {
                case "move":
                    return _move(robotName, parsedAction[1]);
                    break;
                case "shoot":
                    return _shoot(robotName, parsedAction[1]);
                    break;
                default:
                    throw new Error("Unrecognized action: " + parsedAction[0]);
            }
        },

        _draw = function () {
            view.drawCanvas(robotPositions);
            view.toggleTitleCaret();
        };


    _createWorld();
    view.init(width, height);

    return {
        placeRobotInEmptyPosition: function(robotName) {
            _placeRobotInEmptyPosition(robotName);
        },
        /**
         * Returns the robot's view of the world. For a robot with two working eyes this could be the result:
         * {
         *   north1: { contains: 'empty'     , direction: 'north' },
         *   east1:  { contains: 'empty'     , direction: 'east'  },
         *   south1: { contains: 'wall'      , direction: 'south' },
         *   west1:  { contains: 'robot:wtf' , direction: 'west'  }
         *   north2: { contains: 'empty'     , direction: 'north' },
         *   east2:  { contains: 'wall'      , direction: 'east'  },
         *   south2: { contains: 'invisible' , direction: 'south' },
         *   west2:  { contains: 'hole'      , direction: 'west'  }
         * }
         * ... whichs corresponds to:
         *
         *  -------- -------- -------- -------- --------
         * |        |        |        |        |        |
         * |        |        | Empty  |        |        |
         * |        |        |        |        |        |
         *  -------- -------- -------- -------- --------
         * |        |        |        |        |        |
         * |        |        | Empty  |        |        |
         * |        |        |        |        |        |
         *  -------- -------- -------- -------- --------
         * |        |        | Your   |        |        |
         * | Hole   | Robot2 | robot  | Empty  | Wall   |
         * |        |        | here   |        |        |
         *  -------- -------- -------- -------- --------
         * |        |        |        |        |        |
         * |        |        | Wall   |        |        |
         * |        |        |        |        |        |
         *  -------- -------- -------- -------- --------
         * |        |        | In-    |        |        |
         * |        |        | visible|        |        |
         * |        |        |        |        |        |
         *  -------- -------- -------- -------- --------
         *
         * The reason for starting at 1 is that the robot itself is standing at 0.
         * @param posX The robot's current x position
         * @param posY The robot's current y position
         */
        getViewOfTheWorld: function(robotName, sightLength) {
            return _getViewOfTheWorld(robotName, sightLength);
        },
        act: function(robotName, action) {
            return _act(robotName, action);
        },
        draw: function() {
            _draw();
        }
    };
};

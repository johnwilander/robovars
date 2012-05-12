/**
 * @johnwilander
 */
RV = window.RV ? window.RV : {};

RV.World = function(width, height) {
    "use strict";

    var world,
        view = RV.view(),
        robots = [],

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

        _getViewOfTheWorld = function(robotName, sightLength) {
            console.log("_getViewOfTheWorld sightLength == " + sightLength);
            var viewOfTheWorld, i, column, positionInfo, viewAsArray, obj,
                posX = robots[robotName].x, posY = robots[robotName].y;
            if(posX < 0 || posX >= width || posY < 0 || posY >= height) {
                throw new Error("Position outside world. Cannot give view of the world.");
            } else {
                viewOfTheWorld = {};
                // i start at 1 since the robot sees one step ahead per iteration
                for (i = 1; i <= sightLength; i++) {
                    console.log("_getViewOfTheWorld in loop");

                    // North, aka y-i
                    column = world[posX];
                    if (column === undefined) {
                        viewOfTheWorld["north" + i+1] = {contains: "invisible", direction: "north"};
                    } else {
                        positionInfo = column[posY-i];
                        if (positionInfo === undefined) {
                            viewOfTheWorld["north" + i+1] = {contains: "invisible", direction: "north"};
                        } else {
                            viewOfTheWorld["north" + i+1] = {contains: positionInfo, direction: "north"};
                        }
                    }

                    // East, aka x+i
                    column = world[posX+i];
                    if (column === undefined) {
                        viewOfTheWorld["east" + i+1] = {contains: "invisible", direction: "east"};
                    } else {
                        positionInfo = column[posY];
                        if (positionInfo === undefined) {
                            viewOfTheWorld["east" + i+1] = {contains: "invisible", direction: "east"};
                        } else {
                            viewOfTheWorld["east" + i+1] = {contains: positionInfo, direction: "east"};
                        }
                    }

                    // South, aka y+i
                    column = world[posX];
                    if (column === undefined) {
                        viewOfTheWorld["south" + i+1] = {contains: "invisible", direction: "south"};
                    } else {
                        positionInfo = column[posY+i];
                        if (positionInfo === undefined) {
                            viewOfTheWorld["south" + i+1] = {contains: "invisible", direction: "south"};
                        } else {
                            viewOfTheWorld["south" + i+1] = {contains: positionInfo, direction: "south"};
                        }
                    }

                    // West, aka x-i
                    column = world[posX-i];
                    if (column === undefined) {
                        viewOfTheWorld["west" + i+1] = {contains: "invisible", direction: "west"};
                    } else {
                        positionInfo = column[posY];
                        if (positionInfo === undefined) {
                            viewOfTheWorld["west" + i+1] = {contains: "invisible", direction: "west"};
                        } else {
                            viewOfTheWorld["west" + i+1] = {contains: positionInfo, direction: "west"};
                        }

                    }
                }
            }
            viewAsArray = [];
            for(obj in viewOfTheWorld) {
                if (viewAsArray.hasOwnProperty(obj)) {
                    viewAsArray.push(obj);
                }
            }
            viewOfTheWorld.array = viewAsArray;
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
            robots[robotName] = _getEmptyPosition();
            console.log("Placed robot " + robotName + " in position x: " + robots[robotName].x + ", y: " + robots[robotName].y);
        },

        _parseAction = function(action) {
            var parsedAction;
            if (!(action instanceof "string") || action.indexOf(":") === -1 || action.length > 11) {
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

        _move = function(robotName, direction) {
            console.log("About to move robot " + robotName + " to the " + direction);
        },

        _shoot = function(robotName, direction) {
            console.log("About to let robot " + robotName + " to shoot to the " + direction);
        },

        _act = function (robotName, action) {
            var parsedAction = _parseAction(action);
            switch (parsedAction[0]) {
                case "move":
                    _move(robotName, parsedAction[1]);
                    break;
                case "shoot":
                    _shoot(robotName, parsedAction[1]);
                    break;
                default:
                    throw new Error("Unrecognized action: " + parsedAction[0]);
            }
        },

        _draw = function () {
            view.drawCanvas(robots);
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
         *   north1: { contains: 'empty'    , direction: 'north' },
         *   east1:  { contains: 'empty'    , direction: 'east'  },
         *   south1: { contains: 'wall'     , direction: 'south' },
         *   west1:  { contains: 'robot2'   , direction: 'west'  }
         *   north2: { contains: 'empty'    , direction: 'north' },
         *   east2:  { contains: 'wall'     , direction: 'east'  },
         *   south2: { contains: 'invisible', direction: 'south' },
         *   west2:  { contains: 'hole'     , direction: 'west'  }
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
            _act(robotName, action)
        },
        draw: function() {
            _draw();
        }
    };
};

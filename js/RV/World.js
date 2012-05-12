/**
 * @johnwilander
 */
RV = window.RV ? window.RV : {};

RV.World = function(width, height) {
    "use strict";
    var world, x, y,
        _getViewOfTheWorld = function(posX, posY, sightLength) {
            console.log("_getViewOfTheWorld sightLength == " + sightLength);
            var viewOfTheWorld, i, positionInfo;
            if(posX < 0 || posX >= width || posY < 0 || posY >= height) {
                throw new Error("Position outside world. Cannot give view of the world.");
            } else {
                viewOfTheWorld = {};
                // i start at 1 since the robot sees one step ahead per iteration
                for (i = 1; i <= sightLength; i++) {
                    console.log("_getViewOfTheWorld in loop");
                    // North, aka y-i
                    positionInfo = world[posX][posY-i];
                    if (positionInfo === undefined) {
                        viewOfTheWorld["north" + i+1] = "invisible";
                    } else {
                        viewOfTheWorld["north" + i+1] = positionInfo;
                    }
                    // East, aka x+i
                    positionInfo = world[posX+i][posY];
                    if (positionInfo === undefined) {
                        viewOfTheWorld["east" + i+1] = "invisible";
                    } else {
                        viewOfTheWorld["east" + i+1] = positionInfo;
                    }
                    // South, aka y+i
                    positionInfo = world[posX][posY+i];
                    if (positionInfo === undefined) {
                        viewOfTheWorld["south" + i+1] = "invisible";
                    } else {
                        viewOfTheWorld["south" + i+1] = positionInfo;
                    }
                    // West, aka x-i
                    positionInfo = world[posX-i][posY];
                    if (positionInfo === undefined) {
                        viewOfTheWorld["west" + i+1] = "invisible";
                    } else {
                        viewOfTheWorld["west" + i+1] = positionInfo;
                    }
                }
            }
            return viewOfTheWorld;
        };

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

    return {
        /**
         * Returns the robot's view of the world. For a robot with one working eye this could be the result:
         * {
         *   north1: ‘empty’, east1: ‘empty’, south1: ‘hole’, west1: ‘robot2’
         * }
         * For a robot with three working eyes, this could be the result:
         * {
         *   north1: ‘empty’,  east1: ‘empty’, south1: ‘hole’, west1: ‘robot2’,
         *   north2: ‘empty’,  east2: ‘wall’, south2: ‘empty’, west2: ‘empty’,
         *   north3: ‘empty’,  east3: ‘invisible’, south3: ‘wall’, west3: ‘empty’
         * }
         * The reason for starting at 1 is that the robot itself is standing at 0.
         * @param posX The robot's current x position
         * @param posY The robot's current y position
         */
        getViewOfTheWorld: function(posX, posY, sightLength) {
            return _getViewOfTheWorld(posX, posY, sightLength);
        },
        draw: function() {

        }
    };
};

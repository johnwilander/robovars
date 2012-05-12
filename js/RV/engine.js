/**
 * @johnwilander
 */
RV = window.RV ? window.RV : {};

RV.engine = (function() {
    "use strict";

    var robots = [], deadRobots = [],
        MAX_CONFIG_POINTS = 50,
        world = RV.World(8, 8),
        currentGameTurn = null,

    // Registration functions
        _nameOK = function(name) {
            if(typeof name === "string" && name.length <= 20) {
                return true;
            } else {
                console.log("Erroneous robot name:");
                console.log(name);
                return false;
            }
        },

        _configurationOK = function(config) {
            if( (config.eyes >= 1 && config.tracks >= 1 && config.lasers >= 1 && config.shields >= 1) &&
                (typeof config.eyes === "number" && typeof config.tracks === "number" && typeof config.lasers === "number" && typeof config.shields === "number") &&
                ((config.eyes + config.tracks + config.lasers + config.shields) * 5 <= MAX_CONFIG_POINTS) ) {
                return true;
            } else {
                console.log("Erroneous robot configuration:");
                console.log(config);
                return false;
            }
        },

        _initFunctionOK = function(init){
            if(typeof init === "function") {
                return true;
            } else {
                console.log("Erroneous robot init function:");
                console.log(init);
                return false;
            }
        },

        _registerRegularRobot = function(robot) {
            var nextIndex;
            console.log("About to register robot");
            if(_nameOK(robot.name) && _configurationOK(robot.configuration) && _initFunctionOK(robot.init)) {
                nextIndex = robots.length;
                robots[nextIndex] = robot.init();
                robots[nextIndex].name = robot.name;
                robots[nextIndex].status = robot.configuration;
                world.placeRobotInEmptyPosition(robot.name);
                console.log("Registered robot " + robot.name);
            }
        },

        _pickRandomNumberWhileAvoiding = function(max, not) {
            var rand;
            if (not.length >= max) {
                throw new Error("Risk of infinite loop since not.length >= max. Exiting.");
            }
            do {
                rand = Math.floor(Math.random() * max);
            } while (not.indexOf(rand) !== -1);
            return rand;
        },

        _createRandomizedListOfRobotIndices = function() {
            var robotIndicesNotToPick = deadRobots.slice(0),  // Copy the array of dead robots
                robotIndicesInOrderForThisUpdate = [], nextRobotIndex;
            while (robotIndicesNotToPick.length < robots.length) {
                // Randomly pick the next robot
                nextRobotIndex = _pickRandomNumberWhileAvoiding(robots.length, robotIndicesNotToPick);
                // Push this robot to its ordered position
                robotIndicesInOrderForThisUpdate.push(nextRobotIndex);
                // This robot is picked so don't pick it again
                robotIndicesNotToPick.push(nextRobotIndex);
            }
            return robotIndicesInOrderForThisUpdate;
        },

        _createGameTurn = function() {
            var robotIndicesInOrderForThisUpdate = _createRandomizedListOfRobotIndices(),
                currentRobot, moves = [], currentMoves, maxMoves = 0, i;
            for (i = 0; i < robotIndicesInOrderForThisUpdate.length; i++) {
                currentRobot = robots[robotIndicesInOrderForThisUpdate[i]];
                currentMoves = currentRobot.getMoves(world.getViewOfTheWorld(currentRobot.name, currentRobot.status.eyes));
                moves.push( {
                        name: currentRobot.name,
                        moves: currentMoves
                });
                // The robot with most moves sets the limit
                maxMoves = Math.max(maxMoves, currentMoves.length);
            }
            return {
                moves: moves,
                moveIndex: 0,
                finalMoveIndex: maxMoves - 1
            }
        },

        _update = function() {
            var currentMove, i;
            if (!currentGameTurn) {
                // New full game turn
                currentGameTurn = _createGameTurn();
            }
            if (currentGameTurn.finalMoveIndex >= currentGameTurn.moveIndex) {
                // Moves to execute in this game turn, do them in order
                for (i = 0; i < currentGameTurn.moves.length; i++) {
                    currentMove = currentGameTurn.moves[i];
                    world.act(currentMove.name, currentMove.moves[currentGameTurn.moveIndex]);
                }
                currentGameTurn.moveIndex++;
            } else {
                currentGameTurn = null;
            }
            world.draw();
        }

    return {
        /**
         * Register a robot
         * @param robot For example
         * RV.engine.registerRegularRobot(
         *                     {
         *                       name: "johnwilander",
         *                       configuration: {
         *                         eyes: 2, tracks: 2, lasers: 3, shields: 3
         *                       },
         *                       init: function() {
         *                         return {
         *                           getMoves: function(viewOfTheWorld, status) {
         *                             return [ 'shoot:south', 'shoot:south', 'move:east', 'shoot:south', 'move:west' ]
         *                           },
         *                           warCry: "Bohica!",
         *                           killCry: "#Winning",
         *                           defeatedCry: "Screw you guys"
         *                         };
         *                       }
         *                     });
         */
        registerRegularRobot: function(robot) {
            _registerRegularRobot(robot);
        },
        update: function() {
            _update.call();
        }
    };
}());

Object.freeze(RV);
Object.freeze(RV.__proto__);

setInterval(RV.engine.update, 2000);

/*
 ,
 _registerTweetRobot = function(robot) {

 }
 ,
 registerTweetRobot: function(robot) {
 if(robot.n && typeof robot.n === "string" && robot.n.length <= 20 &&
 robot.c && typeof robot.c === "object" &&
 robot.i && typeof robot.i === "function") {
 _registerTweetRobot.call(robot);
 } else {
 console.log("Basic error in tweet robot. robot.n == " + robot.n + ", robot.c == " + robot.c + ", robot.i == " + robot.i);
 }
 }
 */
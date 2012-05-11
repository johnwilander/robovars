/**
 * @johnwilander
 */
RV = {};

RV.engine = (function() {
    "use strict";
    var robots = [], deadRobots = [],
        MAX_CONFIG_POINTS = 50,
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
            if(_nameOK(robot.name) && _configurationOK(robot.configuration) && _initFunctionOK(robot.init)) {
                nextIndex = robots.length;
                robots[nextIndex] = robot.init();
                robots[nextIndex].name = robot.name;
                robots[nextIndex].status = robot.configuration;
            }
        },
        _pickRandomNumber = function(max, not) {
            var rand;
            if (not.length >= max) {
                console.log("Risk of infinite loop since not.length >= max. Exiting.");
                throw new Error();
            }
            do {
                rand = Math.floor(Math.random() * max);
            } while (not.indexOf(rand) !== -1);
            return rand;
        },
        _getCurrentViewOfTheWorld = function(robot) {
            var blindedNorth = false, blindedEast = false, blindedSouth = false, blindedWest = false;
        },
        _step = function(robot) {
            var step = robot.move(_getCurrentViewOfTheWorld(robot));
        },
        _update = function() {
            var robotIndicesNotToPick = deadRobots.slice(0),  // Copy
                robotIndicesInOrderForThisUpdate = [], nextRobotIndex, i;
            while (robotIndicesNotToPick.length < robots.length) {
                nextRobotIndex = _pickRandomNumber(robots.length, robotIndicesNotToPick);
                robotIndicesInOrderForThisUpdate.push(nextRobotIndex);
                robotIndicesNotToPick.push(nextRobotIndex);
            }
            for (i = 0; i < robotIndicesInOrderForThisUpdate.length; i++) {
                _step(robots[robotIndicesInOrderForThisUpdate[i]]);
            }
        };

    return {
        registerRegularRobot: function(robot) {
            _registerRegularRobot.call(robot);
        },
        update: function() {
            _update.call();
        }
    };
}());

Object.freeze(RV);
Object.freeze(RV.prototype);

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
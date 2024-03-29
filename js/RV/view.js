/**
 * @johnwilander
 */
RV = window.RV ? window.RV : {};

RV.view = function() {
    "use strict";
    var canvas = document.getElementById("robovarsCanvas"),
        context = canvas.getContext("2d"),
        TILE_WIDTH = 32, TILE_HEIGHT = 32,
        backgroundReady = false, heroReady = false, goblinReady= false,
        backgroundImage = new Image(), heroImage = new Image(), goblinImage = new Image(),

        _toggleTitleCaret = function() {
            var title = $("#roboVarsTitle");
            if (title.html() == "RoboVars") {
                title.html("RoboVars&#8248;");
            } else {
                title.html("RoboVars");
            }
        },

        _init = function (canvasWidthInTiles, canvasHeightInTiles) {
            canvas.width = canvasWidthInTiles * TILE_WIDTH;
            canvas.height = canvasHeightInTiles * TILE_HEIGHT;

            backgroundImage.onload = function() {
                backgroundReady = true;
            };
            backgroundImage.src = "img/background.png";

            heroImage.onload = function() {
                heroReady = true;
            };
            heroImage.src = "img/hero.png";

            goblinImage.onload = function() {
                goblinReady = true;
            };
            goblinImage.src = "img/goblin.png";
        },

        // Currently only supports exactly two robots. First robot is hero, second is the goblin.
        _drawCanvas = function(robots) {
            var currentRobot, currentX, currentY, currentName;
            if (backgroundReady) {
                context.drawImage(backgroundImage, 0, 0);
            }

            for (currentRobot in robots) {
                currentX = robots[currentRobot].x;
                currentY = robots[currentRobot].y;
                if(currentRobot === "johnwilander") {
                    if (heroReady) {
                        context.drawImage(heroImage, currentX * TILE_WIDTH, currentY * TILE_HEIGHT);
                    }
                } else {
                    if (goblinReady) {
                        context.drawImage(goblinImage, currentX * TILE_WIDTH, currentY * TILE_HEIGHT);
                    }
                }
            }
        };

    return {
        init: function(widthInTiles, heightInTiles) {
            _init(widthInTiles, heightInTiles);
        },
        drawCanvas: function(robots) {
            _drawCanvas(robots);
        },
        toggleTitleCaret: function() {
            _toggleTitleCaret();
        }
    };
}

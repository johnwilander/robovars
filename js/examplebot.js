RV.engine.registerRegularRobot({
    name: "johnwilander",
    configuration: {
        eyes: 2, tracks: 2, lasers: 3, shields: 3
    },
    init: function() {
        return {
            getMoves: function(viewOfTheWorld, status) {
                return [ 'shoot:south', 'shoot:south', 'move:east', 'shoot:south', 'move:west' ]
            },
            warCry: "Bohica!",
            killCry: "#Winning",
            groan: "Oh no",
            defeatedCry: "Screw you, guys"
        };
    }
});
const PADD = 50;
const SCREENWIDTH = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor;

module.exports = function(props) {
    const $ = Ti.UI.createView({
        height : 20,
        left : 15,
        top : 8,
        bottom:8,
        right : 15,
        backgroundColor : 'transparent'
    });
    $.add(Ti.UI.createView({
        left : PADD,
        right : PADD,
        borderWidth : 0.5,
        borderColor : props.color,
        backgroundColor : 'black'
    }));
    $.progressBar = Ti.UI.createView({
        left : 0,
        width : '0%',
        height : 20,
        width : props.progress || '0%',
        backgroundColor : props.color
    });
    $.children[0].add($.progressBar);
    $.startView = Ti.UI.createLabel({
        left : 5,
        width : PADD,

        text : "",
        textAlign : 'left',
        color : 'white'
    });
    $.endView = Ti.UI.createLabel({
        right : 5,
        text : "",
        textAlign : 'right',
        color : 'white'
    });
    $.add($.startView);
    $.add($.endView);
    return $;
};

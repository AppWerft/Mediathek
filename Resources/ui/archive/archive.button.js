const BroadcastsDialog = require("ui/archive/broadcasts.dialog");

module.exports = function() {
   const $ = Ti.UI.createView({
        height : 100,
        bottom : -100,
        color : 'white',
        backgroundColor : '#5933AC'
    });
    $.add(Ti.UI.createView({
        backgroundColor : "white",
        height : 1,
        left : 10,
        right : 10,
        top : 10
    }));
    $.add(Ti.UI.createLabel({
        text : "   Audio-Archiv   ",
        top : 2,
        backgroundColor : '#5933AC',
        color : "white",
        font : {
            fontSize : 12,
            fontWeight : 'bold'
        }
    }));
    setTimeout(function() {
        $.addEventListener("swipe", BroadcastsDialog);
        $.animate({
            bottom : -80
        });
    }, 2200);
    return $;
 };   
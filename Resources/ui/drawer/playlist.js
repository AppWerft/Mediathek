module.exports = function() {
    const $ = Ti.UI.createView({
        height :45
    });
    $.add(Ti.UI.createLabel({
        color : 'white',
        left : 10,
        right : 70,
        text : "Mediathek bietet Zusatzfunktion „Playlist“"
    }));
     $.add(Ti.UI.createSwitch({
        color : 'white',
        right : 5,
        enabled : false,
        value : false
    }));
    return $;
};

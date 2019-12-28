module.exports = function() {
    const $ = Ti.UI.createView({
        height : 45
    });
    $.add(Ti.UI.createLabel({
        color : 'white',
        left : 10,
        right : 50,
        text : "Lokale Kopie sofort nach Abspielen löschen"
    }));
     $.add(Ti.UI.createSwitch({
        color : 'white',
        right : 5,
          enabled : false,
        value : true
    }));
    return $;
};

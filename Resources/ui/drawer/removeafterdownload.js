const Settings = require('controls/settings');
const KEY = "REMOVEAFTERDOWNLOAD";

module.exports = function() {
    const $ = Ti.UI.createView({
        height : 45
    });
    $.add(Ti.UI.createLabel({
        color : 'white',
        left : 10,
        right : 90,
        text : "Lokale Kopie sofort nach Abspielen löschen"
    }));
     $.add(Ti.UI.createSwitch({
        color : 'white',
        right : 5,
          enabled : true,
        value : Settings.get(KEY)
    }));
    $.children[1].addEventListener("change", e => {
        Settings.set(KEY, e.value);
    });
    return $;
};

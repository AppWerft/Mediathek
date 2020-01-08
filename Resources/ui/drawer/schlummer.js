const Settings = require('controls/settings');
const KEY = "SCHLUMMER";
module.exports = function() {
    const $ = Ti.UI.createView({
        height : 45
    });
    $.add(Ti.UI.createLabel({
        color : 'white',
        left : 10,
        text : "Live-Radio mit Schlummerfunktion"
    }));
     $.add(Ti.UI.createSwitch({
        color : 'white',
        right : 5,
        
        value : Settings.get(KEY)
    }));
    $.children[1].addEventListener("change", e => {
        Settings.set(KEY, e.value);
    });
    return $;
};

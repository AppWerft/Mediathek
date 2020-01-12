const DEPOT = "SETTINGS9";

const DEFAULTS = {
    REMOVEAFTERDOWNLOAD : false,
    SD : true,
    AUDIOFOCUS : true,
    SCHLUMMER : true,
    VISULINE : true,
    VISUBAR : true,
    VIBRATION : true,
    LONGPRESS :false,
    SWIPE : false
};

if (!Ti.App.Properties.hasProperty(DEPOT))
    Ti.App.Properties.setString(DEPOT, JSON.stringify(DEFAULTS));

exports.set = (k,v) => {
    var Depot = JSON.parse(Ti.App.Properties.getString(DEPOT, '{}'));
    Depot[k] = v;
    Ti.App.Properties.setString(DEPOT, JSON.stringify(Depot));
};
exports.get = k => {
    const Depot = JSON.parse(Ti.App.Properties.getString(DEPOT, '{}'));
    return Depot[k];
};

exports.styles = {
    left : 10,
    right : 70,
    font : {
        fontSize : 18,
        fontWeight : 'bold',
    },
    color : '#555',
};

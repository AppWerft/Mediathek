const Global = require('global');
const opts = {
    width : '33.3%',
    height : Ti.UI.FILL,
    color : 'white',
    textAlign : 'center',
    text : {
        fontWeight : 'bold',
        fontFamily : 'ScalaSansBold'
    }
};

module.exports = () => {
    const $ = Ti.UI.createView({
        bottom : 0,
        height : 50
    });
    $.add(Ti.UI.createLabel({
        ndx : 0,
        code : 'dlf',
        bottom : 0,
        height : 45,
        backgroundColor : Global.Stations.dlf.color,
        width : '33.3%',
        color : 'white',
        textAlign : 'center',
        text : {
            fontFamily : 'ScalaSansBold'
        },
        textAlign : 'center',
        left : 0,
        text : Global.Stations.dlf.name
    }));
    $.add(Ti.UI.createLabel({
        ndx : 1,
        bottom : 0,
        height : 45,
        backgroundColor : Global.Stations.drk.color,
        code : 'drk',
        width : '33.3%',
       
        textAlign : 'center',

        color : 'white',
        textAlign : 'center',
        text : {
            fontWeight : 'bold',
            fontFamily : 'ScalaSansBold'
        },
        text : Global.Stations.drk.name,
    }));
    $.add(Ti.UI.createLabel({
        ndx : 2,
        code : 'drw',
        backgroundColor : Global.Stations.drw.color,
        bottom : 0,
        height : 45,
        right : 0,

        width : '33.3%',

        color : 'white',
        textAlign : 'center',
        text : {
            fontFamily : 'ScalaSansBold'
        },
        text : Global.Stations.drw.name
    }));
    return $;
};

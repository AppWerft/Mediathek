module.exports = function() {
    const $ = Ti.UI.createScrollView({
        backgroundColor : '#5933AC',
        layout : 'vertical',
        scrollType : 'vertical'

    });
    $.add(Ti.UI.createImageView({
        image: '/images/rainerhongkong.png',
        width: Ti.UI.FILL,
        height: 'auto',
        top : 0
    }));
    $.add(Ti.UI.createLabel({
        top : 5,
        left : 10,
        textAlign : 'left',
        width : Ti.UI.FILL,
        height : Ti.UI.SIZE,
        text : "Einstellungen",
        color : 'white',
        font : {
            fontWeight : 'bold',
            fontSize : 22,
            fontFamily:'Aller'
        }
    }));
    $.add(require('ui/drawer/wifi')());
    $.add(require('ui/drawer/removeafterdownload')());
    $.add(require('ui/drawer/sd')());
    $.add(require('ui/drawer/schlummer')());
    $.add(require('ui/drawer/playlist')());
    $.add(Ti.UI.createLabel({
        top : 5,
        left : 10,
        textAlign : 'left',
        width : Ti.UI.FILL,
        height : Ti.UI.SIZE,
        text : "Erklärungen zu den Permissions",
        color : 'white',
        font : {
            fontWeight : 'bold',
            fontSize : 22,
            fontFamily:'Aller'
        }
    }));
    $.add(Ti.UI.createLabel({
        top : 10,
        left : 10,
        right:10,
        text : "Damit das Radio stummgeschaltet werden kann, wenn ein Telephonanruf reinkommt, braucht es die TELEPHONESTATUS-Berechtigung.",
        font : {
            fontWeight : 'normal',
            fontFamily:'Aller'
        }
    }));
    $.add(Ti.UI.createLabel({
        top : 10,
         left : 10,
        right:10,
        
        text : "Die Zappelanzeige braucht die AUDIORECORDER-Berechtigung. Das ist eine Vorgabe der Android-Klasse „Visualisation“",
         font : {
            fontWeight : 'normal',
            fontFamily:'Aller'
        }
    }));
    $.add(Ti.UI.createLabel({
        top : 10,
         left : 10,
        right:10,
        
        text : "Für den Offlinebetrieb müssen die Sendungen lokal gespeichert werden. Um die Verschwendung des (engbemessenen) internen Speichers zu schonen, wird versucht die Daten auf der externen Karte zu speichern. Dazu braucht das System diese EXTERNALSTORAGE-Zugriffsberechtigung.\n\n\n",
         font : {
            fontWeight : 'normal',
            fontFamily: 'Aller'
        }
    }));

    return $;
};

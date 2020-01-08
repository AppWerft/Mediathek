const lila = '#5933AC';

module.exports = function(parent) {
    const $ = Ti.UI.createScrollView({
        backgroundColor : lila,
        layout : 'vertical',
        scrollType : 'vertical'

    });
    $.add(Ti.UI.createImageView({
        image: '/images/rainerhongkong.png',
        width: Ti.UI.FILL,
        height: 'auto',
        top : 0
    }));
    /*SUCHE*/
   $.searchRow = Ti.UI.createView({
        top : 0,
        backgroundColor : lila,
        height : 50
    });
    $.searchRow.add(Ti.UI.Android.createSearchView({
        color : '#fff',
        hintText : "Suche …"
    }));
    $.add($.searchRow);
    $.searchRow.children[0].addEventListener("submit", e => {
        console.log("submit on search");
        parent.Drawer.toggleLeft();
        require('ui/searchresult.window')(e.source.value).open();
    });
    
    $.add(Ti.UI.createLabel({
        top : 5,
        left : 10,
        textAlign : 'left',
        width : Ti.UI.FILL,
        height : Ti.UI.SIZE,
        text : "Einstellungen (noch nicht wirksam)",
        color : 'white',
        font : {
            fontWeight : 'bold',
            fontSize : 20,
            fontFamily:'Aller'
        }
    }));
    $.add(require('ui/drawer/removeafterdownload')());
    $.add(require('ui/drawer/sd')());
    $.add(require('ui/drawer/schlummer')());
  //  $.add(require('ui/drawer/playlist')());
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
            fontSize : 20,
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

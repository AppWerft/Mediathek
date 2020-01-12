const lila = '#5933AC';
const Moment = require('vendor/moment');

module.exports = function(parent) {
    const $ = Ti.UI.createScrollView({
        backgroundColor : lila,
        layout : 'vertical',
        scrollType : 'vertical'

    });
    $.add(Ti.UI.createImageView({
        image : '/images/rainerhongkong.png',
        width : Ti.UI.FILL,
        height : 'auto',
        top : 0
    }));
    /*SUCHE*/
    $.add(Ti.UI.createLabel({
        top : 5,
        left : 10,
        textAlign : 'left',
        width : Ti.UI.FILL,
        height : Ti.UI.SIZE,
        text : "Suche",
        color : 'white',
        font : {
            fontWeight : 'bold',
            fontSize : 20,
            fontFamily : 'Aller'
        }
    }));
    $.searchRow = Ti.UI.createView({
        top : 0,
        backgroundColor : lila,
        height : 50
    });
    $.searchRow.add(Ti.UI.Android.createSearchView({
        color : '#fff',
        hintText : "Suchebegriff"
    }));
    
    var yearPicker = Ti.UI.createPicker({
        right : 5,
        width:100,
        selectionIndicator : true,
        borderColor : 'yellow',
        borderWidth : 1
    });
    
    $.searchRow.add(yearPicker);

    /*var data = ['alle'];

    for (var y = Moment().year(); y > 2000; y--) {
        data.push(Ti.UI.createPickerRow({
            title : '' + y
        }));
    }*/
   var data = [];
data[0]=Ti.UI.createPickerRow({title:'Bananas'});
data[1]=Ti.UI.createPickerRow({title:'Strawberries'});
data[2]=Ti.UI.createPickerRow({title:'Mangos'});
data[3]=Ti.UI.createPickerRow({title:'Grapes'});

    yearPicker.add(data);

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
        text : "Einstellungen",
        color : 'white',
        font : {
            fontWeight : 'bold',
            fontSize : 20,
            fontFamily : 'Aller'
        }
    }));
    $.add(require('ui/drawer/removeafterdownload')());
    $.add(require('ui/drawer/sd')());
    $.add(require('ui/drawer/audiofocus')());
    $.add(require('ui/drawer/schlummer')());
    $.add(require('ui/drawer/visubar')());
    $.add(require('ui/drawer/visuline')());
    $.add(require('ui/drawer/vibration')());
    //  $.add(require('ui/drawer/playlist')());
    $.add(Ti.UI.createLabel({
        top : 5,
        left : 10,
        textAlign : 'left',
        width : Ti.UI.FILL,
        height : Ti.UI.SIZE,
        text : "Berechtigungen",
        color : 'white',
        font : {
            fontWeight : 'bold',
            fontSize : 20,
            fontFamily : 'Aller'
        }
    }));
    $.add(Ti.UI.createLabel({
        top : 10,
        left : 10,
        right : 10,
        text : "Damit das Radio stummgeschaltet werden kann, wenn ein Telephonanruf reinkommt, braucht es die TELEPHONESTATUS-Berechtigung.",
        font : {
            fontWeight : 'normal',
            fontFamily : 'Aller'
        }
    }));
    $.add(Ti.UI.createLabel({
        top : 10,
        left : 10,
        right : 10,

        text : "Die Zappelanzeige braucht die AUDIORECORDER-Berechtigung. Das ist eine Vorgabe der Android-Klasse „Visualisation“",
        font : {
            fontWeight : 'normal',
            fontFamily : 'Aller'
        }
    }));
    $.add(Ti.UI.createLabel({
        top : 10,
        left : 10,
        right : 10,
        text : "Für den Offlinebetrieb müssen die Sendungen lokal gespeichert werden. Um die Verschwendung des (engbemessenen) internen Speichers zu schonen, wird versucht die Daten auf der externen Karte zu speichern. Dazu braucht das System diese EXTERNALSTORAGE-Zugriffsberechtigung.\n\n\n",
        font : {
            fontWeight : 'normal',
            fontFamily : 'Aller'
        }
    }));

    return $;
};

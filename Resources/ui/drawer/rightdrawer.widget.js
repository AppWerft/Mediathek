const lila = '#5933AC',
    Storage = require('controls/storage.adapter'),
    Settings = require('controls/settings'),
    
    Moment = require('vendor/moment'),
    Stations = require('model/stations');

module.exports = function(window) {
    const $ = Ti.UI.createListView({
        backgroundColor : lila,
        zIndex : 999,
        templates : {
            'recents' : require('TEMPLATES').recents,
        },
        defaultItemTemplate : 'recents',
        sections : []
    });
   const onitemclickFn = (event) => {
        window.Drawer.closeRight();
        var data = JSON.parse(event.itemId);
        if (Settings.get("VIBRATION"))
            Ti.Media.vibrate([1, 1]);
        require('ui/audioplayer.window').createAndStartPlayer({
            url : data.url,
            duration : data.duration,
            title : data.sendung,
            subtitle : data.title,
            deliveryMode : data.deliveryMode,
            author : data.author,
            station : data.station,
            pubdate : data.pubdate,
            color : data.color
        });

    }
      $.addEventListener('itemclick', onitemclickFn);
    
    $.render = function() {
        $.sections = [];

        $.appendSection(Ti.UI.createListSection({
            items : Storage.getAllRecents().map(function(item) {
               
                const duration = (item.duration > 3600 * 1000)//
                ? Moment(item.duration).utc().format("HH:mm:ss")//
                : Moment(item.duration).utc().format("m") + ' min.';
                const gehört = Moment(item.progress*item.duration).utc().format("mm:ss");
                return {
                    properties : {
                        itemId : JSON.stringify(item),
                        accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE,
                    },
                    sendung : {
                        text : item.subtitle
                    },
                    title : {
                        text : item.title,
                        color : item.color,
                    },
                    progress : {
                        value : item.progress,
                        backgroundColor : item.color,
                        width : (item.progress*100)+'%',
                    },
                    message : {
                        text : 'Gehört: ' + gehört + ' von ' + duration,
                    },
                    author : {
                        text : item.author,
                        height : item.author ? Ti.UI.SIZE : 0
                    },
                   
                    lastaccess : {
                        text : "Letztzugriff: " + Moment(item.lastaccess).format("LLL") + ' Uhr'
                    },
                    pubdate : {
                        text : "Sendezeit: " + Moment(item.pubdate).format("LLL").replace("Invalid date", "unklar…") + ' Uhr'
                    },
                    image : {
                        image : item.image,
                    }
                };
            })
        }));
    };
   
    return $;
};

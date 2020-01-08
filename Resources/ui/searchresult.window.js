var Model = require('model/stations'),
    Moment = require('vendor/moment'),
    Search = require('controls/search.adapter'),
    АктйонБар = require('com.alcoapps.actionbarextras');
Gears = require('ui/gears.widget')();
Gears.bottom = undefined;

module.exports = function(needle) {

    const onOpenFn = function(_event) {
        console.log(">>>> window opened");
        АктйонБар.setTitle('DLF Suche');
        АктйонБар.setSubtitle('Suche nach „' + needle + '“');
        АктйонБар.setFont("Aller");
        АктйонБар.setBackgroundColor('#5933AC');
        var activity = _event.source.getActivity();
        if (activity) {
            activity.onCreateOptionsMenu = function(_menuevent) {
                _menuevent.menu.clear();
                activity.actionBar.displayHomeAsUp = true;
            };
            activity.actionBar.onHomeIconItemSelected = function() {
                $.close();
            };
            activity.invalidateOptionsMenu();
        } else
            console.log("NO ACTIVITY !!!")
    };

    const onitemclickFn = (event) => {
        var data = JSON.parse(event.itemId);
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
    const setDataintoSectionFn = function(_res) {
        $.remove(Gears);
        var total = _res.items.length;
        if (total > 0) {
            Ti.UI.createNotification({
                duration : 5000,
                message : 'Suche nach ' + needle + ' ergab „' + total + '“ Treffer.'
            }).show();
            var items = [];
            _res.items.forEach(function(item) {

                items.push({
                    properties : {
                        itemId : JSON.stringify(item),
                        accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE
                    },
                    image : {
                        image : item.image
                    },
                    title : {
                        text : item.title
                    },
                    sendung : {
                        text : item.sendung,
                        color : item.color
                    },
                    pubdate : {
                        text : 'Sendedatum: ' + item.pubdate + ' Uhr'
                    },
                    duration : {
                        text : 'Dauer: ' + item.duration
                    },
                    author : {
                        text : 'Autor: ' + item.author
                    }
                });
            });
            $.list.sections[_res.section].setItems(items);

        } else
            $.close();
    };
    Search({
        where : 'mediathek',
        needle : needle,
        section : 0,
        done : setDataintoSectionFn
    });
    var $ = Ti.UI.createWindow({
        backgroundColor : '#bb000000',

    });
    
    $.list = Ti.UI.createListView({
        templates : {
            'search' : require('TEMPLATES').search,
        },
        defaultItemTemplate : 'search',
        backgroundColor : 'transparent',
        sections : [Ti.UI.createListSection()]
    });
    $.add($.list);
    $.add(Gears);
    
    $.list.addEventListener('itemclick', onitemclickFn);
    $.addEventListener('open', onOpenFn);
    
    console.log("gears added");
    return $;
};


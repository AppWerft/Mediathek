var Model = require('model/stations'),
    Moment = require('vendor/moment'),
    Settings = require("controls/settings"),
    Filter = require('controls/filter.adapter'),
    АктйонБар = require('com.alcoapps.actionbarextras');
Gears = require('ui/gears.widget')();
Gears.bottom = 0;
Gears.left = 0;

module.exports = function(navwindow,broadcast) {
    const id = broadcast.id;
    const title = broadcast.title;
    var total = 0;
    const onOpenFn = function(_event) {
        АктйонБар.setTitle('DLF Audio-Archiv');
        АктйонБар.subtitle = title;
        АктйонБар.setFont("Aller");
        АктйонБар.setBackgroundColor('#5933AC');
        АктйонБар.setStatusbarColor('#5933AC');
        var activity = _event.source.getActivity();
        if (activity) {
            activity.onCreateOptionsMenu = function(_menuevent) {
                var µ = _menuevent.menu;
                µ.clear();
                activity.actionBar.displayHomeAsUp = true;
                $.menuItem = µ.add({
                    actionView : $.searchView,
                    showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM | Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
                });
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
    const setDataintoSectionFn = function(_res) {
        $.remove(Gears);
        if (_res.count > 0) {
            var sec = Math.round(_res.duration / 1000);
            /* Ti.UI.createNotification({
             duration : 10000,
             message : 'Suche nach ' + needle + ' ergab „' + _res.count + '“ Treffer.\nDer Server brauchte ' + sec + ' sec. um das rauszusuchen'
             }).show();*/
            total += _res.count;
            if (_res.page == 1)
                $.add(require('ui/filterbutton.widget')(function() {
                    $.menuItem.expandActionView();

                }));
          АктйонБар.setSubtitle( title + ': ' + total + ' Beiträge');
            var items = [];
            var sectionIndex = _res.page - 1;
            _res.items.forEach(function(item) {
                items.push({
                    properties : {
                        searchableText : item.title + item.author + item.sendung,
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
                        text : 'Sendedatum: ' + item.pubdate
                    },
                    duration : {
                        text : 'Dauer: ' + item.durationHHmmss
                    },
                    author : {
                        text : 'Autor: ' + item.author
                    }
                });
            });
            $.list.appendSection(Ti.UI.createListSection({
                items : items
            }));
            //            $.list.sections[sectionIndex].setItems(items);

        } else
            $.close();
    };
    Filter(id, 1, setDataintoSectionFn);
    var $ = Ti.UI.createWindow({
        backgroundImage : '/images/rainersinniert.jpg',
        theme : "Theme.AppCompat.Light.DarkActionBar",
        searchView : Ti.UI.Android.createSearchView({
            hintText : "Filter in der Liste",
            submitEnabled : false
        })
    });

    $.list = Ti.UI.createListView({
        templates : {
            'search' : require('TEMPLATES').search,
        },
        defaultItemTemplate : 'search',
        backgroundColor : 'transparent',
        searchView : $.searchView,
        sections : []

    });
    $.add($.list);
    $.add(Gears);
    $.list.addEventListener('itemclick', onitemclickFn);
    $.addEventListener('open', onOpenFn);
    return $;
};


var Stations = require('model/stations'),
    Moment = require('vendor/moment'),
    Settings = require("controls/settings"),
    Search = require('controls/search.adapter'),
    АктйонБар = require('com.alcoapps.actionbarextras');

Gears = require('ui/gears.widget')();
Gears.bottom = 0;
Gears.left = 0;

module.exports = function() {
    var total = 0;
    const onOpenFn = function(_event) {
        АктйонБар.setTitle('Deutschlandfunk ');
        АктйонБар.subtitle = 'Audio-Archiv';
        АктйонБар.setFont("Aller");
        АктйонБар.setBackgroundColor('#5933AC');
        АктйонБар.setStatusbarColor('#5933AC');
        
        var activity = _event.source.getActivity();
        if (activity) {
            activity.actionBar.displayHomeAsUp = true;
            activity.actionBar.onHomeIconItemSelected = function() {
                $.close();
            };
            activity.invalidateOptionsMenu();
        } else
            console.log("NO ACTIVITY !!!")

    };

    const onitemclickFn = (event) => {
        var data = JSON.parse(event.itemId);
        $.navigationWindow.openWindow(require("ui/archive/broadcastings.window")($.navigationWindow,data));
    }
    const setDataintoSectionFn = function(broadcastings) {
        $.remove(Gears);
        const color = broadcastings.color;
        var items = broadcastings.items.map(function(item) {
            return {
                properties : {
                    itemId : JSON.stringify(item),
                    accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE,
                    backgroundColor:  color ? color : undefined
                },

                title : {
                    text : item.title
                   
                }
            };
        });
        $.list.appendSection(Ti.UI.createListSection({
            items : items
        }));
    };
    var $ = Ti.UI.createWindow({
         backgroundImage : '/images/rainersinniert.jpg'
    });
    require('controls/broadcastings')(setDataintoSectionFn, 3, Stations.dlf.color);
    require('controls/broadcastings')(setDataintoSectionFn, 4, Stations.drk.color);
    require('controls/broadcastings')(setDataintoSectionFn, 1, Stations.drw.color);
   // require('controls/broadcastings')(setDataintoSectionFn, 5,"#6825B9");
    $.list = Ti.UI.createListView({
        templates : {
            'archive' : require('TEMPLATES').archive,
        },
        defaultItemTemplate : 'archive',
        backgroundColor : 'transparent',
        sections : []
    });
    $.add($.list);
    $.add(Gears);
    $.list.addEventListener('itemclick', onitemclickFn);
    $.addEventListener('open', onOpenFn);
    return $;
};


var Moment = require('vendor/moment');

module.exports = function(station) {
    if (!station)
        return;
    var model = require('model/stations')[station];
    var self = require('ui/generic.window')({
        title : 'Deutschlandradio',
        subtitle : 'Heutiges Tagesprogramm',
        station : station
    });
    self.list = Ti.UI.createListView({
        height : Ti.UI.FILL,
        backgroundColor : station,
        templates : {
            'schema' : require('TEMPLATES').schema,
        },
        defaultItemTemplate : 'schema',
        sections : [Ti.UI.createListSection({})]
    });
    var items = [];
    require('controls/feed.adapter')({
        url : model.rss,
        onload : function(_feeditems) {
            _feeditems.items.forEach(function(item) {
                items.push({
                    start : {
                        text : Moment(item.pubDate).format('HH:mm')
                    },
                    description : {
                        html : ( typeof item.description == 'string') ? item.description : '',
                        height : ( typeof item.description == 'string') ? Ti.UI.SIZE : 0,

                    },
                    title : {
                        text : item.title,
                        color: model.color
                    }
                });

            });
            self.list.sections[0].setItems(items);
        }
    });
    self.add(self.list);
    self.open();
};

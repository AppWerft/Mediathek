var Favs = new (require('controls/favorites.adapter'))(),
    Model = require('model/stations'),
    Settings = require("controls/settings");

var Moment = require('vendor/moment');
Moment.locale('de');

module.exports = function(_args) {
    var activityworking = true;
    var $ = Ti.UI.createView({
        backgroundColor : '#444',
        station : _args.station,
        color : _args.color,
        date : Moment().startOf('day'),
        itemId : {
            name : _args.station,
            mediathek : _args.mediathek,
        },
    });

    Ti.App.addEventListener('daychanged', function() {
        $.date = Moment().startOf('day');
    });

    $.mainList = Ti.UI.createListView({
        backgroundColor : _args.color,
        templates : {
            'mediathek' : require('TEMPLATES').mediathek,
        },
        defaultItemTemplate : 'mediathek',
        refreshControl : Ti.UI.createRefreshControl({
            tintColor : _args.color
        }),
        sections : [Ti.UI.createListSection({})]
    });

    var dataItems = [];
    var lastPubDate = null;
    var currentMediathekHash = null;
    $.mainList.refreshControl.addEventListener('refreshstart', function(e) {
        $.updateMediathekList();
        setTimeout(function() {
            $.mainList.refreshControl.endRefreshing();
        }, 1000);
    });
    $.updateMediathekList = function() {
        if (activityworking == false) {
            return;
        }
        require('controls/rpc.adapter')({
            url : _args.mediathek,
            station : _args.station,
            nocache : ($.date.isSame(Moment().startOf('day'))) ? true : false,
            date : $.date.format('DD.MM.YYYY'),
            onload : function(_sendungen) {
                if (_sendungen == null)
                    return;
                if (currentMediathekHash == _sendungen.hash)
                    return;
                currentMediathekHash = _sendungen.hash;
                $.mainList.sections = [];
                _sendungen.mediathek.forEach(function(sendung) {
                    var dataitems = [];
                    sendung.subs.forEach(function(item) {
                        item.title = sendung.name;
                        const FORMAT = (item.duration < 60 * 60 * 1000) ? "m:ss" : "H:mm:ss";
                        dataitems.push({
                            properties : {
                                accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE,
                                itemId : JSON.stringify(item),
                            },
                            start : {
                                text : item.start
                            },
                            playtrigger : {
                                bubbleParent : false
                            },
                            title : {
                                color : _args.color,
                                text : '',
                                height : 0
                            },
                            subtitle : {
                                text : item.subtitle,
                            },
                            deliveryMode : {
                                image : item.deliveryMode == "stream" ? "/images/hls.png" : '/images/mp3.png'
                            },
                            fav : {
                                image : item.isfav ? '/images/fav.png' : '/images/favadd.png',
                                opacity : item.isfav ? 0.8 : 0.5
                            },
                            share : {
                                opacity : 0.7
                            },
                            autor : {
                                text : (item.author) ? 'Autor: ' + item.author : '',
                                height : (item.author) ? Ti.UI.SIZE : 0
                            },
                            duration : {
                                text : (item.duration) ? 'Dauer: ' + Moment(item.duration).utc().format(FORMAT) : '',
                            }
                        });
                    });
                    $.mainList.appendSection(Ti.UI.createListSection({
                        headerTitle : sendung.name,
                        items : dataitems
                    }));
                });

            }
        });
    };

    var locked = false;
    var onitemclickFunc = function(_e) {
        var start = new Date().getTime();
        if (locked == true)
            return;
        locked = true;
        setTimeout(function() {
            locked = false;
        }, 700);
        if (_e.bindId && _e.bindId == 'fav') {
            var item = _e.section.getItemAt(_e.itemIndex);
            var isfav = Favs.toggleFav(JSON.parse(item.properties.itemId));
            item.fav.image = isfav ? '/images/fav.png' : '/images/favadd.png';
            item.fav.opacity = isfav ? 0.8 : 0.5;
            _e.section.updateItemAt(_e.itemIndex, item);
        } else if (_e.bindId && _e.bindId == 'share') {
            if (Settings.get("VIBRATION"))
                Ti.Media.vibrate(1, 0);
            require('ui/sharing.chooser')(function(_type) {
                require('vendor/socialshare')({
                    type : _type,
                    message : 'Höre gerade mit der #DRadioMediathekApp „' + JSON.parse(_e.itemId).subtitle + '“ auf ' + Model[_args.station].name,
                    url : JSON.parse(_e.itemId).url,
                    // image : fileToShare.nativePath,
                });
            });
        } else if (_e.bindId && _e.bindId == 'playtrigger') {
            _args.window.removeAllSharedElements();
            var data = JSON.parse(_e.itemId);
            if (Settings.get("VIBRATION"))
                Ti.Media.vibrate([1, 1]);
           
            /*var item = _e.section.getItemAt(_e.itemIndex);
            item.childTemplates[3].childTemplates[0].transitionName="subtitle";
            item.childTemplates[3].childTemplates[1].transitionName="author";
            _e.section.updateItemAt(_e.itemIndex, item);
            */
            //_args.addSharedElement(titleInWinA, "subtitle");
            _args.window.createAndStartPlayer({
                color : _args.color,
                url : data.url,
                duration : data.duration,
                title : data.title,
                subtitle : data.subtitle,
                deliveryMode : data.deliveryMode,
                author : data.author,
                station : data.station,
                pubdate : data.pubdate
            });
        }
    };

    $.mainList.addEventListener('itemclick', onitemclickFunc);
    $.mainList.addEventListener('scrollstart', () => $.calendarButton.hide());
    $.mainList.addEventListener('scrollend', () => $.calendarButton.show());
    Ti.App.addEventListener('app:state', function(_payload) {
        activityworking = _payload.state;
    });
    $.updateMediathekList();
    $.add($.mainList);

    $.calendarButton = require('ui/calendarbutton.widget')($, e => {});
    setTimeout(() => $.add($.calendarButton), 1000);

    return $;
};

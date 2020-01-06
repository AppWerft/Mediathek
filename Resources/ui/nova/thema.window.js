var Flip = require('de.manumaticx.androidflip');

var Moment = require("vendor/moment");
var PAGES = 7;
var themen = require("model/nova");

module.exports = function(_thema) {
    var АктйонБар = require('com.alcoapps.actionbarextras');
    var activityworking = false;
    var $ = Ti.UI.createWindow({
        fullscreen : true,
        layout : "vertical",
        orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
    });
    console.log("NOVA");
    console.log(_thema);
    const banner =Ti.UI.createImageView({
        top : 0,
        image : themen[_thema].image,
        height : "auto"
    });
    $.add(banner);
    $.addEventListener('open', function(_event) {
        АктйонБар.title = "DLF nova";
        АктйонБар.subtitle = themen[_thema].title;
        АктйонБар.titleFont = "ScalaSansBold";
        АктйонБар.backgroundColor = "#01953C";
        АктйонБар.subtitleColor = '#ddd';

        var activity = _event.source.getActivity();
        if (activity) {
            activity.onCreateOptionsMenu = function() {
                activity.actionBar.displayHomeAsUp = true;
            };
            activity.actionBar.onHomeIconItemSelected = function() {
                $.close();
            };
            activity.invalidateOptionsMenu();
        }
    });

    var activityworking = false;
    function onClickFn(_e) {
        var data = JSON.parse(_e.itemId);
        require('ui/audioplayer.window').createAndStartPlayer({
            color : '#000',
            url : data.link,
            duration : data.duration,
            title : data.sendung,
            subtitle : data.title,
            description : data.text,
            station : 'drw',
            image : data.image,
            pubdate : data.pubdate || 'unbekannt'
        });
    }


    $.hideCurrent = function() {

    };
    var sections = [];
    for (var i = 0; i < PAGES; i++)
        sections.push(Ti.UI.createListSection());
    $.mainlist = Ti.UI.createListView({
        top : 0,
        templates : {
            'novathema' : require('TEMPLATES').novathema,
        },
        defaultItemTemplate : 'novathema',
        sections : sections
    });
    $.add($.mainlist);
    var dataItems = [];
    var lastPubDate = null;
    var currentMediathekHash = null;
    /* hiding of todays display */
    $.updateMediathekList = function() {
        for (var ndx = 0; ndx < PAGES; ndx++) {
            require('controls/nova/adapter')(ndx, _thema, function(_sendungen, _ndx) {
                $.remove(banner);
                $.mainlist.sections[_ndx].setItems(require("ui/nova/index.row")(_sendungen, themen[_thema].color));
            });
        }
    };
    var locked = false;
    Ti.App.addEventListener('app:state', function(_payload) {
        activityworking = _payload.state;
    });
    $.updateMediathekList();
    $.mainlist.addEventListener("itemclick", onClickFn);
    $.addEventListener("close", function() {
        $.mainlist.removeEventListener("itemclick", onClickFn);
    });
    $.open();
};

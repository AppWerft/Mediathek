'use strict';
var Favs = new (require('controls/favorites.adapter'))(),
    Model = require('model/stations');
  
var Moment = require('vendor/moment');
Moment.locale('de');
var PAGES = 7;

module.exports = function(_args) {
	var activityworking = false;
	function onMenuFn() {
		require("ui/nova/thema.dialog")();
	}

	function onScrollStartFn() {
		
	}

	function onScrollEndFn() {
		
	}

	function onClickFn(_e) {
		var data = JSON.parse(_e.itemId);
		
		switch (_e.bindId) {
		case 'button':
			require("ui/nova/thema.window")(data.thema.replace("https://www.deutschlandfunknova.de/","")//
			.replace("serien/wissensnachrichten-1","podcasts/download/wissensnachrichten"));
			break;
		case 'share':
			require('vendor/socialshare')({
				type : 'all',
				message : 'Höre gerade mit der #DLFMediathekApp „' + JSON.parse(_e.itemId).subtitle + '“',
				url : JSON.parse(_e.itemId).link,
			});
			break;
		default:
			require('ui/audioplayer.window').createAndStartPlayer({
				color : '#000',
				url : data.link,
				duration : data.duration,
				title : data.sendung,
				subtitle : data.title,
				description : data.text,
				deliveryMode : data.deliveryMode,
				station : 'drw',
				image : data.image,
				pubdate : data.pubdate || 'unbekannt'
			});
		}
	}

	var $ = Ti.UI.createView({
		backgroundColor : '#444',
		station : _args.station,
		date : _args.date ? _args.date : Moment().startOf('day'),
		itemId : {
			name : _args.station,
			mediathek : _args.mediathek,
		},
	});
	$.hideCurrent = function() {

	};
	var sections = [];
	for (var i = 0; i < PAGES; i++)
		sections.push(Ti.UI.createListSection());
	
	$.mainlist = Ti.UI.createListView({
		top : 0,
		backgroundColor : _args.color,
		templates : {
			'nova' : require('TEMPLATES').nova,
		},
		defaultItemTemplate : 'nova',
		refreshControl : Ti.UI.createRefreshControl({
              tintColor : _args.color
        }),
		sections : sections
	});
	$.mainlist.refreshControl.addEventListener('refreshstart',function(e){
        $.updateMediathekList();
        setTimeout(function(){
            $.mainlist.refreshControl.endRefreshing();
         }, 1000);
    });
	$.add($.mainlist);
	var dataItems = [];
	var lastPubDate = null;
	var currentMediathekHash = null;
	/* hiding of todays display */
	$.updateMediathekList = function() {
		for (var ndx = 0; ndx < PAGES; ndx++) {
			require('controls/nova/adapter')(ndx, "thema", function(_sendungen, _ndx) {
				//$.refreshView.setRefreshing(false);
				$.mainlist.sections[_ndx].items=require("ui/nova/index.row")(_sendungen);
			});
		}
	};
	var locked = false;
	//$.mainlist.addEventListener('itemclick', _args.window.onitemclickFunc);
	Ti.App.addEventListener('app:state', function(_payload) {
		activityworking = _payload.state;
	});
	$.updateMediathekList();
	
	$.mainlist.addEventListener("itemclick", onClickFn);
	$.mainlist.addEventListener("scrollstart", onScrollStartFn);
	$.mainlist.addEventListener("scrollend", onScrollEndFn);
	$.addEventListener("close", function() {
	    return;
		$.mainlist.removeEventListener("itemclick", onClickFn);
		$.mainlist.removeEventListener("scrollstart", onScrollStartFn);
		$.mainlist.removeEventListener("scrollstart", onScrollEndFn);
		$.menubutton.removeEventListener("click", onMenuFn);
	});
	return $;
};

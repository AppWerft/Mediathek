var Moment = require('vendor/moment'),
    XMLTools = require('vendor/XMLTools'),
    Stations = require('model/stations'),
    Soup = require("de.appwerft.soup");
Moment.locale('de   ');

var $ = function() {
    this.eventhandlers = {};
    this.dayplan = {};
    var that = this;
    Ti.App.addEventListener('daychanged', function() {
        Ti.UI.createNotification({
            message : 'Tageswechsel:\nSendeplan wird neu geholt.'
        }).show();
        ['dlf', 'drk'].forEach(function(station) {
            var url = Stations[station].dayplan + '?YYYYMMDD=' + Moment().format('YYYYMMDD');
            Ti.App.Properties.removeProperty("DAYPLAN#" + station);
        });
    });
    return this;
};

$.prototype = {
    _sanitizeHTML : function(foo) {
        var bar = ( typeof foo == 'string')//
        ? foo.replace(/[\s]+<p>[\s]+/gm, '').replace(/[\s]+<\/p>[\s]+/gm, '').replace(/[\n]+/gm, '<br/>⊃ ') : undefined;
        if (bar != undefined) {
            bar = bar.replace('⊃ Moderation', 'Moderation');
            bar = bar.replace('⊃ Von', 'von ');
            bar = bar.replace('⊃ Am Mikrofon', 'am Mikrofon');
        }
        return bar;
    },
    _updateTimestamps : function(stationName) {
        var url = Stations[stationName].dayplan + '?YYYYMMDD=' + Moment().format('YYYYMMDD');
        if (Ti.App.Properties.hasProperty("DAYPLAN#" + stationName)) {
            var items = JSON.parse(Ti.App.Properties.getString("DAYPLAN#" + stationName));
            var length = items.length;
            var ndx = 0;
            for ( i = 0; i < length; i++) {
                var item = items[i];
                if (i == 0) {
                    item.endtime = Moment(items[1].pubDate);
                    item.duration = items[0].endtime.diff(Moment().startOf('day')) / 1000;
                } else if (i != length - 1) {
                    item.endtime = Moment(items[i + 1].pubDate);
                    item.duration = item.endtime.diff(Moment(item.pubDate)) / 1000;
                } else {
                    item.endtime = Moment().startOf('day').add(1, 'day');
                    item.duration = item.endtime.diff(Moment(item.pubDate)) / 1000;
                }
                item.progress = Moment().diff(Moment(item.pubDate)) / item.duration / 1000;
                item.duration_mmss = (item.duration > 3600)//
                ? Moment.unix(item.duration).format('H:mm:ss')//
                : Moment.unix(item.duration).format('m:ss');
                item.description = this._sanitizeHTML(item.description);
                item.isonair = (Moment().isBetween(item.pubDate, item.endtime)) ? true : false;
                item.ispast = (Moment().isBefore(item.endtime)) ? false : true;
                if (!item.endtime.isAfter(Moment()))
                    ndx++;
            }
            return items;
        } else
            return [];
    },
    getCurrentOnAir : function(stationName, onload) {
        var that = this;
        if (stationName != 'drw') {
            this._getRSS(stationName, function() {
                var currentonair = null;
                var items = that._updateTimestamps(stationName);
                items.forEach(function(item) {
                    if (item.isonair == true)
                        currentonair = item;
                });
                onload(currentonair);

            });
            // test if new one (daychange)

        } else {
            const xhr = Ti.Network.createHTTPClient({
                onload: function() {
                    const res= JSON.parse(this.responseData);
                    onload({
                        image : res.playlistItem.cover,
                        title : res.show.title,
                        author : res.presenter.displayname,
                        avatar : res.presenter.avatar
                    });
                }
            });
            xhr.open("GET",Stations[stationName].meta);
            xhr.send();

        }

        onload({
            title : ''
        });

    },
    _getRSS : function(stationName, done) {
        var that = this;
        var KEY = "DAYPLAN#" + stationName;
        if (Ti.App.Properties.hasProperty(KEY)) {
            var items = JSON.parse(Ti.App.Properties.getString(KEY));
            console.log("test of invalide rss format");
            if (!Array.isArray(items) || !items[0].guid || !items[0].guid.text) {
                console.log('Warning: we kill old DAYPLAN');
                Ti.App.Properties.removeProperty(KEY);
                 console.log("test of invalide rss format: was invalide => remove");
                return;
            }
            console.log("test of old data");
            const guid = items[0].guid.text;
           if  (guid.indexOf(Moment().format('YYYY-MM-DD')) <0)  {
                console.log('Warning: we kill old ' + KEY);
                Ti.App.Properties.removeProperty(KEY);
            }
        }
        if (Ti.App.Properties.hasProperty(KEY)) {
            done && done({
                ok : true,
                items : that._updateTimestamps(stationName)
            });
            ;
        }
        if (!Ti.App.Properties.hasProperty(KEY)) {

            var url = Stations[stationName].dayplan + '?YYYYMMDD=' + Moment().format('YYYYMMDD');
            if (Stations[stationName].dayplan) {
                console.log('Info: we must retrieve for dayplan :::::. ' + url);
                var xhr = Ti.Network.createHTTPClient({
                    onload : function() {
                        var channel = new XMLTools(this.responseXML).toObject().channel;
                        if (channel.item && !Array.isArray(channel.item)) {
                            channel.item = [channel.item];
                        }
                        Ti.App.Properties.setString(KEY, JSON.stringify(channel.item));
                        var result = {
                            ok : true,
                            items : that._updateTimestamps(stationName)
                        };
                        // back to caller
                        done && done(result);
                        // persist
                        try {
                            if (that.dayplan && that.dayplan.isIndexOf(url) == -1) {
                                that.dayplan.push({
                                    url : url,
                                    current : null
                                });
                            }
                        } catch(E) {
                        }
                    }
                });
                xhr.open('GET', url);
                xhr.send();
            }
        }
    }, // standard methods for event/observer pattern

    fireEvent : function(_event, _payload) {
        if (this.eventhandlers[_event]) {
            for (var i = 0; i < this.eventhandlers[_event].length; i++) {
                this.eventhandlers[_event][i].call(this, _payload);
            }
        }
    },
    addEventListener : function(_event, _callback) {
        if (!this.eventhandlers[_event])
            this.eventhandlers[_event] = [];
        this.eventhandlers[_event].push(_callback);
    },
    removeEventListener : function(_event, _callback) {
        if (!this.eventhandlers[_event])
            return;
        var newArray = this.eventhandlers[_event].filter(function(element) {
            return element != _callback;
        });
        this.eventhandlers[_event] = newArray;
    }
};

module.exports = $;
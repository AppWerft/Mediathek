const Moment = require('vendor/moment'),
    Model = require('model/stations'),
    FOLDER = 'RadioCache',
    MIN = 100000;

if (Ti.Filesystem.isExternalStoragePresent())
    var DEPOT = Ti.Filesystem.externalStorageDirectory;
else
    var DEPOT = Ti.Filesystem.applicationDataDirectory;
var folder = Ti.Filesystem.getFile(DEPOT, FOLDER);

if (!folder.exists()) {
    folder.createDirectory();
}
const DB = Ti.App.Properties.getString('DATABASE'),
    STATE_NONE = 0,
    STATE_DOWNLOADSTARTED = 1,
    DLM = require('de.appwerft.downloadmanager');

var $ = function() {
    const link = Ti.Database.open(DB);
    link.execute('CREATE TABLE IF NOT EXISTS "recents" ("url" TEXT UNIQUE, "image" TEXT,"station" TEXT, "title" TEXT,"sendung" TEXT, "duration" NUMBER, "progress" NUMBER, "lastaccess" DATETIME,"pubdate" DATETIME, "author" TEXT,"id" NUMBER,"playlist" NUMBER,"status" NUMBER,"reason" NUMBER)');
    link.execute('CREATE INDEX IF NOT EXISTS urlindex ON recents (url)');
    link.close();
    return this;
};

function getLocalFile(station, url) {
    const folder = Ti.Filesystem.getFile(DEPOT, FOLDER, station);
    if (!folder.exists()) {
        folder.createDirectory();
    }
    var parts = url.match(/\/([0-9_a-zA-Z]+\.mp3)$/);
    var filename = parts ? parts[1] : Ti.Utils.md5HexDigest(url);
    return localfile = Ti.Filesystem.getFile(DEPOT, FOLDER, station, filename);
}

function startDownload(options) {
    const request = DLM.createRequest(options.url);
    request//
    .setAllowedNetworkTypes(Ti.Network.NETWORK_WIFI)//
    .setTitle(options.title)//
    .setNotificationVisibility(DLM.VISIBILITY_VISIBLE)//
    .setDescription(options.description)//
    .setDestinationUri(getLocalFile(options.station, options.url));
    return request.enqueue();
}

$.prototype = {
    addItem : function(_args,onstart, onload) {
        var id = -1;
        DLM.onComplete = function(e) {
            console.log('DLM.onComplete');
            const link = Ti.Database.open(DB);
            // copy state from dlm to main db:
            link.execute("UPDATE recents SET status=?, reason=? WHERE id=?", e.status, e.reason, e.id);
            // getting state og current item:
            const curs = link.execute("SELECT * FROM recents WHERE id=?", id);
            var res = null;
            if (curs.isValidRow()) {
                res = {
                    station : res.getFieldByName('station'),
                    id : res.getFieldByName('id'),
                    progress : res.getFieldByName('progress'),
                    image : res.getFieldByName('image'),

                    duration : res.getFieldByName('duration'),
                    /*local uri*/
                    url : getLocalFile(res.getFieldByName('station'), res.getFieldByName('url'))
                };
            }
            curs.close();
            link.close();
            onload && onload(res);
        };
        // start of logic:
        if (_args.url && _args.pubdate) {
            _args.id = startDownload(_args);
            const link = Ti.Database.open(DB);
            // test if item always in DB:
            const cursor = link.execute("SELECT progress,status,id FROM recents WHERE url=?",_args.url);
            if (cursor.isValidRow() && cursor.rowCount>0) {
                _args.id = cursor.getFieldByName('id');
                _args.progress = cursor.getFieldByName('progress');
                cursor.close();
                console.log('always in store, progress=' +_args.progress);
                onstart && onstart(_args);
                onload && onload(_args);
                return; 
            }
            // new item:
            _args.id = startDownload(_args);
            
            link.execute('INSERT OR REPLACE INTO recents VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', //
            _args.url, //
            _args.image, //
            _args.station, //
            _args.subtitle, //
            _args.title, //
            _args.duration, //
            0, //
            Moment().toISOString(), // lastaccess
            Moment(_args.pubdate).toISOString(), // pubdate
            _args.author, //
            _args.id,
            0, 0, 0);
            link.close();
            onstart && onstart(_args);
        }
    },
    /* will called from UI and calls background service */
    setProgress : function(_args) {

        var link = Ti.Database.open(DB);
        link.execute('UPDATE recents SET progress=?,lastaccess=? WHERE url=?', //
        Math.floor(_args.progress / 1000), //
        Moment().toISOString(), //
        _args.url || this.url);
        link.close();
    },
    setComplete : function(_progress) {
        var link = Ti.Database.open(DB);
        //link.execute('UPDATE recents SET progress=duration,lastaccess=? WHERE url =?', Moment().toISOString(), this.url);
        link.close();
    },
    isComplete : function() {
        return true;
    },
    getAllRecents : function() {
        var link = Ti.Database.open(DB);
        var recents = [];
        var res = link.execute('SELECT * FROM recents WHERE progress <= duration ORDER BY DATETIME(lastaccess) DESC');
        while (res.isValidRow()) {
            var station = res.getFieldByName('station');
            recents.push({
                url : res.getFieldByName('url'),
                image : '/images/' + station + '.png',
                station : station,
                title : res.getFieldByName('sendung'),
                subtitle : res.getFieldByName('title'),
                duration : res.getFieldByName('duration'),
                progress : res.getFieldByName('progress') / res.getFieldByName('duration'),
                lastaccess : res.getFieldByName('lastaccess'),
                pubdate : res.getFieldByName('pubdate'),
                author : res.getFieldByName('author'),
                color : (station ) ? Model[station].color : 'gray'
            });
            res.next();
        }

        res.close();
        link.close();
        return recents;
    },
    getProgress : function(_url) {
        var link = Ti.Database.open(DB);

        var res = link.execute('SELECT progress FROM recents  WHERE url=?', this.url || _url);
        var progress = 0;
        if (res.isValidRow()) {
            progress = res.getFieldByName('progress');
            res.close();
        }
        link.close();
        return progress;
    },
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

exports.create = function(args) {
    return new $(args);
};

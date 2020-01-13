const Moment = require('vendor/moment'),
    Settings = require("controls/settings");
Model = require('model/stations'),
FFmpeg = require("ti.ffmpeg"),
FFmpegLoader = require("controls/ffmpeg.loader"),
FOLDER = 'RadioCache',
FORCED = false;
BUFFER_TIME = 2000;
//5 sec.

var start = new Date().getTime();

function LOG(foo) {
    console.log((new Date().getTime()) - start);
    start = new Date().getTime();
    console.log(foo);
}

var DEPOT;
if (Settings.get("SD")) {
    if (Ti.Filesystem.isExternalStoragePresent())
        DEPOT = Ti.Filesystem.externalStorageDirectory;
    else
        DEPOT = Ti.Filesystem.applicationDataDirectory;
} else
    DEPOT = Ti.Filesystem.applicationCacheDirectory;

var folder = Ti.Filesystem.getFile(DEPOT, FOLDER);

if (!folder.exists()) {
    folder.createDirectory();
}
const DB = Ti.App.Properties.getString('DATABASE'),
    STATE_NONE = 0,
    STATE_DOWNLOADSTARTED = 1,
    DLM = require('de.appwerft.downloadmanager');
const link = Ti.Database.open(DB);
link.execute('CREATE TABLE IF NOT EXISTS "recents" ("url" TEXT UNIQUE, "filename" TEXT, "image" TEXT,"station" TEXT, "title" TEXT,"sendung" TEXT, "duration" INTEGER, "progress" INTEGER, "lastaccess" TEXT,"pubdate" TEXT, "author" TEXT,"id" INTEGER,"playlist" INTEGER,"status" INTEGER,"reason" INTEGER,"deliveryMode" TEXT)');
link.execute('CREATE INDEX IF NOT EXISTS urlindex ON recents (url)');
link.close();

function getStatusMsg(s) {
    var statusmsg = "unknown";
    switch (s) {
    case 0:
        statusmsg = 'init';
        break;
    case DLM.STATUS_FAILED:
        statusmsg = 'failed';
        break;
    case DLM.STATUS_PAUSED:
        statusmsg = 'paused';
        break;
    case DLM.STATUS_PENDING:
        statusmsg = 'pending';
        break;
    case DLM.STATUS_RUNNING:
        statusmsg = 'running';
        break;
    case DLM.STATUS_SUCCESSFUL:
        statusmsg = 'successful';
        break;
    }
    return statusmsg;
}

function getLocalFile(station, url) {
    LOG(station + '  ' + url);
    const folder = Ti.Filesystem.getFile(DEPOT, FOLDER, station);
    if (!folder.exists()) {
        folder.createDirectory();
    }
    var localfile = null;
    //https://dradiohls-vh.akamaihd.net/i/2020/01/03/eine_musik_worueber_die_welt_erstaunen_soll_von_der_drk_20200103_2230_e87b80e8.mp4/master.m3u8
    const regex = {
        mp3 : /\/([0-9_a-zA-Z]+)\.mp3$/,
        mp4 : /\/([0-9_a-zA-Z]+)\.mp4\/master\.m3u8$/
    };

    Object.keys(regex).forEach(codec => {
        const m = url.match(regex[codec]);
        if (m) {
            localfile = Ti.Filesystem.getFile(DEPOT, FOLDER, station, m[1] + '.' + "mp3");
        }
    });

    if (!localfile)
        localfile = Ti.Filesystem.getFile(DEPOT, FOLDER, station, Ti.Utils.md5HexDigest(url) + '.mp3');
    LOG(localfile.nativePath);
    return localfile;
}

/*                       */
/* CONSTRUCTOR */
const $ = function(station, url) {
    this.eventhandlers = [];
    this.status = {
        downloadprogress : 0,
        complete : false,
        started : false
    };
    this.start = (new Date()).getTime();

    this.url = url;
    this.station = station;
    this.readytoplay = false;

    this.localfile = getLocalFile(station, url);
    return this;
};

$.prototype = {
    getState : function() {
        return {
            size : this.localfile.size,
            file : this.localfile
        };
    },
    isCached : function() {
        var cached = false;
        const link = Ti.Database.open(DB);
        // test if item always in DB:
        const cursor = link.execute("SELECT status FROM recents WHERE url=?", this.url);
        if (cursor.isValidRow() && cursor.rowCount > 0) {
            cached = cursor.getFieldByName('status') == 8 ? true : false;
            cursor.close();
        }
        link.close();
        return cached;
    },
    loadFile : function(props) {
        const that = this;
        LOG('loadFile');
        LOG(props);
        this.status.duration = props.duration;
        // start of logic:
        LOG("////////////////START DOWNLAD\\\\\\\\\\\\\\\\\\");

        const link = Ti.Database.open(DB);
        const cursor = link.execute("SELECT * FROM recents WHERE url=?", this.url);
        if (!FORCED && this.localfile.exists() && !!cursor && cursor.isValidRow() && cursor.rowCount > 0) {//allways in DB
            const status = cursor.getFieldByName("status");
            const res = {
                progress : cursor.getFieldByName("progress"),
                deliveryMode : cursor.getFieldByName("deliveryMode"),
                status : status,
                file : this.localfile
            };
            LOG("file already local");
            this.fireEvent('ACTION_READYTOPLAY', res);
            this.fireEvent("ACTION_READYTOSEEK", {});
        } else {// new, must added:
            const onHLSProgress =  p => {
                this.status.downloadprogress = p.time;
                if (this.status.started)
                    return;
                if (this.status.downloadprogress > BUFFER_TIME) {// 1 sec bonus time
                    this.fireEvent("ACTION_READYTOPLAY", this.getState());
                    this.status.started = true;
                    LOG("ACTION_READYTOPLAY in `onHLSProgress` fired");
                }
            }
            LOG("START HLS DOWNLOADING");
            this.fireEvent("ACTION_BUFFERINGSTARTED", {});
            const startHLSFn = () => {
                /*Ti.UI.createNotification({
                    message : "Architektur:\n"+FFmpeg.getABI(),
                    duration : 500
                }).show();
                */
                const client = FFmpeg.createHLSClient();
                // during download this will called every second:
                client.setInput(this.url).setAudiocodec(FFmpeg.CODEC_MP3).setFile(this.localfile).setOverwrite(true);
                client.addEventListener("onProgress", onHLSProgress);
                client.execute();
                client.onFinish = p => {
                    const link = Ti.Database.open(DB);
                    client.removeEventListener("onProgress", onHLSProgress);
                    if (!this.status.started)
                        this.fireEvent("ACTION_READYTOPLAY", this.getState());
                    this.status.started = true;
                    link && link.execute("UPDATE recents SET status=? WHERE url=?", 8, this.url);
                    link && link.close();
                    this.fireEvent("ACTION_READYTOSEEK", {});
                }
            }
            if (FFmpegLoader.isLoaded()) {
                console.log("FFmpeg direct loaded, can start");
                startHLSFn();
            } else {
                Ti.UI.createNotification({
                    duration : 1000,
                    message : "Streamingkonverter wird installiert."
                }).show();
                FFmpegLoader.load({
                    onload : startHLSFn
                });
            }

            // global in this method for dlm callback
            link.execute('INSERT OR REPLACE INTO recents VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', //
            this.url, //
            this.localfilename, props.image, //
            props.station, //
            props.subtitle, //
            props.title, //
            props.duration, //
            0, //
            Moment().toISOString(), // lastaccess
            Moment(props.pubdate).toISOString(), // pubdate
            props.author, //
            0, 0, 0, 0, props.deliveryMode);
            link.close();
            LOG("new Dataset added");
        }
    },
    /* will called from UI and calls background service */
    setProgress : function(progress) {
        var link = Ti.Database.open(DB);
        link.execute('UPDATE recents SET progress=?,lastaccess=? WHERE url=?', progress, Moment().toISOString(), this.url);
        link.close();
    },
    getProgress : function() {
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
    setComplete : function(_progress) {
        var link = Ti.Database.open(DB);
        link.execute('UPDATE recents SET progress=0,lastaccess=? WHERE url =?', Moment().toISOString(), this.url);
        if (Settings.get("REMOVEAFTERDOWNLOAD")) {
            link.execute('UPDATE recents SET status=0 WHERE url =?', this.url);
            this.localfile.deleteFile();
        }
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

exports.createFileCache = function(station, url) {
    return new $(station, url);
};

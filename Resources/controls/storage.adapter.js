const Moment = require('vendor/moment'),
    Model = require('model/stations'),
    FFmpeg = require("ti.ffmpeg"),
    FOLDER = 'RadioCache',
    TICK = 20,
    MIN_BUFFER_SIZE = 3000; // in kB
// 1MB = 1 min

var start = new Date().getTime();

function LOG(foo) {
    console.log((new Date().getTime()) - start);
    start = new Date().getTime();
    console.log(foo);
}

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
    const regex = [/\/([0-9_a-zA-Z]+)\.mp3$/, /\/([0-9_a-zA-Z]+)\.mp4\/master\.m3u8$/];

    regex.forEach(r => {
        const m = url.match(r);
        if (m) {
            localfile = Ti.Filesystem.getFile(DEPOT, FOLDER, station, m[1] + '.mp3');
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
    this.start = (new Date()).getTime();
    this.id = -1;
    this.url = url;
    this.station = station;
    this.readytoplay = false;

    /*FFmpeg.loadBinary();
     FFmpeg.createHLSClient({
     url : this.url,
     audiocodec : FFmpeg.CODEC_MP3,
     file : this.localfile,

     onload : function(opts) {
     console.log(opts);
     },
     onerror : function(opts) {
     console.log(opts);
     },
     onprogress : function(opts) {
     console.log(opts);
     }
     });*/
    this.localfile = getLocalFile(station, url);
    this.onCron = () => {
        if (this.id > -1) {
            const res = this.getState();

            if (!this.readytoplay && (res.status == DLM.STATUS_RUNNING || res.status == DLM.STATUS_SUCCESSFUL) && (res['size_downloaded'] > 1000*MIN_BUFFER_SIZE)) {// 36 sec buffer
                res.progress = this.getProgress();
                LOG("<<<<< PROGRESS = " + res.progress + '   ' + this.url);
                this.fireEvent("ACTION_READYTOPLAY", res);
                this.readytoplay = true;
            }
            if (res.status == DLM.STATUS_SUCCESSFUL) {
                clearInterval(this.cron);
                LOG("<<<<< PROGRESS = " + res.progress + '   ' + this.url);
                this.fireEvent("ACTION_READYTOSEEK", {});
            }
        }
        // console.log(res.status + '  ' + res.progress);
    }
    return this;
};

$.prototype = {
    getState : function() {
       
        var res = this.id>-1 ? DLM.getDownloadById(this.id):{};
        res.size = this.localfile.size;
        res.file = this.localfile;
        return res;
    },
    isCached : function() {
        var cached = false;
        const link = Ti.Database.open(DB);
        // test if item always in DB:
        const cursor = link.execute("SELECT status FROM recents WHERE url=?", this.url);
        if (cursor.isValidRow() && cursor.rowCount > 0) {
            cached = cursor.getFieldByName('status') == DLM.STATUS_SUCCESSFUL ? true : false;
            cursor.close();
        }
        link.close();
        return cached;
    },
    loadFile : function(props) {
       
        var id = -1;
        const localfile = this.localfile;
        const that = this;
        LOG('loadFile');
        LOG(props);
        // placeholder for new id
        DLM.onComplete = function(e) {
            clearInterval(that.cron);
            LOG("cron stopped");
            const link = Ti.Database.open(DB);
            link.execute("UPDATE recents SET status=?, reason=? WHERE id=?", e.status, e.reason, e.id);
            link.close();
            return;
        };
        // start of logic:
        LOG("////////////////START DOWNLAD\\\\\\\\\\\\\\\\\\");
        
        const link = Ti.Database.open(DB);
        const cursor = link.execute("SELECT * FROM recents WHERE url=?", this.url);
        if (false && this.localfile.exists() && !!cursor && cursor.isValidRow() && cursor.rowCount > 0) {//allways in DB
            this.id = cursor.getFieldByName("id");
            const status = cursor.getFieldByName("status");
            const res = {
                id : cursor.getFieldByName("id"),
                progress : cursor.getFieldByName("progress"),
                deliveryMode : cursor.getFieldByName("deliveryMode"),
                status : status,
                file : this.localfile
            };
            LOG("file already local");
            LOG("<<<<< PROGRESS = " + res.progress + '   ' + this.url);
            this.fireEvent('ACTION_READYTOPLAY', res);
            this.fireEvent("ACTION_READYTOSEEK", {});
        } else {// new, must added:
            this.fireEvent("ACTION_BUFFERINGSTARTED",{});
            LOG("need new id from downloadmanager !!");
            // new item:
            switch (props.deliveryMode) {
            case "download":
                this.id = DLM.createRequest(this.url).setAllowedNetworkTypes(Ti.Network.NETWORK_MOBILE | Ti.Network.NETWORK_WIFI).setTitle(props.title + '::' + props.subtitle).setNotificationVisibility(DLM.VISIBILITY_VISIBLE).setDestinationUri(this.localfile).enqueue();
                this.cron = setInterval(this.onCron, TICK);
                this.onCron();
                break;
            case "stream":
                const client = FFmpeg.createHLSClient();
                const onHLSProgress =  p => {
                    if (parseInt(p.size) > MIN_BUFFER_SIZE) {
                         client.removeEventListener("onProgress", onHLSProgress);
                         this.fireEvent("ACTION_READYTOPLAY", this.getState());
                         LOG("ACTION_READYTOPLAY in `onHLSProgress` fired");
                    }
                }
                client.setInput(this.url).setFile(this.localfile).setOverwrite(true).setAudiocodec(FFmpeg.CODEC_MP3);
                client.addEventListener("onProgress", onHLSProgress);
                
                client.onFinish = p => {
                    LOG("onFinish::")
                    client.removeEventListener("onProgress", onHLSProgress);
                    LOG(p);
                    this.fireEvent("ACTION_READYTOPLAY", this.getState());
                    this.fireEvent("ACTION_READYTOSEEK", {});
                    LOG("ACTION_READYTOSEEK fired");
                }
                client.execute();

                break;
            }
            id = this.id;

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
            this.id, 0, 0, 0, props.deliveryMode);
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

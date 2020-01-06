/* Init */
/*https://github.com/vbartacek/aacdecoder-android/blob/master/decoder/src/com/spoledge/aacdecoder/IcyInputStream.java#L98-L112
 */
const StreamingPlayer = require("com.woohoo.androidaudiostreamer"),
    AudioNotification = require("de.appwerft.audionotification"),
    Dayplan = new (require('controls/dayplan.adapter'))();
var Notification;

const TICK = 3000;
var logo;

var currentStatus = 0;
var wasLastPingSuccessful = false;
var audioSessionId;

function LOG() {
    console.log('🛠AAS:');
    console.log(arguments[0]);
}

var shouldPlay = null;
// null or URL (string)
var shouldStopp = false;
// true or false

const STOPPED = 0,
    BUFFERING = 1,
    PLAYING = 2,
    STREAMERROR = 3,
    TIMEOUT = 4,
    OFFLINE = 5,
    STATUS = ['STOPPED', 'BUFFERING', 'PLAYING', 'STREAMERROR', 'TIMEOUT', 'OFFLINE'];

/*
 * is callback function with payload: String message Integer status ['STOPPED',
 * 'BUFFERING', 'PLAYING', 'STREAMERROR']
 */
var callbackFn;

function onPlayerChange(_e) {

    var status = _e.status;
    //    if (status == PLAYING)
    //       Favs.increment(currentStation.station);
    if (!Ti.Network.online) {
        // status = STATUS[OFFLINE];
        Ti.UI.createNotification({
            message : "Probleme mit der Internetverbindung",
            duration : 200
        }).show();
    }
    if (status == currentStatus)
        return;
    currentStatus = status;
    LOG("Status –––>" + STATUS[status]);
    switch (status) {
    case BUFFERING:
        if (callbackFn && typeof callbackFn == 'function')
            callbackFn({
                status : 'BUFFERING'
            });

        break;
    case PLAYING:
        if (callbackFn && typeof callbackFn == 'function')
            callbackFn({
                status : 'PLAYING'
            });

        break;
    case STOPPED:
        /*
         * if (!shouldStopp) { StreamingPlayer.stop(); Notification.stop(); }
         * shouldStopp = false; if (callbackFn && typeof callbackFn ==
         * 'function') callbackFn({ status : 'STOPPED', });
         */
        break;
    case STREAMERROR:
        if (callbackFn && typeof callbackFn == 'function') {
            callbackFn({
                status : 'STREAMERROR'
            });
            Ti.UI.createNotification({
                message : "Streamingproblem"
            }).show();
        }
        break;
    }
}

function onMetaData(_event) {
    var message = _event.title;
    if (currentStation.station != 'drw') {
        Dayplan.getCurrentOnAir(currentStation.station,item => {
            if (item.progress != undefined) {
                Notification.setProgress(item.progress.replace('%', '') / 100);
            }
        });
    }
    Notification.setSubtitle(message);
    Notification.setTitle(currentStation.title);
    if (callbackFn && typeof callbackFn == 'function')
        callbackFn({
            message : message,
            status : 'PLAYING'
        });
    else
        console.log('wrong callback var type ' + typeof callbackFn);
}

StreamingPlayer.addEventListener('ready', function(_e) {
    if (callbackFn && typeof callbackFn == 'function')
        callbackFn({
            audioSessionId : _e.audioSessionId
        });
});
StreamingPlayer.addEventListener('metadata', onMetaData);
StreamingPlayer.addEventListener('change', onPlayerChange);

var currentStation = {};

exports.init = function(lifecycleContainer, icon) {
    LOG("///////////////// INIT ///////////////");
    LOG(currentStation);
    Notification = AudioNotification.createNotification({
        lifecycleContainer : lifecycleContainer,
        icon : 'smallicon',
        progress : 0.0,
        title : currentStation.title,
        image : currentStation.largeIcon
    });
    LOG("notification initialized");
};

exports.play = function(station, _callbackFn) {
    LOG("/////////////// PLAY //////////////");
    // LOG(station);
    currentStation.title = station.title;
    currentStation.subtitle = station.subtitle;
    currentStation.station = station.station;
    currentStation.url = station.url;
    currentStation.senderlogo = '/images/' + station.station + '.png';
    callbackFn = _callbackFn;

    if (currentStation.url != undefined && typeof currentStation.url == 'string') {
        if (Notification) {
            LOG('STATIONTITLE:' + currentStation.title);
            LOG(currentStation);
            Notification.setTitle(currentStation.title);
            Notification.setSubtitle(currentStation.subtitle);
            Notification.setLargeIcon(currentStation.senderlogo);
            // Notification.setLargeImage('/images/' + currentStation.station + 'large.png');
            Notification.update();
            LOG('Notification triggered by JS');
        } else
            console.log('!! no Notification');

        shouldPlay = currentStation.url;
        // StreamingPlayer.stop();
        LOG('status after start method = ' + STATUS[StreamingPlayer.getStatus()]);
        if (StreamingPlayer.getStatus() == PLAYING) {
            LOG('was playing => forced stopp');
            shouldStop = true;
            StreamingPlayer.stop();
        } else {
            StreamingPlayer.play(currentStation.url);
        }
    } else
        LOG("issue with url !!!!");
};

function stopStream() {
    if (Notification)
        Notification.stop();
    LOG('≠≠≠≠≠≠≠ STOP method');
    shouldPlay = null;
    setTimeout(function() {
        if (callbackFn && typeof callbackFn == 'function')
            callbackFn({
                status : 'STOPPED',
            });

        shouldStopp = false;
    }, 100);
    shouldStopp = true;
    StreamingPlayer.stop();
}

exports.stop = stopStream;

Ti.App.addEventListener('stopRadio', stopStream);

exports.isPlaying = function() {
    return StreamingPlayer.getStatus() == PLAYING ? true : false;
};
exports.isStopped = function() {
    return StreamingPlayer.getStatus() == STOPPED ? true : false;
};
exports.isOnline = function() {
    return wasLastPingSuccessful;
};

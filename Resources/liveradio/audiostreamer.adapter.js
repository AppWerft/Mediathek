/* Init */
/*https://github.com/vbartacek/aacdecoder-android/blob/master/decoder/src/com/spoledge/aacdecoder/IcyInputStream.java#L98-L112
 */
const StreamingPlayer = require("com.woohoo.androidaudiostreamer"),
    AudioNotification = require("de.appwerft.audionotification");
  
var Notification;

const TICK = 3000;
var logo;

var currentStatus = 0;
var wasLastPingSuccessful = false;
var audioSessionId;

function LOG() {
     console.log('🛠AAS: ' + arguments[0]);
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
    ;
}

function onMetaData(_event) {
    var message = _event.title;
    Notification.setSubtitle(message);
    Notification.setTitle(currentStation.title);
    LOG(_event);
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
    Notification = AudioNotification.createNotification({
        lifecycleContainer : lifecycleContainer,
        icon : icon
    });
    LOG("notification initialized");
};

exports.play = function(station, _callbackFn) {
    LOG("//////////////////////////////////");
    LOG(station);
    currentStation.title = station.title;
    currentStation.station = station.station;
    currentStation.url = station.url;
    currentStation.largeIcon = station.logo;
    callbackFn = _callbackFn;
    LOG(currentStation);
    if (currentStation.url != undefined && typeof currentStation.url == 'string') {
        if (Notification) {
            LOG('STATIONTITLE:' + currentStation.title);
            LOG(currentStation);
            Notification.setTitle(currentStation.title);
            Notification.setSubtitle("");
            Notification.setLargeIcon(currentStation.largeIcon);
            Notification.start();
            LOG('Notification triggered by JS');
        } else console.log('!! no Notification');
        
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
    } else LOG("issue with url !!!!");
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

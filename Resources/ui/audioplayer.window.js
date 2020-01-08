'use strict';

const StorageAdapter = require('controls/storage.adapter'),
    Moment = require('vendor/moment'),
    Stations = require('model/stations'),
    playerViewModule = require('ui/audioplayer.widget'),
    Permissions = require('vendor/permissions'),
    AudioVisualizer = require('ti.audiovisualizerview'),
    TelephonyManager = require('com.goyya.telephonymanager'),
    timeout = null,
    TIMEOUT = 30000;

TelephonyManager.addEventListener('callState', function(_e) {
    if (TelephonyManager.CALL_STATE_RINGING == _e.state && AudioPlayer.playing == true)
        AudioPlayer.pause();
});

var AudioPlayer = Ti.Media.createAudioPlayer({
    allowBackground : true,
    volume : 1.0,
    seeked : false,
    audioFocus : true
});
AudioPlayer.release();

console.log("📻AudioPlayer created");

if (AudioPlayer.seek === undefined)
    AudioPlayer.seek = AudioPlayer.setTime;

var alertactive = false;

/* ********************************************************* */
var $ = function(options) {
    const that = this;
    that.Gears = require('ui/gears.widget')(options.station);
    that.Gears.animate({
        bottom : 0
    });
    that.onBufferingStartedFn = function(res) {
        that._window.add(that.Gears);
        console.log("=======> onReadyToPlayFn");

    };
    that.onReadyToPlayFn = function(res) {
        console.log("=======> onReadyToPlayFn");
        console.log(AudioPlayer.duration);
        that.Gears && that._window.remove(that.Gears);
        that.onBufferingStartedFn && that.Storage.removeEventListener("ACTION_BUFFERINGSTARTED", that.onBufferingStartedFn);
        that.startPlayer(res.file, res.progress);
    };
    that.onReadyToSeek = function() {
        that._view.control.show();
    };
    options.color = options.station && Stations[options.station] ? Stations[options.station].color : "#555";
    that.options = options;
    that.Storage = StorageAdapter.createFileCache(that.options.station, that.options.url);
    that.Storage.addEventListener("ACTION_READYTOPLAY", that.onReadyToPlayFn);
    that.Storage.addEventListener("ACTION_READYTOSEEK", that.onReadyToSeek);
    that.Storage.addEventListener("ACTION_BUFFERINGSTARTED", that.onBufferingStartedFn);

    if (AudioPlayer && AudioPlayer.playing)
        AudioPlayer.release();

    that.onSliderChangeFn = function(_e) {
        const FORMAT = (that.options.duration < 60 * 60 * 1000) ? "m:ss" : "H:mm:ss";
        that._view.progress.value = _e.value;
        that._view.duration.text = Moment(_e.value).utc().format(FORMAT) + ' / ' + Moment(that.options.duration).utc().format(FORMAT);
    };
    that.onProgressFn = function(_e) {
        that.progress = _e.progress;
        const FORMAT = (that.options.duration < 60 * 60 * 1000) ? "m:ss" : "H:mm:ss";
        that._view.progress.value = _e.progress;
        that._view.slider.value = _e.progress;
        that._view.duration.text = Moment(_e.progress).utc().format(FORMAT) + ' / ' + Moment(that.options.duration).utc().format(FORMAT);
        /* saving to model */
        that.Storage.setProgress(_e.progress);
        // updating ControlView

    };
    that.onCompleteFn = _e => {
        console.log("📻onCompleteFn success=" + _e.success);
        console.log("📻onCompleteFn error=" + _e.error);
        console.log("📻onCompleteFn code=" + _e.code);
        if (_e.error)
            Ti.UI.createNotication({
                message : _e.error,
                duration : 3000
            }).show();
        console.log("Progress: " + that.progress / 1000);
        console.log("Duration: " + AudioPlayer.duration / 1000);
        console.log("DL-Progress: " + that.Storage.status.downloadprogress / 1000);

        if (that.Storage.status.downloadprogress > AudioPlayer.duration / 1000 + 1) {
            console.log("false complete => restart with new duration");
            AudioPlayer && AudioPlayer.release();
            AudioPlayer.seek(that.progress + 500);
            AudioPlayer.url = that.nativePath;
            AudioPlayer.start();
            Ti.UI.createNotification({
                message : "Internet-Schluckauf"
            }).show();
            return;
        }

        if (that._view)
            that._view.setVisible(false);
        that.Storage.setComplete();
        that.Storage.setProgress(0);
        if (that.onProgressFn)
            AudioPlayer.removeEventListener('progress', this.onProgressFn);
        if (that.onCompleteFn)
            AudioPlayer.removeEventListener('complete', this.onCompleteFn);
        if (that.onStatusChangeFn)
            AudioPlayer.removeEventListener('change', this.onStatusChangeFn);
        that.Storage.removeEventListener("ACTION_READYTOPLAY", that.onReadyToPlayFn);
        that.Storage.removeEventListener("ACTION_READYTOSEEK", that.onReadyToSeekFn);
        that.Storage.removeEventListener("ACTION_BUFFERINGSTARTED", that.onBufferingStartedFn);

        that.Storage = null;
        that._view.mVisualizerView = null;
        AudioPlayer && AudioPlayer.release();
        console.log("Player released");
        setTimeout(function() {
            if (that._window) {
                that._window.removeEventListener('close', that.stopPlayer);
                that._window.removeAllChildren();
                console.log("Window is empty, try to close");
                that.Storage = null;
                that._window.close({
                    activityEnterAnimation : Ti.Android.R.anim.fade_in,
                    activityExitAnimation : Ti.Android.R.anim.fade_out
                });
            }
        }, 500);
    };
    that.onStatusChangeFn = _e => {
        console.log("📻onStatusChangeFn Info: AudioPlayer sends >>>>>>" + _e.description);
        switch (_e.description) {
        case 'stopped':
            break;
        case 'stopping':
            break;
        case 'paused':
            that._view.sendung.ellipsize = false;
            that._view.control.setImage('/images/play.png');
            that._view.slider.show();
            that._view.progress.hide();
            //  that._view.visualizerContainer.hide();
            that._view.slider.addEventListener('change', that.onSliderChangeFn);
            break;
        case 'playing':
            that._view.slider.removeEventListener('change', that.onSliderChangeFn);
            that._view.progress.show();
            that._view.slider.hide();
            //that._view.subtitle.ellipsize = Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE;
            //  that._view.sendung.ellipsize = Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE;
            //  that._view.visualizerContainer.show();
            break;
        }
    };
    that.stopPlayer = function() {
        console.log("📻 stoppingPlayer");
        if (that._view.mVisualizerView) {
            that._view.mVisualizerView = null;
        }
        if (that._view) {
            that._view.removeAllChildren();
            that._view == null;
        }
        AudioPlayer.seek(0);
        AudioPlayer.stop();
        AudioPlayer.release();
        //  if (!AudioPlayer.playing)  {
        that._window.close();
        //  }
        AudioPlayer.removeEventListener('progress', that.onProgressFn);
        AudioPlayer.removeEventListener('complete', that.onCompleteFn);
        AudioPlayer.removeEventListener('change', that.onStatusChangeFn);
    };
    that.startPlayer = (audioFile, time) => {
        if (!audioFile) {
            console.log('no file in startPlayer');
            return;
        }
        console.log("📻 START PLAYER");
        if (!time)
            time = 0;

        
         var maxRange = that.options.duration ;
         that._view.progress.setMax(maxRange);
         that._view.slider.setMax(maxRange);
         that._view.progress.value = 0;
         that._view.slider.value = 0;
         /*
         that._view.sendung.text = this.options.title;
         //    this._view.title.setColor(this.options.color);
         that._view.title.text = this.options.subtitle;
         that._view.description.text=this.options.description ? this.options.description : "";
         that._view.duration.text = Moment.unix(this.options.duration).utc().format('HH:mm:ss');
         */
        AudioPlayer.release();
        //

        AudioPlayer.seek(time);
        //AudioPlayer.time = time;
        that.nativePath = audioFile.nativePath;
        console.log(audioFile.nativePath + ' exists=' + audioFile.exists());
        AudioPlayer.url = audioFile.nativePath;
        AudioPlayer.start();
        //         timeout = setTimeout(that.stopPlayer, TIMEOUT);
        return;
        //this.stopPlayer();
    };
    that.createWindow = function() {
        that._window = Ti.UI.createWindow({
            backgroundColor : 'transparent',
            theme : 'Theme.AppCompat.Translucent.NoTitleBar.Fullscreen',
            modal : true
        });

        AudioPlayer.addEventListener('progress', this.onProgressFn);
        AudioPlayer.addEventListener('complete', this.onCompleteFn);
        AudioPlayer.addEventListener('change', this.onStatusChangeFn);
        that._window.addEventListener("android:back", () => {
            console.log("android-back");
            that._view.control.fireEvent('longpress', {});
            return false;
        });
        /* here begins the real code */

        that._view = playerViewModule.getView(that.options);
        that._window.add(that._view);
        console.log("Overlay added");

        that._view.control.addEventListener('longpress', function() {
            console.log("longpress");
            that.stopPlayer();
        });
        that._view.control.addEventListener('singletap', function() {
            /*
             if (CacheAdapter.isCached(that.options)) {
             if (AudioPlayer.playing)
             AudioPlayer.pause();
             else {
             that.progress = that._view.slider.getValue();
             AudioPlayer.seek(that.progress);
             AudioPlayer.play();
             }
             }*/
        });

        this._window.addEventListener('open', function() {
            console.log("window is open");
            function onLoad(props) {
                console.log(props.progress + '    ' + props.uri);
                that.startPlayer(props.uri, props.progress);
                clearInterval(that.cron);
            }

            Permissions.requestPermissions(['WRITE_EXTERNAL_STORAGE'], _success => {
                if (_success) {
                    that.Storage.loadFile(that.options, onLoad);
                    Permissions.requestPermissions(['RECORD_AUDIO'], _success => {
                        if (_success) {
                            const visualizerView = AudioVisualizer.createView({
                                audioSessionId : 0,
                                linegraphRenderer : {
                                    strokeWidth : 0.7 * Ti.Platform.displayCaps.logicalDensityFactor
                                },
                                bargraphRenderer : {
                                    barWidth : Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor / 7 * Ti.Platform.displayCaps.logicalDensityFactor,
                                    color : that.options.color,
                                    divisions : 9
                                },
                                touchEnabled : false,
                                lifecycleContainer : that._window,
                            });
                            that._view.add(visualizerView);
                            console.log("that._view.visualizerView created");
                        }
                    });
                }
            });
        });
        this._window.open();
        console.log("📻 window opened");
    };
    this.createWindow();
};

exports.createAndStartPlayer = function(options) {
    return new $(options);
};

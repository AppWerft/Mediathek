'use strict';

var StorageAdapter = require('controls/storage.adapter'),

    Moment = require('vendor/moment'),
    Stations = require('model/stations'),
    playerViewModule = require('ui/audioplayer.widget'),
    Permissions = require('vendor/permissions'),
    AudioVisualizer = require('ti.audiovisualizerview'),
    TelephonyManager = require('com.goyya.telephonymanager'),
    timeout = null,
    TIMEOUT = 30000;

TelephonyManager.addEventListener('callState', function(_e) {
    if (TelephonyManager.CALL_STATE_RINGING == _e.state && singletonPlayer.playing == true)
        singletonPlayer.pause();
});

var singletonPlayer = Ti.Media.createAudioPlayer({
    allowBackground : true,
    volume : 1.0
});
console.log("📻singletonPlayer created");

if (singletonPlayer.seek === undefined)
    singletonPlayer.seek = singletonPlayer.setTime;

var alertactive = false;

/* ********************************************************* */
var $ = function(options) {
    options.color = options.station && Stations[options.station] ? Stations[options.station].color : "#555";
    this.options = options;
    if (singletonPlayer && singletonPlayer.playing)
        singletonPlayer.release();

    this.setControlView = function() {
        /*if (CacheAdapter.isCached(this.options)) {
            that._view.control.setImage('/images/pause.png');
        } else {
            var sec = Math.round((new Date().getTime() / 1000));
            that._view.control.setImage(sec % 2 ? '/images/cache.png' : '/images/cache_.png');
        }*/
    };
    this.onSliderChangeFn = function(_e) {
        that._view.progress.value = _e.value;
        that._view.duration.text = Moment(_e.value).utc().format('HH:mm:ss') + ' / ' + Moment.unix(that.options.duration).utc().format('HH:mm:ss');
    };
    this.onProgressFn = function(_e) {
        const FORMAT = (that.options.duration < 60 * 60) ? "mm:ss" : "HH:mm:ss";
        that._view.progress.value = _e.progress;
        that._view.slider.value = _e.progress;
        that._view.duration.text = Moment(_e.progress).utc().format(FORMAT) + ' / ' + Moment.unix(that.options.duration).utc().format(FORMAT);
        /* saving to model */
        that._Recents.setProgress({
            progress : _e.progress / 1000,
            url : that.options.url
        });
        // updating ControlView
        that.setControlView();
    };
    this.onCompleteFn = function(_e) {
        if (_e.error)
            Ti.UI.createNotication({
                message : _e.error,
                duration : 3000
            }).show();
        console.log("📻onCompleteFn success=" + _e.success);
        console.log("📻onCompleteFn error=" + _e.error);
        console.log("📻onCompleteFn code=" + _e.code);
        var diff = Math.abs(_e.source.getDuration() - _e.source.getTime());
        if (diff < 10 * 1000) {
            console.log("📻onCompleteFn diff=" + diff);
            if (that._view)
                that._view.setVisible(false);
            that._Recents.setComplete();
            that.onStatusChangeFn({
                description : 'stopped'
            });
        } else {
            that.startPlayer(_e.source.getTime());
        }

    };
    this.onStatusChangeFn = function(_e) {
        console.log("📻onStatusChangeFn Info: AudioPlayer sends >>>>>>" + _e.description);
        switch (_e.description) {
        case 'stopped':
        case "stopping":
            if (this.onProgressFn && typeof this.onProgressFn == 'function')
                singletonPlayer.removeEventListener('progress', this.onProgressFn);
            if (this.onCompleteFn && typeof this.onCompleteFn == 'function')
                singletonPlayer.removeEventListener('complete', this.onCompleteFn);
            if (this.onStatusChangeFn && typeof this.onStatusChangeFn == 'function')
                singletonPlayer.removeEventListener('change', this.onStatusChangeFn);
            that._view.mVisualizerView = null;
            singletonPlayer && singletonPlayer.release();
            setTimeout(function() {
                that._view.control.image = '/images/play.png';
                if (that._window) {
                    that._window.removeEventListener('close', that.stopPlayer);
                    that._window.removeAllChildren();
                    that._window.close({
                        activityEnterAnimation : Ti.Android.R.anim.fade_in,
                        activityExitAnimation : Ti.Android.R.anim.fade_out
                    });
                }
            }, 1500);

            break;
        case 'stopping':
            break;
        case 'starting':
            console.log('📻Player starting');
            if (that._view.visualizerView) {
                that._view.visualizerContainer.show();
                that._view.visualizerContainer.add(that._view.visualizerView);
                console.log('📻 Visu added');
            } else
                console.log("📻 NO Visu added");

            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            setTimeout(function() {
                CacheAdapter.cacheURL(options);
            }, 3000);
            //that._view.control.image = '/images/leer.png';
            break;
        case 'paused':
            that._view.sendung.ellipsize = false;
            that._view.control.setImage('/images/play.png');
            that._view.slider.show();
            that._view.progress.hide();
            that._view.visualizerContainer.hide();
            that._view.slider.addEventListener('change', that.onSliderChangeFn);
            break;
        case 'playing':
            if (alertactive === true)
                return;
            that._view.slider.removeEventListener('change', that.onSliderChangeFn);
            that._view.progress.show();
            that._view.slider.hide();
            that._view.spinner.hide();
            //that._view.subtitle.ellipsize = Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE;
            that._view.sendung.ellipsize = Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE;
            that._view.visualizerContainer.show();
            that.setControlView();
            break;
        }
    };
    this.stopPlayer = function() {
        console.log("📻 stoppingPlayer");
        if (this._view.mVisualizerView) {
            this._view.mVisualizerView = null;
        }
        if (this._view) {
            this._view.removeAllChildren();
            this._view == null;
        }
        //  singletonPlayer.seek(0);
        singletonPlayer.stop();
        singletonPlayer && singletonPlayer.release();
        //  if (!singletonPlayer.playing)  {
        that._window.close();
        //  }
        singletonPlayer.removeEventListener('progress', this.onProgressFn);
        singletonPlayer.removeEventListener('complete', this.onCompleteFn);
        singletonPlayer.removeEventListener('change', this.onStatusChangeFn);
    };
    this.startPlayer = function(time) {

        console.log("📻 START PLAYER");
        if (!time)
            time = 0;
        var that = this;
        this._view.setVisible(true);
        var maxRange = this.options.duration * 1000;
        this._view.progress.setMax(maxRange);
        this._view.slider.setMax(maxRange);
        this._view.progress.value = 0;
        this._view.slider.value = 0;
        this._view.sendung.text = this.options.title;
        //    this._view.title.setColor(this.options.color);
        this._view.title.text = this.options.subtitle;
        this._view.description.setText(this.options.description ? this.options.description : "");
        this._view.duration.setText(Moment.unix(this.options.duration).utc().format('HH:mm:ss'));
        singletonPlayer && singletonPlayer.release();
        singletonPlayer.seek(time);

        /*  if (item.cached || Ti.Network.online) {
         singletonPlayer.setUrl(item.url);
         singletonPlayer.start();
         timeout = setTimeout(that.stopPlayer, TIMEOUT);
         return;
         }
         Ti.UI.createNotification({
         message : "Der Beitrag ist noch nicht nicht heruntergeladen und ich sehe Probleme mit dem Internet"
         }).show();*/
        this.stopPlayer();
    };
    this.createWindow = function() {
        console.log("createWindow");
        this._window = Ti.UI.createWindow({
            backgroundColor : 'transparent',
            theme : 'Theme.AppCompat.Translucent.NoTitleBar.Fullscreen',
            modal : true
        });
        /* here begins the real code */
        function onStart() {

        }

        function onLoad() {

        }

        const Storage = StorageAdapter.create();
        const item = Storage.addItem(this.options, onStart, onLoad);
        var that = this;
        that._view = playerViewModule.getView(that.options);
        that._window.add(that._view);
        console.log("Overlay added");
        that._view.control.addEventListener('longpress', function() {
            that.stopPlayer();
        });
        that._view.control.addEventListener('singletap', function() {
            /*
             if (CacheAdapter.isCached(that.options)) {
             if (singletonPlayer.playing)
             singletonPlayer.pause();
             else {
             that.progress = that._view.slider.getValue();
             singletonPlayer.seek(that.progress);
             singletonPlayer.play();
             }
             }*/
        });

        this._window.addEventListener('open', function() {
            console.log("window is open");
            that.startPlayer();
            Permissions.requestPermissions(['RECORD_AUDIO','WRITE_EXTERNAL_STORAGE'], _success => {
                if (_success) {
                    console.log("Permissions granted");
                    that._view.visualizerView = AudioVisualizer.createView({

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
                }
            });
        });
        this._window.open();
        console.log("📻 window opened");
        return true;
    };

    if (this.createWindow()) {
        console.log("📻createWindow");
        var that = this;

        console.log("📻adding events to Player");
        singletonPlayer.addEventListener('progress', this.onProgressFn);
        singletonPlayer.addEventListener('complete', this.onCompleteFn);
        singletonPlayer.addEventListener('change', this.onStatusChangeFn);
        console.log("📻 events added to Player");
        this._window.addEventListener("android:back", function() {
            that._view.control.fireEvent('longpress', {});
            return false;
        });
    }

};

exports.createAndStartPlayer = function(options) {
    return new $(options);
};

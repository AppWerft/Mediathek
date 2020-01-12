const FFmpwg = require('ti.ffmpeg');

exports.load = function(cb) {
    FFmpeg.loadBinary({
       // endpoint : "https://raw.githubusercontent.com/AppWerft/Ti.FFmpeg/master/ffmpegbinaries/",
        onstart : function() {
            console.log("loadBinary::START");
        },
        onsuccess : function() {
            cb && cb.onload && cb.onload();
            Ti.App.Properties.setString("FFMPEG", FFmpeg.getABI());
            console.log("loadBinary::SUCCESS");
        },
        onfailure : function() {
            console.log("loadBinary::FAILURE");
        },
        onfinish : function() {
            console.log("loadBinary::FINISH");
        },
    });
};
exports.isLoaded =function() {
    return Ti.App.Properties.hasProperty("FFMPEG") ? true : false;
};

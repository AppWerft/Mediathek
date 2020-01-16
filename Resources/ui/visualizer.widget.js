const AudioVisualizer = require('ti.audiovisualizerview'),
    Settings = require('controls/settings');

module.exports = function(lifecycleContainer, color, audioSessionId) {
    return AudioVisualizer.createView({
      //      zIndex:999,
        bottom:40,
        audioSessionId : audioSessionId,
        linegraphRenderer : Settings.get("VISULINE") ? {
            strokeWidth : 0.7 * Ti.Platform.displayCaps.logicalDensityFactor
        } : undefined,
        bargraphRenderer : Settings.get("VISUBAR") ? {
            barWidth : Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor / 7 * Ti.Platform.displayCaps.logicalDensityFactor,
            color : color,
            divisions : 9
        } : undefined,
        touchEnabled : false,
        bottom : Settings.get("VISUBAR") ? 0 : undefined,
       // lifecycleContainer : lifecycleContainer,
    });
};

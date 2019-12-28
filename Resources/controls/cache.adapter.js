"use strict";
var FOLDER = 'RadioCache';
var MIN = 100000;
const DLM = require('de.appwerft.downloadmanager');

if (Ti.Filesystem.isExternalStoragePresent())
    var DEPOT = Ti.Filesystem.externalStorageDirectory;
else
    var DEPOT = Ti.Filesystem.applicationDataDirectory;
var folder = Ti.Filesystem.getFile(DEPOT, FOLDER);
if (!folder.exists()) {
    folder.createDirectory();
}

exports.getTree = function() {

};

exports.isCached = function(options) {
    if (!options || !options.station) {
        console.log("Warning: no options for cache manager");
        return false;
    }
    var folder = Ti.Filesystem.getFile(DEPOT, FOLDER, options.station);
    if (!folder.exists()) {
        folder.createDirectory();
    }
    var parts = options.url.match(/\/([0-9_a-zA-Z]+\.mp3)$/);
    var filename = parts ? parts[1] : Ti.Utils.md5HexDigest(options.url);
    var file = Ti.Filesystem.getFile(DEPOT, FOLDER, options.station, filename);

    return file.exists() ? true : false;
};

exports.deleteURL = function(options) {
    var folder = Ti.Filesystem.getFile(DEPOT, FOLDER, options.station);
    if (!folder.exists()) {
        folder.createDirectory();
    }
    var parts = options.url.match(/\/([0-9_a-zA-Z]+\.mp3)$/);
    var filename = parts ? parts[1] : Ti.Utils.md5HexDigest(options.url);
    var file = Ti.Filesystem.getFile(DEPOT, FOLDER, options.station, filename);
    if (file.exists()) {
        file.deleteFile();
    }

};

exports.cacheURL = function(options) {
    const folder = Ti.Filesystem.getFile(DEPOT, FOLDER, options.station);
    if (!folder.exists()) {
        folder.createDirectory();
    }
    console.log(options);
    var parts = options.url.match(/\/([0-9_a-zA-Z]+\.mp3)$/);
    var filename = parts ? parts[1] : Ti.Utils.md5HexDigest(options.url);
    var localfile = Ti.Filesystem.getFile(DEPOT, FOLDER, options.station, filename);
    var request = DLM.createRequest(options.url);
    request//
        .setAllowedNetworkTypes(Ti.Network.NETWORK_WIFI)//
        .setTitle("netter Titel")//
        .setdescription("nette Beschreibung")//
        .setDestinationUri(localfile);
    const id = request.enqueue();
};

exports.getURL = function(options) {
    var folder = Ti.Filesystem.getFile(DEPOT, FOLDER, options.station);
    if (!folder.exists()) {
        folder.createDirectory();
    }
    var parts = options.url.match(/\/([0-9_a-zA-Z]+\.mp3)$/);
    var filename = parts ? parts[1] : Ti.Utils.md5HexDigest(options.url);
    var file = Ti.Filesystem.getFile(DEPOT, FOLDER, options.station, filename);
    if (file.getSize() < 512 && file.getSize() != 0) {// zombie
        console.log("Warning: file deleted because of to short, was " + file.getSize());
        file.deleteFile();
    }
    if (file.exists()) {
        return {
            url : file.nativePath,
            cached : true
        };
    } else {
        return {
            url : options.url,
            cached : false
        };
    }
}; 
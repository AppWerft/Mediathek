const Stations = require('model/stations');
var key = Ti.App.Properties.getString('LAST_STATION', 'dlf');
var currentPage = 0;
Object.keys(Stations).forEach(function(k, index) {
    if (k == key)
        currentPage = index;
});

exports.Stations = Stations;
exports.Moment = require('vendor/moment');

exports.АктйонБар = require('com.alcoapps.actionbarextras');

exports.currentPage = currentPage;
exports.currentStation = key;

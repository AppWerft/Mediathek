const Stations = require('model/stations'),
BroadcastsList =require('ui/archive/broadcasts.list');



module.exports = function() {
  const carusell = Ti.UI.createScrollableView({
      views : Object.keys(Stations).map(BroadcastsList)
      
  });
  const $ = Ti.UI.createAlertDialog({
      
  });  
    
};

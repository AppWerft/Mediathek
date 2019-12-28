module.exports = function requestOnlinestate(_cb) {
    if (Ti.Network.online == false) {
        LOG("Ti.Network.online false");
        wasLastPingSuccessful = false;
        _cb && _cb(false);
    } else {
        var xhr = Ti.Network.createHTTPClient({
            timeout : TICK,
            onload : function() {
                if (xhr.status == 301) {
                    wasLastPingSuccessful = true;
                    _cb && _cb(true);
                } else {
                    wasLastPingSuccessful = false;
                    _cb && _cb(false);
                }
            },
            onerror : function() {
                wasLastPingSuccessful = false;
                _cb && _cb(false);
            }
        });
        xhr.autoRedirect = false;
        xhr.open('HEAD', 'https://facebook.com/'), xhr.send();
    }
};

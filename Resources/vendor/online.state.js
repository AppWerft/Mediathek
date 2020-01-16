exports.TIMEOUT = TIMEOUT = 1;
exports.OFFLINE = OFFLINE = 0;
exports.CAPTIVEPORTAL = CAPTIVEPORTAL = 2;
exports.ONLINE = ONLINE = 3;

exports.test = (_timeout,_cb) => {
    if (Ti.Network.online == false) {
        _cb && _cb(OFFLINE);
    } else {
        var xhr = Ti.Network.createHTTPClient({
        timeout : _timeout,
        onload : ()  => {
            const location = xhr.getResponseHeader("location");
            console.log(xhr.status + ' ' + location);
            const status = (xhr.status == 301 && location && location.indexOf('facebook.com') > -1) ? ONLINE : CAPTIVEPORTAL;
            _cb(status);
        }, onerror : () => {
            _cb && _cb(TIMEOUT);
        }
    });
    xhr.setAutoRedirect(false);
    xhr.open('HEAD', 'https://facebook.com/');
    xhr.setRequestHeader("User-Agent", "Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0");
    xhr.send();
}
};
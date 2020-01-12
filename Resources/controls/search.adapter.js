var Moment = require('vendor/moment'),
    Soup = require("de.appwerft.soup"),
    Stations = require('model/stations'),
    DB = Ti.App.Properties.getString('DATABASE'),
    URL = 'http://srv.deutschlandradio.de/aodlistaudio.1706.de.rpc?drau:searchterm=NEEDLE&drau:page=PAGE&drau:limit=1500';

const loadSendungen = function(needle, page, onload) {
    var url = URL.replace('NEEDLE', encodeURIComponent(needle)).replace('PAGE', page || '1');
    console.log(url);
    Soup.createDocument({
        url : url,
        timeout : 30000,
        useragent : 'Das%20DRadio/6 CFNetwork/711.1.16 Darwin/14.0.0',
        onerror : function() {
            console.log("Error from Soup !!!!");
        },
        onload : function(result) {
            var start = new Date().getTime();
            if (!result.document) {
                console.log("Error: result without document");
                return;
            }
            var res = [];
            console.log("length of XML answer: " + result.length);

            var items = result.document.select("item");
            items && items.forEach(function(item) {
                const station = item.getFirstElementByTag("station").getText().toLowerCase();
                const duration = 1000 * item.getAttribute("duration");
                const pubdate = Moment(item.getFirstElementByTag("datetime").getText());
                res.push({
                    url : item.getAttribute("url"),
                    timestamp : item.getAttribute("timestamp"),
                    pubdate : pubdate.format('DD.MM.YYYY HH:mm') + ' Uhr',
                    duration : duration,
                    durationHHmmss : Moment(duration).utc().format("H:mm:ss"),
                    deliveryMode : item.getAttribute("deliveryMode"),

                    title : item.getFirstElementByTag("title").getText(),
                    station : station,
                    author : item.getFirstElementByTag("author").getText(),
                    sendung : item.getFirstElementByTag("sendung").getText(),
                    color : Stations[station].color,
                    image : '/images/' + station + '.png',
                });
            });
            console.log("parseTime=" + (new Date().getTime() - start));
            onload({
                count : res.length,
                items : res,
                duration : result.duration,
                page : page
            });
            // after first page is rendered:
            if (page == 1) { // Start page
                const pages = result.document.selectFirst("entries").getAttribute("pages");
                if (pages) { // only start from first page
                    for (var p = 2; p <= pages; p++)
                        loadSendungen(needle, p, onload);
                }
            }
        }
    });

};

module.exports = loadSendungen;

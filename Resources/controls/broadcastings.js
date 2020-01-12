const Soup = require("de.appwerft.soup");

module.exports = function(cb, id, color) {
    var URL = "https://srv.deutschlandradio.de/aodlistbroadcasts.1707.de.rpc";
    if (id)
        URL += ("?drbm:station_id=" + id);
    require('de.appwerft.soup').createDocument({
        url : URL,
        timeout : 5000,
        onerror : function() {
            console.log("Error from Soup !!!!");
        },
        onload : function(result) {
            if (!result.document) {
                console.log("Error: result without document");
                return;
            }
            var items = result.document.select("item");
            if (items)
                cb({
                    items : items.map(function(item) {
                        return {
                            id : item.getAttribute("id"),
                            title : item.getText()
                        };
                    }),
                    color : color
                });
        }
    });
};


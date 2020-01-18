const Aod = require('ti.aod');
const blacklistofemptybroadcasts = [559, 775, 747, 826, 824, 830, 636, 609, 839, 748, 797, 660, 623, 764, 635, 792, 790, 791, 793, 781, 759, 626, 625, 624, 691] ;
module.exports = function(station) {
    const $ = Ti.UI.createListView({
        templates : {
            'archive' : require('TEMPLATES').archive,
        },
        defaultItemTemplate : 'archive',
        backgroundColor : 'transparent',
        sections : []
    });
    const onitemclickFn = (event) => {
        require("ui/archive/broadcastings.window")(JSON.parse(event.itemId)).open();
    }
    $.addEventListener('itemclick', onitemclickFn);
    function onLoad(data) {
        const items = data.broadcastings.map(item => {
                return {
                    properties : {
                        itemId : JSON.stringify(item),
                        backgroundColor : station.color,
                        accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE,
                    },
                    title : {
                        text : item.title
                    }
                };
        });
        $.appendSection(Ti.UI.createListSection({
            items : items.filter(item => !blacklistofemptybroadcasts.includes(parseInt(item.id)))
        }));
    }

    if (Ti.Network.online)
        Aod.createListbroadcasts({
            station : station.id,
            onload : onLoad
        });
    return $;
};

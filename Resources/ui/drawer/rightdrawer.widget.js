const lila = '#5933AC';

module.exports = function() {
    const $ = Ti.UI.createListView({
        backgroundColor : lila,
        headerTitle : "Historie"    

    });
    return $;
};

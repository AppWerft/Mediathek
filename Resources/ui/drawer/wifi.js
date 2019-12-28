module.exports = function() {
    const $ = Ti.UI.createView({
        height : 45
    });
    $.add(Ti.UI.createLabel({
        color : 'white',
        left : 10,
        text : "Download auch im mobilen Netz"
    }));
     $.add(Ti.UI.createSwitch({
        color : 'white',
        right : 5,
          enabled : false,
        value : true
    }));
    return $;
};

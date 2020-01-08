module.exports = (station) => {
    const $ = Ti.UI.createView({
        zIndex : 999,
        bottom : 0,
        height: '50%'
    });
    $.add(require("ti.animation").createAnimationView({
        file : '/gears.json',
        loop : true,
        autoStart : true,
        transform : Ti.UI.create2DMatrix({
            scale : 2.0
        })
    }));
    return $;
}; 
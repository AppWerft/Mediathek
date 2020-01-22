module.exports = (station) => {
    const $ = Ti.UI.createView({
        zIndex : 999,
        bottom : 0,
        touchEnabled:false,
        height: '50%'
    });
    $.add(require("ti.animation").createAnimationView({
        file : '/images/swiper.json',
        loop : true,
         touchEnabled:false,
        autoStart : true,
        transform : Ti.UI.create2DMatrix({
            scale : 0.9
        })
    }));
    return $;
}; 
var start = new Date().getTime();
var $ = function(props) {
    if (!props)
        props = {};
    var color = (props.color) ? props.color : 'white';
    var $ = Ti.UI.createView({
        backgroundColor : '#88000000',
        touchEnabled:false

    });
    $.topcontainer = Ti.UI.createView({
        top : 0,
        layout : "vertical",
        touchEnabled:false
    });
    if (props.image) {
        $.add(Ti.UI.createImageView({
            touchEnabled : false,
            bottom : 0,
            zIndex : 0,
            width : Ti.UI.FILL,
            height : 'auto',
            image : props.image
        }));
    }
    $.add($.visualizerContainer);
    $.container = Ti.UI.createView({
        touchEnabled : false,
        height : 230,
        zIndex : 99,
        bottom : 0,
    });
    $.add($.container);
    $.progress = Ti.UI.createProgressBar({
        bottom : 20,
        left : 80,
        right : 10,
        height : 30,
        width : Ti.UI.FILL,
        min : 0,
        max : props.duration
    });
    $.slider = Ti.UI.createSlider({
        bottom : 15,
        left : 80,
        visible : false,
        right : 10,
        height : 30,
        width : Ti.UI.FILL,
        min : 0,
        max : 100
    });
    $.duration = Ti.UI.createLabel({
        bottom : 2,
        text : '0:00',
        bubbleParent : false,
        touchEnabled : false,
        font : {
            fontSize : 12
        },
        color : 'white',
        right : 10,
    });
    $.sendung = Ti.UI.createLabel({
        top : 165,
        bubbleParent : false,
        touchEnabled : false,
        color : 'white',
        horizontalWrap : false,
        width : Ti.UI.FILL,
        text : props.title,
        maxLines : 1,
        ellipsize : Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
        height : 25,
        font : {
            fontSize : 16,
            fontFamily : 'ScalaSansBold'
        },
        left : 80,
    });
    $.title = Ti.UI.createLabel({
        top : 10,
        bubbleParent : false,
        touchEnabled : false,
        color : 'white',
        width : Ti.UI.FILL,
        height : Ti.UI.SIZE,
        text : props.subtitle,
        font : {
            fontSize : (props.image) ? 34 : 48,
            fontFamily : 'ScalaSansBold'
        },
        left : 10,
        right : 10
    });
    $.author = Ti.UI.createLabel({
        top : 10,
        bubbleParent : false,
        touchEnabled : false,
        color : 'white',
        width : Ti.UI.FILL,
        height : Ti.UI.SIZE,
        font : {
            fontSize : 24,
            fontStyle : 'italic',
            fontFamily : 'ScalaSansBold'
        },
        left : 10,
        right : 10,
        text : props.author
    });
    $.description = Ti.UI.createLabel({
        top : 10,
        bubbleParent : false,
        touchEnabled : false,
        color : '#ffffff',
        width : Ti.UI.FILL,
        height : Ti.UI.SIZE,
        text : "",
        font : {
            fontSize : 16,
            fontFamily : 'ScalaSansBold'
        },
        left : 10,
        right : 5
    });
    $.control = Ti.UI.createImageView({
        width : 50,
        height : 50,
        bubbleParent : false,
        left : 10,
        image : '/images/pause.png',
        bottom : 15,
        visible : false
    });
    $.container.add($.progress);
    $.container.add($.slider);
    $.container.add($.duration);
    $.container.add($.sendung);
    $.add($.topcontainer);
    $.topcontainer.add($.title);
    $.topcontainer.add($.author);
    $.topcontainer.add($.description);
    $.container.add($.control);
    $.container.add($.spinner);
    return $;
};
exports.getView = $; 
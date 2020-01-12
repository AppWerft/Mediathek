const Moment = require('vendor/moment'),
    Draggable = require('ti.draggable');
Moment.locale("de");

var subscribe = function(proxy, observer) {
    var key,
        events,
        eIndex;

    for (key in observer) {
        if ( typeof observer[key] === 'function') {
            events = key.split(' ');

            for (eIndex in events) {
                proxy.addEventListener(events[eIndex], observer[key]);
            }
        }
    }
};

module.exports = function(parent, cb) {
    const currentDate = parent.date;
    const $ = Draggable.createView({
        width : 64,
        bottom : 20,
        right : 20,
        touchFeedback : true,
        touchFeedbackColor : "#808080",
        elevation : 10,
        height : 64,
        borderRadius : 32,
        backgroundColor : parent.color
    });
    $.draggable.setConfig({
        minLeft : 50,
        minTop : 50,

    });
    $.add(Ti.UI.createView({
        top : 10,
        width : 30,
        height : 30,
        backgroundImage : '/images/calendar.png'
    }));

    $.Label = Ti.UI.createLabel({
        color : 'white',
        font : {
            fontSize : 10
        },
        bottom : 7,
        text : currentDate.format("DD.MM.YY")
    });
    $.add($.Label);
    $.addEventListener('click', function() {
        $.animate({
            transform : Ti.UI.create2DMatrix({
                scale : 0.8
            }),
            duration : 100,
            autoreverse : true,
            repeat : 0
        });
        $.picker = Ti.UI.createPicker({
            type : Ti.UI.PICKER_TYPE_DATE,
            minDate : new Date(2000, 0, 1),
            maxDate : Moment().toDate(),
            value : currentDate.toDate(),
            locale : 'de-DE'
        });
        $.picker.showDatePickerDialog({
            value : Moment().toDate(),
            locale : 'de-DE',
            callback : function(e) {

                if (!e.cancel) {
                    parent.date = Moment(e.value);
                    parent.updateMediathekList();
                    $.Label.text = Moment(parent.date).format("DD.MM.YY");
                }
            }
        });
    });
    $.addEventListener('end',function(){
        
    });
    subscribe($, {
                'start move end cancel' : function (e) {
                    console.log(
                        'Event: ' + e.type,
                        'Left: ' + e.left,
                        'Top: ' + e.top
                    );
                }
            });

    return $;
};

const LDF = Ti.Platform.displayCaps.logicalDensityFactor;
const SCREENWIDTH = Ti.Platform.displayCaps.platformWidth / LDF;
const SCREENHEIGHT = Ti.Platform.displayCaps.platformHeight / LDF;
const DIVISIONS = Math.round(25 / LDF);
const Dayplan = new (require('controls/dayplan.adapter'))();
const VisualizerModule = require('ti.audiovisualizerview');
const PATH = '/images/stationlogos3/%s.png';
const Permissions = require('vendor/permissions');

var $ = function(station) {
    var that = this;
    this.view = Ti.UI.createView({
        backgroundColor : '#aa000000'
    });
    this.topContainer = Ti.UI.createScrollView({
        layout : 'vertical',
        bottom:50,
        scrollType : 'vertical'
    });
    this.view.add(this.topContainer);
    this.titleView = Ti.UI.createLabel({
        color : "white",
        font : {
            fontSize : 32,
            fontFamily : 'Aller Bold'
        },
        text : '',
        width : Ti.UI.FILL,
        left : 20,
        top : 20,
        right : 20
    });
    this.topContainer.add(this.titleView);
    this.descriptionView = Ti.UI.createLabel({
        color : "white",
        font : {
            fontSize : 22,
            fontFamily : 'Aller Bold'
        },
        text : '',
        width : Ti.UI.FILL,
        left : 20,
        top : 10,
        right : 20
    });
    this.topContainer.add(this.descriptionView);
    this.bottomContainer = Ti.UI.createView({
        bottom : 40,
        right : 0,
        width : SCREENWIDTH/2,
        height : SCREENWIDTH/2,
        backgroundColor : station.color,
    });

    this.view.add(this.bottomContainer);

    this.radiotextView = Ti.UI.createView({
        height : 40,
        bottom : 0,
        backgroundColor : station.color
    });
    this.radiotextView.add(Ti.UI.createLabel({
        color : "white",
        font : {
            fontSize : 22,
            fontFamily : 'Aller Bold'
        },
        text : station.name,
        width : Ti.UI.FILL,
        horizontalWrap : false,
        ellipsize : Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
        left : 20,
        right : 20
    }));
    Dayplan.getCurrentOnAir(station.station, currentItem => {
        console.log("currentItem");
        for (var item in currentItem) {
            console.log(item + ' =' + currentItem[item]);
        }
        if (currentItem.image) {
            if (!this.coverView) {
                this.coverView = Ti.UI.createImageView({
                    top : 0,
                    height : SCREENWIDTH,
                    image : currentItem.image,
                });
                this.view.add(this.coverView);
            }
            this.coverView.image = currentItem.image
        }
        if (currentItem.avatar) {
            if (!this.avatarView) {
                this.avatarView = Ti.UI.createImageView({
                    bottom:40,
                    left :0,
                    width: "50%",
                    height : 'auto',
                    image : currentItem.avatar,
                });
                this.view.add(this.avatarView);
            }
            this.coverView.image = currentItem.image
        }
        if (currentItem.title)
            this.titleView.text = currentItem.title;
        if (currentItem.description)
            this.descriptionView.text = currentItem.description//
            .replace(/<br\/>/gim, '\n')//
            .replace(/<\/p>/gim, '\n').replace(/<p>/gim, '');
    });
    this.view.add(this.radiotextView);
    //playerView.children[0].addEventListener('click', stopPlayer);
    return this;
};

$.prototype.getView = function() {
    return this.view;
};
$.prototype.rerenderUI = function() {
    
};

$.prototype.addVisualization = function() {
    var v = VisualizerModule.createView({
        audioSessionId : 0,
        touchEnabled : false,
        transform : Ti.UI.createMatrix2D({
            rotate : 90,
            scale : 0.4,
            
        }),
        bargraphRenderer : {
            barWidth : 0.8 * SCREENWIDTH / DIVISIONS / LDF,
            color : 'white',
            divisions : DIVISIONS
        },
    });
    this.bottomContainer.add(v);
};
$.prototype.setText = function(text) {
    this.radiotextView.children[0].text = text;
};

exports.createView = function(s) {
    return new $(s);
};

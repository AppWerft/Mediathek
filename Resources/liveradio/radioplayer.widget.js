const Dayplan = new (require('controls/dayplan.adapter'))();
const VisualizerView = require('ui/visualizer.widget');
const H = 100;
const SCREENWIDTH = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor;
const Permissions = require('vendor/permissions');

var $ = function(window) {
    this.window = window;
    this.station = window.station;

    var that = this;
    this.view = Ti.UI.createView({
        backgroundColor : '#99000000',

    });
    this.starttime = 0;
    this.topContainer = Ti.UI.createView({
        top : 0,
        height : H,
        layout : 'vertical'

    });

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

    this.progressView = require('liveradio/progress.widget')({
        color : this.station.color,
        start : 'Start',
        end : 'Ende'
    });

    this.topContainer.add(this.titleView);
    if (this.station.station != 'drw')
       this.topContainer.add(this.progressView);

    this.bottomContainer = Ti.UI.createScrollView({
        scrollType : 'vertical',
        layout : 'vertical',
        top : H,
        bottom : 40
    });
    this.bottomContainer.addEventListener("scrollstart",() => {
        if (this.zappler)
            this.zappler.opacity = 0;
    });
    this.bottomContainer.addEventListener("scrollend",() => {
        if (this.zappler)
            this.zappler.animate({
                opacity : 1
            });
    });

    this.view.add(this.topContainer);
    this.view.add(this.bottomContainer);
    this.descriptionView = Ti.UI.createLabel({
        color : "white",
        font : {
            fontSize : 18,
            fontFamily : 'Aller Bold'
        },
        text : '',
        width : Ti.UI.FILL,
        left : 20,
        top : 0,
        right : 20
    });
    this.bottomContainer.add(this.descriptionView);
    this.radiotextView = Ti.UI.createView({
        height : 40,
        bottom : 0,
        backgroundColor : this.station.color
    });
    this.view.add(this.radiotextView);
    this.radiotextView.add(Ti.UI.createLabel({
        color : "white",
        font : {
            fontSize : 22,
            fontFamily : 'Aller Bold'
        },
        text : this.station.name,
        width : Ti.UI.FILL,
        horizontalWrap : false,
        ellipsize : Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE,
        left : 20,
        right : 20
    }));
    this.updateView = () => {
        console.log("Start cronjob „updateRadioView“");
        Dayplan.getCurrentOnAir(this.station.station, currentItem => {           
            if (!currentItem.starttime)
                return;
            if (!this.starttime)
                this.starttime = currentItem.starttime;
                
            if (currentItem.starttime && this.starttime && currentItem.starttime > this.starttime) {
                console.log("Das Ende naht ...");
                this.window.close();
            }
            if (!currentItem.title)
                return;
            if (this.progressView) {
                this.progressView.startView.text = currentItem.start;
                this.progressView.endView.text = currentItem.end;
                this.progressView.progressBar.width = currentItem['progress'];
            } else
                console.log("no progressView!!")
            if (currentItem.image) {
                if (!this.coverView) {
                    this.coverView = Ti.UI.createImageView({
                        top : 0,
                        height : SCREENWIDTH,
                        image : currentItem.image,
                    });
                    this.view.add(this.coverView);
                }
               if (this.coverView) this.coverView.image = currentItem.image
            }
            if (currentItem.avatar) {
                if (!this.avatarView) {
                    this.avatarView = Ti.UI.createImageView({
                        bottom : 40,
                        left : 0,
                        width : "50%",
                        height : 'auto',
                        image : currentItem.avatar,
                    });
                    this.view.add(this.avatarView);
                }
            }
            if (currentItem.title) {
                this.titleView.text = currentItem.title;

            }
           this.descriptionView.text = (currentItem.description) ? currentItem.description.replace(/<br\/>/gim, '\n')//
           .replace(/<\/p>/gim, '\n').replace(/<p>/gim, '').replace(/&amp;/gim, '&') : "";
        });
    }
    //playerView.children[0].addEventListener('click', stopPlayer);
    return this;
};

$.prototype.getView = function() {
    return this.view;
};
$.prototype.rerenderUI = function() {

};

$.prototype.addVisualization = function() {
    this.zappler = VisualizerView(this.window, this.station.color, 0);
    this.zappler.bottom = 40, this.window.add(this.zappler);
};

$.prototype.setText = function(text) {
    this.radiotextView.children[0].text = text;
};

exports.createView = function(s) {
    return new $(s);
};

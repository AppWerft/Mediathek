exports.schema = {
	properties : {
		height : Ti.UI.SIZE,
		backgroundColor : 'white',
		itemId : ''
	},
	childTemplates : [{
		type : 'Ti.UI.Label',
		bindId : 'start',
		properties : {
			left : 5,
			touchEnabled : false,
			top : 5,
			color : '#777',
			font : {
				fontSize : 22,

				fontFamily : 'Aller'
			},
		}
	}, {
		type : 'Ti.UI.ImageView',
		bindId : 'onair',
		properties : {
			left : 10,
			top : 40,
			bottom : 10,
			touchEnabled : true,
			visible : false,
			image : '/images/play.png',
			width : 40,
			height : 40
		}
	}, {
		type : 'Ti.UI.View',
		properties : {
			width : Ti.UI.FILL,
			layout : 'vertical',
			left : 80,
			top : 0,
			height : Ti.UI.SIZE,
			right : 15
		},
		childTemplates : [{
			type : 'Ti.UI.Label',
			bindId : 'title',
			properties : {
				top : 5,
				font : {
					fontSize : 22,
					fontFamily : 'Aller Bold'
				},
				left : 0,
				width : Ti.UI.FILL,
			}

		}, {
			type : 'Ti.UI.Label',
			bindId : 'description',
			properties : {
				left : 0,
				top : 0,
				html : '',
				height : Ti.UI.SIZE,
				touchEnabled : false,
				font : {
					fontSize : 16,
					fontFamily : 'Aller'
				},
				color : '#333'
			}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'duration',
			properties : {
				left : 0,
				top : 0,
				bottom : 5,
				height : Ti.UI.SIZE,
				touchEnabled : false,
				font : {
					fontSize : 16,
					fontFamily : 'Aller'
				},
				color : '#888'
			}
		}]
	}]
};

exports.archive = {
    properties : {
        height : 60,
        backgroundColor : 'white',
        itemId : ''
    },
    childTemplates : [{
            type : 'Ti.UI.Label',
            bindId : 'title',
            
            properties : {
                
                font : {
                    fontSize : 20,
                    fontFamily : 'Aller Bold'
                },
                left : 10,
                right:50,
                width : Ti.UI.FILL,
                color : 'white',
            }
    }]
};

exports.podcastlist = {
	properties : {
		height : Ti.UI.SIZE,
		backgroundColor : 'white',
		itemId : ''
	},
	childTemplates : [{
		type : 'Ti.UI.ImageView',
		bindId : 'image',
		properties : {
			left : 0,
			top : 0,
			touchEnabled : true,
			width : 90,
			height : 90
		}
	}, {
		type : 'Ti.UI.Label',
		bindId : 'copyright',
		properties : {
			visible : false,
			touchEnabled : false,
		}
	},{
		type : 'Ti.UI.View',
		bindId: 'playstarter',
		properties : {
			width : Ti.UI.FILL,
			layout : 'vertical',
			left : 100,
			bottom : 10,
			right : 20
		},
		childTemplates : [{
			type : 'Ti.UI.Label',
			bindId : 'title',
			properties : {
				top : 5,
				font : {
					fontSize : 22,
					fontFamily : 'Aller Bold'
				},
				left : 0,
				width : Ti.UI.FILL,
			}

		}, {
			type : 'Ti.UI.Label',
			bindId : 'description',
			properties : {
				left : 0,
				top : 0,
				text : '',
				touchEnabled : false,
				font : {
					fontSize : 16,
					fontFamily : 'Aller'
				},
				color : '#333'
			}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'pubdate',
			properties : {
				left : 0,
				touchEnabled : false,
				top : 0,
				color : '#777',
				font : {
					fontSize : 16,
					fontFamily : 'Aller'
				},
			}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'duration',
			properties : {
				left : 0,
				touchEnabled : false,
				top : 0,
				color : '#777',
				font : {
					fontSize : 16,
					fontFamily : 'Aller'
				},
			}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'author',
			properties : {
				left : 0,
				touchEnabled : false,
				top : 5,
				color : '#777',
				font : {
					fontSize : 14,
					fontFamily : 'Aller'
				},
			}
		}]
	}]
};

exports.klangkunst = {
	properties : {
		height : Ti.UI.SIZE,
		backgroundColor : 'white',
		itemId : ''
	},
	childTemplates : [{
		type : 'Ti.UI.ImageView',
		bindId : 'image',
		properties : {
			left : 0,
			top : 5,
			touchEnabled : false,
			width : 120,
			height : 90
		}
	}, {
		type : 'Ti.UI.ImageView',
		bindId : 'alarm',
		properties : {
			left : 80,
			top : 90,
			opacity : 0.9,
			width : 40,
			height : 40
		}
	}, {
		type : 'Ti.UI.View',
		properties : {
			width : Ti.UI.FILL,
			layout : 'vertical',
			left : 130,
			right : 20
		},
		childTemplates : [{
			type : 'Ti.UI.Label',
			bindId : 'subtitle',
			properties : {
				top : 5,
				font : {
					fontSize : 20,
					fontFamily : 'Aller Bold'
				},
				left : 0,
				height : Ti.UI.SIZE,
				width : Ti.UI.FILL,
			}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'title',
			properties : {
				top : 5,
				font : {
					fontSize : 20,
					fontFamily : 'Aller'
				},
				left : 0,
				width : Ti.UI.FILL,
			}

		}, {
			type : 'Ti.UI.Label',
			bindId : 'description',
			properties : {
				left : 0,
				top : 0,
				text : '',
				touchEnabled : false,
				font : {
					fontSize : 16,
					fontFamily : 'Aller'
				},
				color : '#333'
			}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'pubdate',
			properties : {
				left : 0,
				touchEnabled : false,
				top : 0,
				color : '#777',
				font : {
					fontSize : 16,
					fontFamily : 'Aller'
				},
			}
		}]
	}]
};

/************/
exports.mediathek = {
    properties : {
        height : Ti.UI.SIZE,
        backgroundColor : 'white',
        itemId : ''
    },
    childTemplates : [{
        type : 'Ti.UI.Label',
        bindId : 'start',
        properties : {
            left : 5,
            height : Ti.UI.SIZE,
            touchEnabled : false,
            top : 2,
            color : '#555',
            font : {
                fontSize : 22,
                fontFamily : 'Aller'
            },
        }
    }, {
        type : 'Ti.UI.ImageView',
        bindId : 'fav',
        properties : {
            opacity : 0.5,
            left : 5,
            visible: false,
            top : 32,
            bottom : 5,
            bubbleParent : true,
            image : '/images/favadd.png',
            width : 30,
            height : 30
        }
    }, {
        type : 'Ti.UI.ImageView',
        bindId : 'share',
        properties : {
            opacity : 0.5,
            left : 35,
            visible: false,
            top : 35,
            bottom : 5,
            bubbleParent : true,
            image : '/images/share.png',
            width : 27,
            height : 27
        }
    }, {
        type : 'Ti.UI.View',
        bindId : 'playtrigger',
        properties : {
            width : Ti.UI.FILL,
            layout : 'vertical',
            left : 75,
            height: Ti.UI.SIZE,
            right : 25
        },
        childTemplates : [{
            type : 'Ti.UI.Label',
            bindId : 'subtitle',
            properties : {
                left : 0,
                top : 5,
                touchEnabled : false,
                font : {
                    fontSize : 20,
                    fontFamily : 'Aller Bold'
                },
                color : '#555',
                height : Ti.UI.SIZE
            }
        }, {
            type : 'Ti.UI.Label',
            bindId : 'autor',
            properties : {
                left : 0,
                top : 5,

                height : Ti.UI.SIZE,
                touchEnabled : false,
                font : {
                    fontSize : 12,
                    fontFamily : 'Aller'
                },
                color : '#333'
            }
        }, {
        
        type : 'Ti.UI.View',
       properties : {
            width : Ti.UI.FILL,
            bottom:10,
            left : 0,
            height: Ti.UI.SIZE,
            right : 25
        },
        childTemplates :  [{
            type : 'Ti.UI.ImageView',
            bindId : 'deliveryMode',
            properties : {
                left : 0,
                top : 5,
                
                height : Ti.UI.SIZE,
                touchEnabled : false,
                width : 30,
                height: 16,
                opacity:0.6
              
            }
        },{
            type : 'Ti.UI.Label',
            bindId : 'duration',
            properties : {
                left : 40,
                top : 0,
                
                height : Ti.UI.SIZE,
                touchEnabled : false,
                font : {
                    fontSize : 18,
                    fontFamily : 'Aller'
                },
                color : '#333'
            }
        }
        ]
    }]
    }]
};

exports.merkliste = {
	properties : {
		height : Ti.UI.SIZE,
		backgroundColor : 'white',
		itemId : ''
	},
	childTemplates : [{
		type : 'Ti.UI.ImageView',
		bindId : 'logo',
		properties : {
			opacity : 1,
			left : 0,
			top : 0,
			bubbleParent : true,
			image : '',
			width : 60,
			height : 60
		}
	}, {
		type : 'Ti.UI.ImageView',
		bindId : 'trash',
		properties : {
			opacity : 0.4,
			left : 0,
			top : 65,
			bubbleParent : true,
			image : '',
			width : 50,
			height : 50
		}
	}, {
		type : 'Ti.UI.Label',
		bindId : 'duration',
		properties : {
			color : '#555',
			top : 115,
			bottom : 5,
			font : {
				fontSize : 16,
				fontFamily : 'Aller'
			},
			left : 5,
			textAlign : 'left',
			width : Ti.UI.FILL,
		}

	}, {
		type : 'Ti.UI.View',
		bindId : 'trashcontainer',
		properties : {
			top : 0,
			left : 0,
			width : 70,
		}

	}, {
		type : 'Ti.UI.View',
		properties : {
			width : Ti.UI.FILL,
			layout : 'vertical',
			left : 70,
			right : 5,
			top : 0
		},
		childTemplates : [{
			type : 'Ti.UI.Label',
			bindId : 'subtitle',
			properties : {
				color : '#060',
				top : 5,
				font : {
					fontSize : 22,
					fontFamily : 'Aller'
				},
				left : 0,
				width : Ti.UI.FILL,
			}

		}, {
			type : 'Ti.UI.Label',
			bindId : 'title',
			properties : {
				left : 0,
				top : 0,
				height : Ti.UI.SIZE,
				touchEnabled : false,
				font : {
					fontSize : 18,
					fontFamily : 'Aller     Bold'
				},
				color : '#555'
			}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'autor',
			properties : {
				left : 0,
				top : 0,
				height : Ti.UI.SIZE,
				touchEnabled : false,
				font : {
					fontSize : 12,
					fontFamily : 'Aller'
				},
				color : '#333'
			}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'pubdate',
			properties : {
				left : 0,
				touchEnabled : false,
				top : 0,
				color : '#777',
				font : {
					fontSize : 14,
					fontFamily : 'Aller'
				},
			}
		}]
	}]
};

exports.merklisteactive = {
	properties : {
		height : Ti.UI.SIZE,
		backgroundColor : '#444',
		itemId : ''
	},
	childTemplates : [{
		type : 'Ti.UI.ImageView',
		bindId : 'logo',
		properties : {
			opacity : 1,
			left : 0,
			top : 0,
			bubbleParent : true,
			image : '',
			width : 60,
			height : 60
		}
	}, {
		type : 'Ti.UI.ImageView',
		bindId : 'trash',
		properties : {
			opacity : 0.4,
			left : 0,
			top : 0,
			bubbleParent : true,
			image : '',
			width : 0,
			height : 0
		}
	}, {
		type : 'Ti.UI.Label',
		bindId : 'duration',
		properties : {
			color : '#aaa',
			top : 65,
			bottom : 5,
			font : {
				fontSize : 18,
				fontFamily : 'Aller'
			},
			left : 5,
			textAlign : 'left',
			width : Ti.UI.FILL,
		}

	}, {
		type : 'Ti.UI.View',
		bindId : 'trashcontainer',
		properties : {
			top : 0,
			left : 0,
			width : 70,
		}

	}, {
		type : 'Ti.UI.View',
		properties : {
			width : Ti.UI.FILL,
			layout : 'vertical',
			left : 70,
			right : 5,
			top : 0
		},
		childTemplates : [{
			type : 'Ti.UI.Label',
			bindId : 'subtitle',
			properties : {
				color : '#060',
				top : 5,
				font : {
					fontSize : 22,
					fontFamily : 'Aller'
				},
				left : 0,
				width : Ti.UI.FILL,
			}

		}, {
			type : 'Ti.UI.Label',
			bindId : 'title',
			properties : {
				left : 0,
				top : 0,
				height : 0,
			}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'autor',
			properties : {
				left : 0,
				top : 0,
				height : 0,
			}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'pubdate',
			properties : {
				left : 0,
				touchEnabled : false,
				top : 0,
				color : '#eee',
				font : {
					fontSize : 14,
					fontFamily : 'Aller'
				},
			}
		}]
	}]
};

exports.mypodcasts = {
	properties : {
		height : Ti.UI.SIZE,
		backgroundColor : 'white',
		itemId : ''
	},
	childTemplates : [{
		type : 'Ti.UI.ImageView',
		bindId : 'logo',
		properties : {
			left : 0,
			top : 5,
			bubbleParent : true,
			image : '',
			width : 90,
			height : 90
		}
	}, {
		type : 'Ti.UI.View',
		properties : {
			width : Ti.UI.FILL,
			layout : 'vertical',
			left : 100,
			right : 25,
			bottom : 10
		},
		childTemplates : [{
			type : 'Ti.UI.Label',
			bindId : 'title',
			properties : {
				color : '#555',
				top : 5,
				font : {
					fontSize : 22,
					fontFamily : 'Aller Bold'
				},
				left : 0,
				width : Ti.UI.FILL,
			}

		}, {
			type : 'Ti.UI.Label',
			bindId : 'description',
			properties : {
				left : 0,
				top : 0,
				height : Ti.UI.SIZE,
				touchEnabled : false,
				font : {
					fontSize : 16,
					fontFamily : 'Aller'
				},
				color : '#555'
			}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'lastbuilddate',
			properties : {
				left : 0,
				touchEnabled : false,
				top : 5,
				color : '#777',
				font : {
					fontSize : 14,
					fontFamily : 'Aller'
				},
			}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'total',
			properties : {
				left : 0,
				touchEnabled : false,
				top : 2,
				color : '#777',
				font : {
					fontSize : 14,
					fontFamily : 'Aller'
				},
			}
		}]
	}]
};

exports.search = {
	properties : {
		height : Ti.UI.SIZE,
		backgroundColor : 'white',
	},
	childTemplates : [{
		type : 'Ti.UI.ImageView',
		bindId : 'image',
		properties : {
			left : 0,
			touchEnabled : false,
			top : 10,
			width : 70,
			height : 70
		}
	}, {
		type : 'Ti.UI.ImageView',
		bindId : 'fav',
		properties : {
			opacity : 0.5,
			left : 5,
			top : 32,
			visible : false,
			bottom : 5,
			bubbleParent : true,
			image : '/images/favadd.png',
			width : 30,
			height : 30
		}
	}, {
		type : 'Ti.UI.ImageView',
		bindId : 'share',
		properties : {
			opacity : 0.5,
			left : 35,
			top : 35,
			visible : false,
			bottom : 5,
			bubbleParent : true,
			image : '/images/share.png',
			width : 27,
			height : 27
		}
	}, {
		type : 'Ti.UI.View',
		bindId : 'playtrigger',
		properties : {
			width : Ti.UI.FILL,
			layout : 'vertical',
			left : 85,
			height : Ti.UI.SIZE,
			top : 0,
			right : 15,
			bottom : 10
		},
		childTemplates : [{
			type : 'Ti.UI.Label',
			bindId : 'title',
			properties : {
				left : 0,
				top : 5,
				height : Ti.UI.SIZE,
				touchEnabled : false,
				font : {
					fontSize : 20,
					fontFamily : 'Aller Bold'
				},
				color : '#333'
			}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'author',
			properties : {
				left : 0,
				top : 5,
				height : Ti.UI.SIZE,
				touchEnabled : false,
				font : {
					fontSize : 14,
					fontFamily : 'Aller'
				},
				color : '#333'
			}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'duration',
			properties : {
				left : 0,
				top : 0,
				height : Ti.UI.SIZE,
				touchEnabled : false,
				font : {
					fontSize : 14,
					fontFamily : 'Aller'
				},
				color : '#333'
			}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'pubdate',
			height : Ti.UI.SIZE,
			properties : {
				left : 0,
				top : 0,
				height : Ti.UI.SIZE,
				touchEnabled : false,
				font : {
					fontSize : 14,
					fontFamily : 'Aller'
				},
				color : '#333'
			}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'sendung',
			properties : {
				left : 0,
				top : 5,
				height : Ti.UI.SIZE,
				touchEnabled : false,
				font : {
					fontSize : 18,
					fontFamily : 'Aller Bold'
				},
				color : '#333'
			}
		}]
	}]
};

exports.recents = {
	properties : {
		height : Ti.UI.SIZE,
		backgroundColor : 'white',
	},
	childTemplates : [{
		type : 'Ti.UI.ImageView',
		bindId : 'image',
		properties : {
			left : 0,
			touchEnabled : false,
			top : 0,
			width : 70,
			height : 70
		}
	}, {
		type : 'Ti.UI.View',
		bindId : 'playtrigger',
		properties : {
			width : Ti.UI.FILL,
			layout : 'vertical',
			left : 85,
			top : 0,
			right : 15,
			bottom : 10
		},
		childTemplates : [{
			type : 'Ti.UI.Label',
			bindId : 'title',
			properties : {
				left : 0,
				top : 5,
				height : Ti.UI.SIZE,
				touchEnabled : false,
				font : {
					fontSize : 20,
					fontFamily : 'Aller Bold'
				},
				color : '#333'
			}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'author',
			properties : {
				left : 0,
				top : 10,
				height : Ti.UI.SIZE,
				touchEnabled : false,
				font : {
					fontSize : 12,
					fontFamily : 'Aller'
				},
				color : '#333'
			}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'duration',
			properties : {
				left : 0,
				top : 0,
				height : Ti.UI.SIZE,
				touchEnabled : false,
				font : {
					fontSize : 12,
					fontFamily : 'Aller'
				},
				color : '#333'
			}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'pubdate',
			properties : {
				left : 0,
				top : 0,
				height : Ti.UI.SIZE,
				touchEnabled : false,
				font : {
					fontSize : 12,
					fontFamily : 'Aller'
				},
				color : '#333'
			}
		},  {
			type : 'Ti.UI.Label',
			bindId : 'lastaccess',
			properties : {
				left : 0,
				top : 0,
				height : Ti.UI.SIZE,
				touchEnabled : false,
				font : {
					fontSize : 12,
					fontFamily : 'Aller'
				},
				color : '#333'
			}
		},  {
			type : 'Ti.UI.Label',
			bindId : 'progress',
			properties : {
				left : 0,
				top : 0,
				height : Ti.UI.SIZE,
				touchEnabled : false,
				font : {
					fontSize : 12,
					fontFamily : 'Aller'
				},
				color : '#333'
			}
		},{
			type : 'Ti.UI.Label',
			bindId : 'sendung',
			properties : {
				left : 0,
				top : 5,
				height : Ti.UI.SIZE,
				touchEnabled : false,
				font : {
					fontSize : 16,
					fontFamily : 'Aller Bold'
				},
				color : '#555'
			}
		}]
	}]
};

exports.nova = {
    properties : {
        height : Ti.UI.SIZE
    },
    childTemplates : [{
        type : 'Ti.UI.View',
        bindId : "button",
        properties : {
            top : 0,
            right : 0,
            borderWidth : 1,
            borderColor : "orange",
            height : 50,
            width : 100,
            backgroundColor : '#8801953C',
            touchEnabled : true
        }
    }, {
        type : 'Ti.UI.ImageView',
        bindId : 'image',
        properties : {
            touchEnabled : false,
            top : 0,
            width : Ti.UI.FILL,
            height : 'auto',
        }
    }, {
        type : 'Ti.UI.ImageView',
        bindId : 'share',
        properties : {
            touchEnabled : true,
            top : 0,
            bindId : 'share',
            left : 0,
            image : "/images/share_drw.png",
            width : 50,
            height : 71,
            opacity:0.6
        }
    }, {
        type : 'Ti.UI.Label',
        bindId : 'play',
        properties : {
            width : Ti.UI.SIZE,
            bindId : 'play',
            height : Ti.UI.SIZE,
            color : require("model/stations").drw.color,
            touchEnabled : false,
            opacity : 0.5,
            text : "▶︎",
            font : {
                fontSize : 64
            }
        }
    }, {
        type : 'Ti.UI.View',
        bindId : "strip",
        properties : {
            bottom : 0,
            right : 0,
            touchEnabled : true,
            height : Ti.UI.SIZE,
            backgroundColor : '#8801953C'
        },
        childTemplates : [{
            type : 'Ti.UI.Label',
            bindId : 'title',
            properties : {
                left : 10,
                bottom : 5,
                textAlign : "left",
                color : '#fff',
                touchEnabled : false,
                right : 5,
                 height : Ti.UI.SIZE,
                font : {
                    fontSize : 22,
                    fontFamily : 'ScalaSansBold'
                }
            }

        }]
    }, {
        type : 'Ti.UI.Label',
        bindId : 'sendung',
        properties : {
            right : 0,
            top : 0,
            color : '#dfff',
            touchEnabled : false,
            backgroundColor : "#000",
            right : 0,
            font : {
                fontSize : 18,
                fontFamily : 'ScalaSans'
            }
        }
    }]
};

exports.novathema = {
    properties : {
        height : Ti.UI.SIZE,
    },
    childTemplates : [{
        type : 'Ti.UI.View',
        bindId : "button",
        bubbleParent : false,
        properties : {
            top : 0,
            right : 0,
            height : 150,
            width : 200,
            backgroundColor : '#8801953C',
            touchEnabled : true
        }
    }, {
        type : 'Ti.UI.ImageView',
        bindId : 'image',
        properties : {
            touchEnabled : false,
            top : 0,
            width : Ti.UI.FILL,
            height : 'auto',
        }
    }, {
        type : 'Ti.UI.View',
        bindId : "strip",
        properties : {
            bottom : 0,
            right : 0,
            height : Ti.UI.SIZE,
            width : Ti.UI.FILL,
            backgroundColor : '#8801953C',
            touchEnabled : false
        },
        childTemplates : [{
            type : 'Ti.UI.Label',
            bindId : 'title',
            properties : {
                left : 10,
                bottom : 5,
                textAlign : "left",
                color : '#fff',
                 height : Ti.UI.SIZE,
                touchEnabled : false,
                right : 5,
                font : {
                    fontSize : 22,
                    fontFamily : 'ScalaSansBold'
                }
            }

        }]
    }, {
        type : 'Ti.UI.Label',
        bindId : 'sendung',
        properties : {
            height : 0,
            touchEnabled : false,
        }
    }]
};
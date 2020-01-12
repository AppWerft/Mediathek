module.exports = function(cb) {
	const $ = Ti.UI.createView({
		width : 64,
		bottom : 26,
		right : 26,
		touchFeedback : true,
		touchFeedbackColor : "#808080",
		elevation : 10,
		height :64,
		borderRadius : 32,
		backgroundColor : "#5933AC"
	});
	$.onChange = function(e) {
		if (e.source.value == "") {
			cb.onHide();
			$.animate({
				transform : Ti.UI.create2DMatrix({
					scale : 1
				}),
				duration : 200,
				autoreverse : false
			});
		}
	};
	$.add(Ti.UI.createView({
		width : 20,
		height : 20,
		backgroundImage : '/images/filter.png'
	}));
	$.addEventListener('click', function() {
		$.animate({
			transform : Ti.UI.create2DMatrix({
				scale : 0.9
			}),
			duration : 100,
			autoreverse : true,
			repeat : 0
		});
		cb && cb();
	});
	return $;
};
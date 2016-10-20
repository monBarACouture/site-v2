$(document).foundation();
$(window).on('load', () => {
	console.log('foo');
	for (let applet of (global.applets || [])) {
		applet.run($);
	}
});

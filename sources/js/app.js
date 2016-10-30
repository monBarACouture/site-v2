$(document).foundation();
$(window).on('load', () => {
	for (let applet of (global.applets || [])) {
		applet.run();
	}
});

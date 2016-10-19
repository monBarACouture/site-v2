$(window).on('load', () => {
	$(document).foundation();
	for (let applet of (global.applets || [])) {
		applet.run($);
	}
});

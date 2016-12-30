import core from 'core';

import isNil from 'lodash.isnil';
import over from 'lodash.over';
import template from 'lodash.template';

window.mbac = {
	core,
	lodash: {
		isNil,
		template,
		over
	}
};

$(document).foundation();
$(window).on('load', () => {
	for (let applet of (global.applets || [])) {
		applet.run();
	}
});

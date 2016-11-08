import is_nil from 'lodash.isnil';
import jsonp from 'core/jsonp';

import {random_string} from 'core/util';

const gmap_api_url = 'http://maps.googleapis.com/maps/api/js';

let gmap = null;

export default function(api_key) {
	if (is_nil(gmap)) {
		const callback = `__jsonp_${random_string(8)}`
		gmap = new Promise(resolve => {
			jsonp(
				`${gmap_api_url}?key=${api_key}&callback=${callback}`,
				callback,
				() => resolve(google.maps) // eslint-disable-line no-undef
			);
		});
	}
	return gmap;
}

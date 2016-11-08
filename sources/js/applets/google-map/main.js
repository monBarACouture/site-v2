import load_gmap_api from './gmap';

const gmap_api_key = 'AIzaSyBm7fdJUdMXrRbKJNDSM5Huds2Jjns8kzE';

function init_map(gmap) {
	const map_canvas = $('#map-canvas');
	const center = new gmap.LatLng(50.627557, 3.052719);
	const options = {
		center,
		draggable: true,
		mapTypeControl: false,
		mapTypeId: gmap.MapTypeId.ROADMAP,
		scaleControl: true,
		scrollwheel: false,
		streetViewControl: false,
		zoom: 15
	};

	const map = new gmap.Map(map_canvas.get(0), options);

	return {
		map,
		markers: {
			mbac: new gmap.Marker({
				map,
				position: center,
				title: 'mon Bar à Couture'
			})
		}
	};
}

function run() {
	load_gmap_api(gmap_api_key)
		.then(init_map);
}

global.applets = (global.applets || []).concat({
	name: 'google map',
	run
});

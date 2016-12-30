export function jsonp(url, callback_name, callback) {
	const body = document.getElementsByTagName('body')[0];
	const script = document.createElement('script');

	script.type = 'text/javascript';
	script.src  = url;

	body.appendChild(script);
	window[callback_name] = callback;
}

export default jsonp;

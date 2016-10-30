import is_nil from 'lodash.isnil';
import over from 'lodash.over';
import _template from 'lodash.template';

const mail_regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

/// core.util.check_mail_address(address)
/// Returns true if and only if address is a valid mail address.
///
/// **Parameters:**
/// - `address` a `String`.
///
/// **Return:**
/// - `Boolean`.
export function check_mail_address(address, re = mail_regex) {
	return re.test(address);
}

function ValidationError(reason, message) {
	this.stack = (new Error).stack;
	this.message = message;
	this.reason = reason || {};
}
ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.name = 'ValidationError';

/// core.util.create_validator(...validators)
/// Returns a validate function.
///
/// **Parameters:**
/// - `...validators` some `Function`.
///
/// **Return:**
/// - `Function`.
export function create_validator(...validators) {
	const validator = over(...validators);
	return (data, message = '') => {
		const errors = validator(data).filter(error => !is_nil(error));
		if (errors.length > 0) {
			return new ValidationError(errors.reduce(
				(reason, error) => Object.assign(reason, error),
				{}
			), message);
		}
	};
}

export const template = _template;

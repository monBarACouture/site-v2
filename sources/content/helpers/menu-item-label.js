import is_nil from 'lodash/isNil';
export default ({label, icon}) => is_nil(icon)
	? `${label}`
	: `<i class="fa ${icon}"></i> ${label}`;

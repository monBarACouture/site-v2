import mbac from 'mbac';

const {check_mail_address, create_validator} = mbac.core.util;
const {isNil, template} = mbac.lodash;

const callout_template = template(
`<div class="callout <%= level %>" data-closable>
	<p><%= message %></p>
	<button class="close-button" aria-label="Dismiss <%= level %>" type="button" data-close>
	</button>
</div>`);

function begin_animation($form) {
	$('button > i', $form)
		.removeClass('fa-paper-plane')
		.addClass('fa-spinner fa-pulse');
	return Promise.resolve($form);
}

function end_animation($form) {
	$('button > i', $form)
		.removeClass('fa-spinner fa-pulse')
		.addClass('fa-paper-plane');
	return Promise.resolve($form);
}

function get_form_data($form) {
	try {
		const _gotcha = $('input[name=_gotcha]', $form).val();
		const data = $('.input', $form)
			.map((index, elt) => {
				const value = $('input, textarea', $(elt)).val().trim();
				if (value.length !== 0) {
					return {
						[elt.id]: value
					};
				}
				return {};
			})
			.get()
			.reduce((data, field) => Object.assign(data, field), {
				_format: 'plain',
				_subject: 'mBàC - message sans sujet',
				_gotcha
			});
		return Promise.resolve(data);
	} catch (err) {
		return Promise.reject(err);
	}
}

function validate_name({name = ''}) {
	if (isNil(name) || name.length === 0) {
		return {
			name: 'Veuillez indiquer votre nom'
		};
	}
}

function validate_message({message}) {
	if (isNil(message) || message.length === 0) {
		return {
			message: 'Message non valide'
		}
	}
}

function validate_email({email = ''}) {
	if (isNil(email) || !check_mail_address(email)) {
		return {
			email: 'Adresse mail non valide'
		};
	}
}

const validate = create_validator(
	validate_name,
	validate_email,
	validate_message
);

function validate_form_data(data) {
	const errors = validate(data);

	if (isNil(errors)) {
		return Promise.resolve(data);
	}
	return Promise.reject(errors);
}

function form_data_sender(url) {
	return data => {
		return new Promise((resolve, reject) => {
			$.ajax({
				url,
				method: 'POST',
				data,
				dataType: 'json'
			})
			.done(resolve)
			.fail((jq_XHR, texts_status, err) => reject(err));
		});
	};
}

function clear_out_errors($form) {
	$('.input', $form)
		.removeClass('error')
		.find('.reason')
		.remove();
}

function point_out_errors($form, reason) {
	for (let field of Object.keys(reason)) {
		$(`#${field}`, $form)
			.addClass('error')
			.append(`<span class="reason">${reason[field]}</span>`);
	}
}

function success_handler($form) {
	return () => {
		clear_out_errors($form);
		$('.input', $form).find('input, textarea').val('');
		$('#form-message-wrapper', $form)
			.html(callout_template({
				level: 'success',
				message: 'Votre message a bien été expédié.'
			}))
			.delay(5000)
			.fadeOut();
			return Promise.resolve($form);
	};
}

function error_handler($form) {
	return err => {
		clear_out_errors($form);
		if (err.name === 'ValidationError') {
			point_out_errors($form, err.reason);
		}
		$('#form-message-wrapper', $form)
			.html(callout_template({
				level: 'alert',
				message: 'Quelque chose ne va pas.'
			}));
		return Promise.resolve($form);
	};
}

function submiter($form, url) {
	const send_form_data = form_data_sender(url);
	const handle_success = success_handler($form);
	const handle_failure = error_handler($form);

	return () => {
		begin_animation($form)
			.then(get_form_data)
			.then(validate_form_data)
			.then(send_form_data)
			.then(handle_success)
			.catch(handle_failure)
			.then(end_animation);
	};
}

function run() {
	const $form = $('#contact form');
	const url = $form.attr('action');

	$form.removeAttr('action');
	$('.input', $form)
		.find('input, textarea')
		.on('focus', ev => {
			$(ev.target).parent().addClass('focus');
		})
		.on('blur', ev => {
			$(ev.target).parent().removeClass('focus');
			clear_out_errors($form);
			get_form_data($form)
				.then(validate_form_data)
				.catch(err => {
					if (err.name === 'ValidationError') {
						point_out_errors($form, err.reason);
					}
				});
		});
	$('#submit', $form)
		.attr('type', 'button')
		.on('click', submiter($form, url));
}

global.applets = (global.applets || []).concat({
	name: 'contact form',
	run
});

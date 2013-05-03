$(document).ready(function() {
		if($.browser.opera) {
			$('#addfiles').css('display', 'inline');
			$('#addbtn').css('display', 'none');
		}

		$('#command').focus();
		$('#command').val("hgaudi");
		$('#command').typeahead({
			name: 'commands-predict',
			prefetch: 'data/commands.json',
			template: [
				'<div class="popup">',
				'<span class="cmd">{{command}}</span>',
				' <span class="desc">{{desc}}</span>',
				'</div>'
			].join(''),
			limit: 1,
			engine: Hogan
		});

		$('#addbtn').click(function() {
			$('#addfiles').trigger('click');

		});	

		if($.cookie('hgaudi.token') == null) $('#cookiesNotif').modal('show');
		$(document).on('click', '#proceed', function() {
			$.cookie('hgaudi.token', _.guid(), {expires:7});
			$('#cookiesNotif').modal('hide');
		});
		$(document).on('click', '#abandon', function() {
			$.cookie('hgaudi.token', null, {path:'/'});
			if(typeof window.home == 'function') window.home();
			else window.location.href = 'http://www.google.com';
		});
});
function showLicense() {
	$.ajax({
		url: 'data/license.txt',
	}).done(function(text) {
		$('#licenseText').append(text);
	});
	$('#licenseModal').modal('show');
}
function showCredits() {
	$('#creditsModal').modal('show');
}

$(document).ready(function() {	
		$("#command").focus();
		$("#command").val("hgaudi -f data/build.json");
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

		$("#addbtn").click(function() {
			$('#addfiles').trigger('click');
		});	

		if($.browser.mozilla) {
			$("#enterCommand").css("margin-top", "11px");
			$("#enterCommand").css("height", "50px");
		}

		if($.cookie('hgaudi.token') == null) $('#cookiesNotif').modal('show');
		$(document).on('click', '#proceed', function() {
			$.cookie('hgaudi.token', _.guid(), { expires: 7 });
			$('#cookiesNotif').modal('hide');
		});
		$(document).on('click', '#abandon', function() {
			$.cookie('hgaudi.token', null, {path: '/'});
			window.location.href = 'http://www.google.com';
		});
		
		/*$.ajax({
			url: "LICENSE",
		}).done(function(text) {
			text = text.replace(/\n/g, "<br/>");
			$("#license-text").append(text);
		});*/
		showCredits();
});
function showCredits() {
	$('#creditsModal').modal('show');
}

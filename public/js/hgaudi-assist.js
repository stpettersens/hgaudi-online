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

		/*$.ajax({
			url: "LICENSE",
		}).done(function(text) {
			text = text.replace(/\n/g, "<br/>");
			$("#license-text").append(text);
		});*/
});

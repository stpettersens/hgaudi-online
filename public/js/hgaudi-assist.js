$(document).ready(function() {	
		$("#command").focus();
		$("#command").val("hgaudi -f data/build.json");
		$('#command').typeahead({
			name: 'commands-predict',
			prefetch: 'data/commands.json',
			template: [
				'<div class="popup">',
				'<span class="cmd">{{command}}</span>',
				'<span class="desc"> {{desc}}</span>',
				'</div>'
			].join(''),
			limit: 1,
			engine: Hogan
		});

		$("#ulbtn").click(function() {
			$('#ulfiles').trigger('click');
		});	

		/*$.ajax({
			url: "LICENSE",
		}).done(function(text) {
			text = text.replace(/\n/g, "<br/>");
			$("#license-text").append(text);
		});*/
});

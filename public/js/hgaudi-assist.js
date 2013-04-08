$(document).ready(function() {	
		$("#command").focus();
		$("#command").val("hgaudi -f data/build.json");
		/*$('#command').typeahead({
			name: 'commands-predict',
			prefetch: 'data/commands.json',
			template: [
				'<span class="cmd">{{command}}</span>',
				'<span class="desc"> {{desc}}</span>'
			].join(''),
			limit: 1,
			engine: Hogan
		});*/
		/*$.ajax({
			url: "LICENSE",
		}).done(function(text) {
			text = text.replace(/\n/g, "<br/>");
			$("#license-text").append(text);
		});*/
});

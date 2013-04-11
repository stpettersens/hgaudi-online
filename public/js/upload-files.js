/*
Allow upload of files for use by online hackedGaudi.
Based on code from http://www.html5rocks.com/en/tutorials/file/dndfiles/
*/

function handleFileSelect(evt) {
	var files = evt.target.files; // FileList object; files is a FileList of File objects.
	var output = [];
	$('#i-file-list').empty();
	for(var i = 0, f; f = files[i];  i++) {	
		var reader = new FileReader();
		reader.onload = function(e) {
			var contents = e.target.result;
			console.log(contents);
		};	
		reader.readAsText(f);
		$('#i-file-list').append('<p>' + escape(f.name) + '</p>');
	}
}	
$(document).ready(function() {
	// Check for File APIs support.
	if(window.File == null || window.FileReader == null || 
	window.FileList == null | window.Blob == null) {
		alert("The File APIs are not fully supported in this browser.");
	}
	document.getElementById("ulfiles").addEventListener("change", handleFileSelect, false);
});
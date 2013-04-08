/*
Allow upload of files for use by online hackedGaudi.
Based on code from http://www.html5rocks.com/en/tutorials/file/dndfiles/
*/

function handleFileSelect(evt) {
	var files = evt.target.files; // FileList object; files is a FileList of File objects.
	var output = [];
	for(var i = 0, f; f = files[i];  i++) {
		alert(escape(f.name));	
	}
}	
$(document).ready(function() {
	document.getElementById("ulfiles").addEventListener("change", handleFileSelect, false);
});

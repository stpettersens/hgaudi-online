function handleFileSelect(evt) {
	var socket = io.connect('http://localhost');
	var files = evt.target.files;
	var output = [];
	$('#i-file-list').empty(); // Change so only clear when nothing has already been added!
	for(var i = 0, f; f = files[i];  i++) {	
		var reader = new FileReader();
		reader.onload = function(e, files) {
			var contents = e.target.result;
			socket.emit('setContents', {contents:contents});
		};	
		reader.readAsText(f);
		socket.emit('setFilename', {filename:escape(f.name)});
		socket.emit('setTokenId', {tokenId:$.cookie('hgaudi.token')});
		$('#i-file-list').append('<p>' + escape(f.name) + '</p>');
		$('#delbtn').removeAttr('disabled');
	}
}	
$(document).ready(function() {
	// Check for File APIs support.
	if(window.File == null || window.FileReader == null || 
	window.FileList == null | window.Blob == null) {
		alert('The File APIs are not fully supported in this browser.');
	}
	document.getElementById('addfiles').addEventListener('change', handleFileSelect, false);
});

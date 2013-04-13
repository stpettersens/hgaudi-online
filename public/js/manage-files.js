var g_files_added, socket, cookie = null;
function loadFiles() {
	socket.emit('pullFromDb', {tokenId:cookie});
}
function handleFileSelect(evt) {
	var files = evt.target.files;
	var output = [];
	if(!g_files_added) {
		$('#i-file-list').empty();
		g_files_added = true;
	}
	for(var i = 0, f; f = files[i];  i++) {	
		var reader = new FileReader();
		reader.onload = function(e, files) {
			var contents = e.target.result;
			socket.emit('setContents', {contents:contents});
			socket.emit('pushToDb', {});
		};	
		reader.readAsText(f);
		socket.emit('setFilename', {filename:escape(f.name)});
		socket.emit('setTokenId', {tokenId:cookie});
		$('#i-file-list').append('<p>' + escape(f.name) + '</p>');
		$('#delbtn').removeAttr('disabled');
	}
}	
$(document).ready(function() {
	g_files_added = false;
	socket = io.connect('http://localhost');
	cookie = $.cookie('hgaudi.token');
	if(window.File == null || window.FileReader == null || window.FileList == null | window.Blob == null) {
		alert('The File APIs are not fully supported in this browser.');
	}
	loadFiles();
	document.getElementById('addfiles').addEventListener('change', handleFileSelect, false);
});

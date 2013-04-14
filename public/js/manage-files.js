var g_files_added, socket, cookie, database = null;
var file_contents = [];
function loadInputFiles() {
	socket.emit('pullInputFromDb', {tokenId:cookie});
}
function loadOutputFiles() {
	socket.emit('pullOutputFromDb', {tokenId:cookie});
}
function viewFile(key, filename) {
	$('#title-filename').empty();
	$('#title-filename').text(filename);
	$('.prettyprint').text(file_contents[key]);
	$('#viewFileModal').modal('show');
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
		reader.onload = function(e) {
			var contents = e.target.result;	
			socket.emit('setTokenId', {tokenId:cookie});
			socket.emit('setContents', {contents:contents});
			socket.emit('pushInputToDb', {});
		};	
		reader.readAsText(f);
		$('#i-file-list').append('<p><a href="javascript:viewFile(' + i + ',\'' + f.name + '\');">' 
		+ escape(f.name) + '</a></p>');
		socket.emit('setFilename', {filename:escape(f.name)});
		$('#delbtn').removeAttr('disabled');
	}
}
$(document).ready(function() {
	g_files_added = false;
	socket = io.connect('http://localhost');
	cookie = $.cookie('hgaudi.token');
	if(window.File == null || window.FileReader == null || 
	window.FileList == null | window.Blob == null) {
		alert('The File APIs are not fully supported in this browser.');
	}
	loadInputFiles();
	socket.on('populateInputList', function(data) {
		console.log(data.files);
		if(data.files.length > 0) {
			$('#i-file-list').empty();
			for(var i = 0; i < data.files.length; i++) {
				$('#i-file-list').append('<p><a href="javascript:viewFile(' + i + ',\'' 
				+ data.files[i].filename + '\');">' + escape(data.files[i].filename) + '</a></p>');
				g_files_added = true;
				file_contents.push(data.files[i].contents);
			}
			$('#delbtn').removeAttr('disabled');
		}
	});
	document.getElementById('addfiles')
	.addEventListener('change', handleFileSelect, false);
	$('body').on('shown', '#viewFileModal', function(event) {
		console.log("pp here!");
		prettyPrint();
	});
});

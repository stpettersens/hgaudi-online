var g_files_added, socket, cookie, database, to_delete = null;
var file_contents = [];
function loadInputFiles() {
	socket.emit('pullInputFromDb', {tokenId:cookie});
}
function loadOutputFiles() {
	socket.emit('pullOutputFromDb', {tokenId:cookie});
}
function removeInputFile(filename) {
	var ans = confirm('Are you sure you want to delete this file?');
	if(ans) {
		socket.emit('removeInputFromDb', {filename:filename});
		loadInputFiles();
	}
}
function viewFile(key, filename) {
	$('#title-filename').text(filename);
	$('#fileblock').html('<pre class="prettyprint">' + file_contents[key] + '</pre>');
	$('#viewFileModal').modal('show');
}
function handleFileSelect(event) {
	var unique = true;
	var files = event.target.files;
	var output = [];
	if(!g_files_added) {
		$('#i-file-list').empty();
		g_files_added = true;
	}
	for(var i = 0, f; f = files[i];  i++) {	
		var reader = new FileReader();
		reader.onload = function(e) {
			var contents = e.target.result;	
			file_contents.push(contents);
			socket.emit('setTokenId', {tokenId:cookie});
			socket.emit('setContents', {contents:contents});
			socket.emit('pushInputToDb', {});
			loadInputFiles();
		};	
		reader.readAsText(f);
		socket.emit('setFilename', {filename:escape(f.name)});
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
		file_contents = [];
		console.log(data.files);
		if(data.files.length > 0) {
			$('#i-file-list').empty();
			for(var i = 0; i < data.files.length; i++) {
				$('#i-file-list').append('<p><input type="checkbox" class="fcb" id="fcb' + i
				+ '" value="' + data.files[i].filename + '"/> <a id="fhl' + i + '" href="javascript:viewFile(' + i + ',\'' 
				+ data.files[i].filename + '\');">' + escape(data.files[i].filename) + '</a></p>');
				g_files_added = true;
				file_contents.push(data.files[i].contents);
			}
		}
	});
	$(document).on('change', '#addfiles', function(event) {
		handleFileSelect(event);
	});
	$(document).on('shown', '#viewFileModal', function(event) {
		console.log("pretty print!");
		prettyPrint();
	});
	$(document).click(function() {
		$(document).on('change', '.fcb', function(event) {
			if($(this).attr('checked')) {
				$('#delbtn').removeAttr('disabled');
				to_delete = $(this).attr('value');
				console.log(to_delete);
			}
			else {
				$('#delbtn').attr('disabled', 'disabled');
				to_delete = null;
			}
		});
	});
	$(document).on('click', '#delbtn', function(event) {
		removeInputFile(to_delete);
	});
});

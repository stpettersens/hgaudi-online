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
		socket.emit('removeInputFromDb', {tokenId:cookie, filename:filename});
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
		var ext_re = new RegExp(/\.(\w+$)/gi);
		var ext = ext_re.exec(f.name);
		if(ext != null) ext = ext[1].toLowerCase();
		socket.emit('setFileType', {filetype:escape(ext)});
	}
}
$(document).ready(function() {
	g_files_added = false;
	socket = io.connect('http://localhost');
	cookie = $.cookie('hgaudi.token');
	if(window.File == null || window.FileReader == null || 
	window.FileList == null | window.Blob == null) {
		$('#fileapi-error').css('display', 'block');
		$('#fileapi-error').alert();
	}
	loadInputFiles();
	loadOutputFiles();
	socket.on('populateInputList', function(data) {
		$('#i-file-list').empty();
		file_contents = [];
		console.log(data.files);
		if(data.files.length > 0) {
			$.each(data.files, function(i, item) {
				var br  = $('<br/>');
				var input = $('<input/>', {
					type: 'checkbox',
					class: 'fcb',
					id: 'ifcb' + i,
					value: item.filename
				});
				var a = $('<a/>', {
					id: 'ifhl' + i,
					href: 'javascript:viewFile(' + i + ', \'' + item.filename + '\')',
					text: ' ' + escape(item.filename)
				});
				$('#i-file-list').append(input, a, br);
				g_files_added = true;
				file_contents.push(item.contents);
			});
		}
		else $('#i-file-list').append('<strong>No files uploaded.</strong>');
	});
	socket.on('populateOutputList', function(data) {
		$('#o-file-list').empty();
		console.log(data.files);
		if(data.files.length > 0) {
			$.each(data.files, function(i, item) {
				var br = $('<br/>');
				var input = $('<input/>', {
					type: 'checkbox',
					class: 'fcb',
					id: 'ofcb' + i,
					value: item.filename
				});
				var a = $('<a/>', {
					id: 'ofhl' + i,
					href: 'javascript:downloadFile(' + i + ', \'' + item.filename + '\')',
					text: ' ' + escape(item.filename)
				});
				$('#o-file-list').append(input, a, br);
			});
		}
		else $('#o-file-list').append('<strong>No files produced.</strong>');
	});
	$(document).on('change', '#addfiles', function(event) {
		handleFileSelect(event);
	});
	$(document).on('shown', '#viewFileModal', function(event) {
		prettyPrint();
	});
	$(document).click(function() {
		$(document).on('change', '.fcb', function(event) {
			if($(this).attr('checked')) {
				$('#delbtn').removeAttr('disabled');
				to_delete = $(this).attr('value');
			}
			else {
				$('#delbtn').attr('disabled', 'disabled');
				to_delete = null;
			}
		});
	});
	$(document).on('click', '#complete', function(event) {
		console.log("Load output files...");
		loadOutputFiles();
	});
	$(document).on('click', '#delbtn', function(event) {
		removeInputFile(to_delete);
	});
});

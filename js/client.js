var socket = io.connect( 'http://192.168.1.31:8080' );

$(function() {
    socket.emit('load');
});

$( "#message-form" ).submit( function() {
	var name = $( "#name" ).val();
	var message = $( "#message" ).val();
	socket.emit( 'message', { name: name, message: message } );
	return false;
});

socket.on( 'message', function( data ) {
	var old_messages = $( "#messages" ).html();
	var message = '<li> <strong>' + data.name + '</strong> : ' + data.message + '</li>';
	var content = message + old_messages;
	$( "#messages" ).html( content );
});

socket.on( 'load', function( data ) {
	var messages = '';
	$.each(data, function(index, value) {
	    messages = messages + '<li> <strong>' + value.name + '</strong> : ' + value.message + '</li>';
	});
	$( "#messages" ).html( messages );
});
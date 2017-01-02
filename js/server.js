var socket = require( 'socket.io' );
var express = require( 'express' );
var http = require( 'http' );
var mysql = require( 'mysql' );

var app = express();
var server = http.createServer( app );

var io = socket.listen( server );


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'chat_app'
});

connection.connect(function(err){
	if(!err) {
	  console.log("Database is connected ... nn");
	} else {
	  console.log("Error connecting database ... nn");
	}
});

io.sockets.on( 'connection', function( client ) {
	console.log( "New client !" );
	client.on( 'load', function() {
		var messages = connection.query('select * from message order by id DESC', function(err,rows){
			if(err) throw err;
			io.sockets.emit( 'load', rows );
		});
	});

	client.on( 'message', function( data ) {
		console.log( 'Message received ' + data.name + ":" + data.message );

		//client.broadcast.emit( 'message', { name: data.name, message: data.message } );
		io.sockets.emit( 'message', { name: data.name, message: data.message } );

		var post  = {name: data.name, message: data.message};
	    connection.query('INSERT INTO message SET ?', post, function(err, rows, fields) {
      		console.log(rows);
	    });
	});
});
server.listen( 8080 );
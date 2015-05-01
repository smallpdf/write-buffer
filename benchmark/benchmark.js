var fs = require('fs');
var net = require('net');

var writebuffer = require('../');

createStream(function (output) {
  var buffersize = parseInt(process.env.BUFFER_SIZE, 10);

  var s;

  switch(process.env.BUFFER) {
    case 'none':
      s = output;
      break;
    
    case 'buffer':
      s = writebuffer.buffer(output, buffersize);
      break;

    case 'cork':
      s = writebuffer.cork(output, buffersize);
      break;

    case 'auto':
      s = writebuffer(output, buffersize);
      break;
  }
  

  var accesslog = '127.0.0.1 - - [24/Dec/2015:20:01:30 -0100] "GET /great-things HTTP/1.1" 200 3395\n';
  var data = new Buffer(accesslog, 'utf-8');
  for(var i = 0; i < 1000000; i++) {
    s.write(data);
  }
  s.end();  
})


function createStream(callback) {
  var file = process.env.FILE;
  if (file !== 'tcp') {
    var stream = fs.createWriteStream(file);
    stream.on('open', callback.bind(null, stream));
    return;
  }
  
  var server = net.createServer(function (socket) {
    socket.on('close', function () {
      server.close();
    });
    socket.on('data', function () {});
    // socket.pipe(process.stdout);
  }).listen(3000);

  var socket = net.connect({port: 3000});
  socket.on('connect', function () {
    callback(socket);
  });  
}

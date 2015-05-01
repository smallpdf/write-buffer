var through = require('through');

module.exports = function (stream, size) {
  if (stream.cork && stream._writev)
    return cork(stream, size);
  return buffer(stream, size);
};

module.exports.cork   = cork;
module.exports.buffer = buffer;


/**
 * Buffer in memory
 * for streams without writev
 */
function buffer(output, size) {
  var buf   = null;
  var input = through(write, end);

  output.on('finish', input.emit.bind(input, 'finish'));

  function write(data, encoding) {
    if (!Buffer.isBuffer(data)) {
      data = new Buffer(data, encoding);
    }
    buf = buf ? Buffer.concat([buf, data]) : data;
    if (buf.length > size) {
      output.write(buf);
      buf = null;
    }
  }

  function end() {
    if (buf) output.write(buf);
    output.end();
  }

  return input;
}

/**
 * Buffer with cork()
 * for streams with writev support
 */
function cork(output, size) {
  var acc = 0;
  var input = through(write, end);

  output.cork();
  output.on('finish', input.emit.bind(input, 'finish'));

  function write(data, encoding, callback) {
    acc += data.length;
    if (acc > size) {
      // do uncorked write
      output.uncork();
      output.write(data, encoding, callback);
      // cork again
      acc = 0;
      output.cork();
    } else {
      // corked write
      output.write(data, encoding, callback);
    }
  }

  function end(data, encoding, callback) {
    output.end(data, encoding, callback);
  }
  return input;
}

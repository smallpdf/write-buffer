# write-buffer

Increases write throughput for small writes on node.js streams.

- Buffers in memory for streams without writev support (like fs)
- Uses cork when writev is supported (like tcp)

This is useful for doing stuff like writing access logs line by line to disk.


```JS

var fs = require('fs');
var writebuffer = require('write-buffer');

var stream = writebuffer(fs.createWriteStream('bla'), 1024);
for (var x = 0; x < 1000; x++) {
  stream.write('small');
}
stream.end();

```

# Benchmark

I included a small benchmark script. It writes one million access log like strings in single writes
```
127.0.0.1 - - [24/Dec/2015:20:01:30 -0100] "GET /great-things HTTP/1.1" 200 3395
```

I got following results on my laptop.


## FS
```

without buffer:

real  0m11.562s
user  0m5.224s
sys   0m7.403s

with buffer:

real  0m2.529s
user  0m1.472s
sys	  0m1.075s

```

# TCP
```

without buffering:

real  0m1.201s
user  0m0.935s
sys	  0m0.273s

with buffer (cork):

real  0m1.046s
user  0m0.797s
sys	  0m0.265s

```

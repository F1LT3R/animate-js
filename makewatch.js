
  var fs = require('fs');
  var sys = require('sys');
  var exec = require('child_process').exec;

  function puts(error, stdout, stderr) {
    sys.puts(stdout);
  }

  fs.watchFile('./src', function (curr, prev) {
    console.log('\nBuilding animate.js...');
    exec("make build", puts);
  });

  fs.watchFile('./target', function (curr, prev) {

    // exec("sublime target/animate.min.js", puts);

    fs.stat('./src/animate.js', function (err, stats) {
      console.log('     uncompressed : '+(stats.size/1024).toFixed(2)+' Kb');
      
      fs.stat('./target/animate.min.js', function (err, stats) {
        console.log('         minified : '+(stats.size/1024).toFixed(2)+' Kb');

        fs.stat('./target/animate.min.gz.js', function (err, stats) {
          console.log('           gziped : '+(stats.size/1024).toFixed(2)+' Kb');
        });

      });
      
    });

    
    
  });

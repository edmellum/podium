var http = require('http');

var haibu = require('haibu');
var proxy = require('http-proxy');

var HOST = 'localhost';

haibu.drone.start({
  env: 'development',
  port: 9001,
  host: HOST
}, function(err, server) {
  haibu.utils.showWelcome('api-server', 'localhost', 9001);

  haibu.on('drone:start', function(type, data) {
    console.log('Deployed', data.pkg.name, 'to drone', data.process.uid);
  });
});

proxy.createServer(function(req, res, proxy) {
  var apps = haibu.running.server.drone.apps;

  // Naive subdomain parsing.
  var host = req.headers.host;
  var subIndex = host.indexOf('.');
  var subdomain = host.slice(0, subIndex);
  
  if(subIndex == -1) {
    proxy.proxyRequest(req, res, {
      host: HOST,
      port: 9001
    });
    return;
  }
  
  console.log('User requesting:', subdomain);

  var app = apps[subdomain];

  if(!app) {
    console.log('No app:', subdomain);
    res.writeHead(404);
    return res.end();
  }
  
  // Basic load balancing by routing the request to a random drone.
  var drones = app.drones;
  var drone = drones[Object.keys(drones)[Math.floor(Math.random() * drones.length)]];

  console.log('Proxying to:', subdomain, '| Drone:', drone.data.uid);
  
  proxy.proxyRequest(req, res, {
    host: drone.socket.host,
    port: drone.socket.port
  });
}).listen(9000);

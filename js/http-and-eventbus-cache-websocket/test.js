shared_data = require('shared_data');
console = require('console');

map = shared_data.getMap('testmap');

tstamp = new Date();
console.log('putting'+tstamp.getTime());
map.put(tstamp.getTime(), 'hello');

console.log(map.size());

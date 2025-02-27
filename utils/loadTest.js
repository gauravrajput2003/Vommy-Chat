const autocannon = require('autocannon');

const test = autocannon({
    url: 'http://localhost:5000/api/referrals/stats',
    connections: 100,
    duration: 10
});

autocannon.track(test);
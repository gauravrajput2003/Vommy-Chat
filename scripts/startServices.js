const { execSync } = require('child_process');
const path = require('path');

try {
    // Start Redis in WSL
    console.log('Starting Redis server...');
    execSync('wsl sudo service redis-server start');
    
    // Start application
    console.log('Starting application...');
    require('../server.js');
} catch (error) {
    console.error('Service startup failed:', error);
    process.exit(1);
}
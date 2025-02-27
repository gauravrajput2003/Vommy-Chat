const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const restartServer = async () => {
    try {
        // Find process using port 5000
        const { stdout } = await execAsync('netstat -ano | findstr :5000');
        if (stdout) {
            const pid = stdout.split(' ').filter(Boolean).pop();
            await execAsync(`taskkill /F /PID ${pid}`);
            console.log('Previous server process terminated');
        }
    } catch (error) {
        // No process found on port 5000
        console.log('No existing server process found');
    }
};

module.exports = restartServer;
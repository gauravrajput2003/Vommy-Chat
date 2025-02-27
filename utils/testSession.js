const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

const testSessionManagement = async () => {
    try {
        // First register a test user
        const registerData = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'Test@123'
        };

        try {
            await axios.post(`${BASE_URL}/auth/register`, registerData);
            console.log('✓ Test user created');
        } catch (error) {
            // Ignore if user already exists
            console.log('ℹ Using existing test user');
        }

        // Test login
        console.log('\nTesting login...');

        const testData = {
            email: 'test@example.com',
            password: 'password123'
        };

        // Test login and session creation
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, testData, {
            withCredentials: true
        });
        console.log('✓ Login successful');

        // Get token from response
        const token = loginRes.data.token;

        // Test protected route access
        const referralsRes = await axios.get(`${BASE_URL}/referrals`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('✓ Protected route accessed successfully');

        // Test logout
        const logoutRes = await axios.get(`${BASE_URL}/auth/logout`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('✓ Logout successful');

        // Verify session is invalid after logout
        try {
            await axios.get(`${BASE_URL}/referrals`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            if (error.response.status === 401) {
                console.log('✓ Session invalidated after logout');
            }
        }

    } catch (error) {
        console.error('Session test failed:', error.response?.data || error.message);
        process.exit(1);
    }
};

// Run tests if file is executed directly
if (require.main === module) {
    testSessionManagement();
}

module.exports = testSessionManagement;
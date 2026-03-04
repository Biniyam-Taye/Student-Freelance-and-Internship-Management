// script to test approve recruiter
const axios = require('axios');

async function test() {
    try {
        const loginResp = await axios.post('http://localhost:5000/api/users/login', {
            email: "admin@freelaunch.com",
            password: "adminpassword123"
        });
        const token = loginResp.data.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 1. Get all users
        const usersResp = await axios.get('http://localhost:5000/api/admin/users', config);
        let pending = usersResp.data.find(u => u.role === 'recruiter');

        // Let's force it to pending to test the endpoint again
        await axios.put(`http://localhost:5000/api/admin/users/${pending._id}/status`, { status: 'suspended' }, config);

        console.log(`Approving user: ${pending._id}`);
        // 2. Approve
        const approveResp = await axios.put(`http://localhost:5000/api/admin/users/${pending._id}/verify`, {}, config);
        console.log('Approve response FULL DATA:', approveResp.data);

    } catch (e) {
        console.error('Error:', e.response ? e.response.data : e.message);
    }
}
test();

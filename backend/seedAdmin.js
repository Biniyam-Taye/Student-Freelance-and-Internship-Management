const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('MongoDB connected');

    const adminExists = await User.findOne({ email: 'admin@freelaunch.com' });

    if (adminExists) {
        let updated = false;

        if (adminExists.role !== 'admin') {
            adminExists.role = 'admin';
            updated = true;
        }

        if (!adminExists.isVerified) {
            adminExists.isVerified = true;
            updated = true;
        }

        if (adminExists.status !== 'active') {
            adminExists.status = 'active';
            updated = true;
        }

        if (updated) {
            await adminExists.save();
            console.log('Existing admin user normalized (role, verification, status).');
        } else {
            console.log('Admin already exists and is correctly configured.');
        }

        process.exit();
    }

    const adminUser = await User.create({
        name: 'System Admin',
        email: 'admin@freelaunch.com',
        password: 'adminpassword123',
        role: 'admin',
        isVerified: true,
        status: 'active'
    });

    console.log('Admin user created successfully:');
    console.log('Email: admin@freelaunch.com');
    console.log('Password: adminpassword123');
    process.exit();
}).catch((error) => {
    console.error('Error connecting to database:', error);
    process.exit(1);
});

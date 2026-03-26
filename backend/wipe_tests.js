const mongoose = require('mongoose');

async function wipeTestPosts() {
    try {
        await mongoose.connect('mongodb://localhost:27017/freelance');
        
        const db = mongoose.connection;
        console.log("Connected to MongoDB");
        
        // delete all where position is "Backend Engineer Intern"
        const result = await db.collection('opportunities').deleteMany({ position: 'Backend Engineer Intern' });
        console.log(`Deleted ${result.deletedCount} test posts.`);
        
        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

wipeTestPosts();

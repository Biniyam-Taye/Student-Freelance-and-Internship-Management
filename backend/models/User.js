const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Do not return password by default
    },
    role: {
        type: String,
        enum: ['student', 'recruiter', 'admin'],
        default: 'student'
    },
    university: {
        type: String,
        trim: true
    },
    major: {
        type: String,
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    position: {
        type: String,
        trim: true
    },
    skills: {
        type: [String],
        default: []
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot be more than 500 characters']
    },
    isVerified: {
        type: Boolean,
        default: function () {
            // Recruiters need manual verification by admin, students don't 
            return this.role !== 'recruiter';
        }
    },
    status: {
        type: String,
        enum: ['active', 'suspended', 'pending'],
        default: function () {
            return this.role === 'recruiter' ? 'pending' : 'active';
        }
    },
    avatar: {
        type: String,
        default: 'default-avatar.png'
    },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
    website: { type: String, trim: true },
    industries: { type: [String], default: [] },
    companySize: { type: String, trim: true },
}, {
    timestamps: true
});

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function () {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

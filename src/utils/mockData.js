// Mock data for the entire application

export const mockApplications = [
    { id: 1, company: 'TechEthiopia', position: 'Frontend Intern', skills: ['React', 'CSS'], status: 'shortlisted', date: '2026-02-15', stipend: '5,000 ETB', location: 'Addis Ababa', duration: '3 months' },
    { id: 2, company: 'Kifiya Financial', position: 'UI/UX Designer', skills: ['Figma', 'Illustrator'], status: 'pending', date: '2026-02-18', stipend: '6,000 ETB', location: 'Remote', duration: '6 months' },
    { id: 3, company: 'iCog Labs', position: 'Backend Developer', skills: ['Node.js', 'Python'], status: 'accepted', date: '2026-02-10', stipend: '8,000 ETB', location: 'Addis Ababa', duration: '4 months' },
    { id: 4, company: 'Gebeya Inc.', position: 'Data Analyst Intern', skills: ['Excel', 'SQL', 'Python'], status: 'rejected', date: '2026-02-01', stipend: '4,500 ETB', location: 'Hybrid', duration: '2 months' },
    { id: 5, company: 'Apposit', position: 'Mobile Developer', skills: ['Flutter', 'Dart'], status: 'pending', date: '2026-02-25', stipend: '7,000 ETB', location: 'Addis Ababa', duration: '5 months' },
    { id: 6, company: 'EthioTelecom', position: 'Network Intern', skills: ['Cisco', 'Networking'], status: 'shortlisted', date: '2026-02-20', stipend: '5,500 ETB', location: 'Addis Ababa', duration: '3 months' },
];

export const mockTasks = [
    { id: 1, title: 'Build a responsive landing page', company: 'TechEthiopia', deadline: '2026-03-10', priority: 'high', status: 'in_progress', description: 'Create a fully responsive landing page using React and Tailwind CSS.' },
    { id: 2, title: 'Design mobile app wireframes', company: 'Kifiya Financial', deadline: '2026-03-15', priority: 'medium', status: 'pending', description: 'Wireframe 5 screens for the mobile banking app using Figma.' },
    { id: 3, title: 'Write API documentation', company: 'iCog Labs', deadline: '2026-03-05', priority: 'low', status: 'completed', description: 'Document all REST endpoints using Swagger.' },
    { id: 4, title: 'Optimize database queries', company: 'Apposit', deadline: '2026-03-08', priority: 'high', status: 'in_progress', description: 'Identify and optimize slow SQL queries in the production database.' },
];

export const mockOpportunities = [
    { id: 1, company: 'TechEthiopia', logo: null, position: 'Frontend React Developer', type: 'internship', skills: ['React', 'TypeScript', 'Tailwind'], stipend: '6,000 ETB/mo', location: 'Addis Ababa', duration: '3 months', deadline: '2026-03-20', applicants: 24, description: 'Join our frontend team building next-gen fintech solutions.', posted: '2 days ago' },
    { id: 2, company: 'Kifiya Financial', logo: null, position: 'UI/UX Designer', type: 'freelance', skills: ['Figma', 'Adobe XD', 'Prototyping'], stipend: '8,000 ETB/mo', location: 'Remote', duration: '2 months', deadline: '2026-03-25', applicants: 15, description: 'Design user interfaces for our mobile banking application.', posted: '1 day ago' },
    { id: 3, company: 'iCog Labs', logo: null, position: 'Machine Learning Intern', type: 'internship', skills: ['Python', 'TensorFlow', 'NLP'], stipend: '5,000 ETB/mo', location: 'Addis Ababa', duration: '4 months', deadline: '2026-04-01', applicants: 41, description: 'Work on AI projects including NLP and computer vision.', posted: '3 days ago' },
    { id: 4, company: 'Gebeya Inc.', logo: null, position: 'Full Stack Developer', type: 'freelance', skills: ['Node.js', 'React', 'MongoDB'], stipend: '10,000 ETB/mo', location: 'Hybrid', duration: '6 months', deadline: '2026-03-30', applicants: 8, description: 'Build and maintain our talent marketplace platform.', posted: '5 days ago' },
    { id: 5, company: 'Apposit', logo: null, position: 'Mobile App Developer', type: 'internship', skills: ['Flutter', 'Firebase', 'Dart'], stipend: '7,000 ETB/mo', location: 'Addis Ababa', duration: '5 months', deadline: '2026-04-10', applicants: 19, description: 'Develop cross-platform mobile applications.', posted: '1 week ago' },
    { id: 6, company: 'EthioTelecom', logo: null, position: 'Network Engineering Intern', type: 'internship', skills: ['Cisco', 'TCP/IP', 'Linux'], stipend: '5,500 ETB/mo', location: 'Addis Ababa', duration: '3 months', deadline: '2026-03-28', applicants: 32, description: 'Support network infrastructure and troubleshooting.', posted: '4 days ago' },
];

export const mockUsers = [
    { id: 1, name: 'Abebe Girma', email: 'abebe@student.com', role: 'student', status: 'active', joined: '2026-01-15', university: 'AAU', skills: ['React', 'Python'] },
    { id: 2, name: 'Sara Tadesse', email: 'sara@techethiopia.com', role: 'recruiter', status: 'active', joined: '2026-01-10', company: 'TechEthiopia', verified: true },
    { id: 3, name: 'Yonas Bekele', email: 'yonas@kifiya.com', role: 'recruiter', status: 'pending', joined: '2026-02-20', company: 'Kifiya Financial', verified: false },
    { id: 4, name: 'Hana Mekonnen', email: 'hana@student.com', role: 'student', status: 'active', joined: '2026-01-25', university: 'Jimma University', skills: ['Python', 'Data Science'] },
    { id: 5, name: 'Biniam Tesfaye', email: 'biniam@student.com', role: 'student', status: 'active', joined: '2026-02-01', university: 'Bahir Dar University', skills: ['Java', 'Spring Boot'] },
    { id: 6, name: 'Meron Alemu', email: 'meron@gebeya.com', role: 'recruiter', status: 'active', joined: '2025-12-15', company: 'Gebeya Inc.', verified: true },
];

export const mockReports = [
    { id: 1, type: 'Spam', reportedBy: 'Abebe Girma', target: 'Fake Internship Post', date: '2026-02-25', status: 'pending', description: 'This post appears to be fraudulent.' },
    { id: 2, type: 'Harassment', reportedBy: 'Hana Mekonnen', target: 'Yonas Bekele', date: '2026-02-22', status: 'under_review', description: 'Inappropriate messages received.' },
    { id: 3, type: 'Misleading Info', reportedBy: 'Biniam Tesfaye', target: 'Mobile Dev Freelance Post', date: '2026-02-20', status: 'resolved', description: 'Stipend claimed was different from actual.' },
];

// Chart data
export const skillGrowthData = [
    { month: 'Sep', React: 30, Python: 20, Design: 15, Communication: 40 },
    { month: 'Oct', React: 45, Python: 30, Design: 25, Communication: 50 },
    { month: 'Nov', React: 55, Python: 38, Design: 35, Communication: 55 },
    { month: 'Dec', React: 65, Python: 50, Design: 42, Communication: 60 },
    { month: 'Jan', React: 75, Python: 62, Design: 55, Communication: 70 },
    { month: 'Feb', React: 88, Python: 72, Design: 65, Communication: 78 },
    { month: 'Mar', React: 92, Python: 80, Design: 72, Communication: 85 },
];

export const applicationData = [
    { month: 'Sep', applications: 2, accepted: 0 },
    { month: 'Oct', applications: 5, accepted: 1 },
    { month: 'Nov', applications: 8, accepted: 2 },
    { month: 'Dec', applications: 6, accepted: 3 },
    { month: 'Jan', applications: 10, accepted: 4 },
    { month: 'Feb', applications: 12, accepted: 5 },
    { month: 'Mar', applications: 8, accepted: 4 },
];

export const hiringData = [
    { month: 'Sep', posted: 3, hired: 1 },
    { month: 'Oct', posted: 5, hired: 3 },
    { month: 'Nov', posted: 8, hired: 5 },
    { month: 'Dec', posted: 6, hired: 4 },
    { month: 'Jan', posted: 10, hired: 7 },
    { month: 'Feb', posted: 12, hired: 9 },
    { month: 'Mar', posted: 9, hired: 7 },
];

export const monthlyGrowthData = [
    { month: 'Aug', students: 120, recruiters: 15 },
    { month: 'Sep', students: 185, recruiters: 22 },
    { month: 'Oct', students: 260, recruiters: 35 },
    { month: 'Nov', students: 340, recruiters: 48 },
    { month: 'Dec', students: 410, recruiters: 60 },
    { month: 'Jan', students: 530, recruiters: 78 },
    { month: 'Feb', students: 650, recruiters: 95 },
    { month: 'Mar', students: 720, recruiters: 112 },
];

export const systemAnalyticsData = [
    { name: 'Active Sessions', value: 342 },
    { name: 'Daily Logins', value: 528 },
    { name: 'Posts Created', value: 89 },
    { name: 'Applications', value: 1240 },
];

export const TESTIMONIALS = [
    { id: 1, name: 'Kaleb Tesfaye', role: 'Frontend Developer', company: 'TechEthiopia', avatar: null, text: 'This platform helped me land my first internship within 2 weeks! The skill-matching system is incredibly accurate.', rating: 5 },
    { id: 2, name: 'Rahel Bekele', role: 'UI/UX Designer', company: 'Kifiya Financial', avatar: null, text: 'The task-based evaluation gave me real project experience. My portfolio grew significantly through this platform.', rating: 5 },
    { id: 3, name: 'Dawit Alemu', role: 'HR Manager', company: 'iCog Labs', avatar: null, text: 'Finding qualified student talent has never been easier. The quality of applicants is consistently impressive.', rating: 5 },
];

import fs from 'fs';
import path from 'path';

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/>Student</g, '>User<');
    content = content.replace(/>student</g, '>user<');
    content = content.replace(/>Students</g, '>Users<');
    content = content.replace(/>students</g, '>users<');
    content = content.replace(/> Students</g, '> Users<');
    content = content.replace(/> students</g, '> users<');
    content = content.replace(/>Student /g, '>User ');
    content = content.replace(/'Student'/g, "'User'");
    content = content.replace(/\"Student\"/g, '"User"');
    content = content.replace(/Student Name/g, 'User Name');
    content = content.replace(/Student details/g, 'User details');
    content = content.replace(/Student Progress/g, 'User Progress');
    content = content.replace(/Student Submission/g, 'User Submission');
    content = content.replace(/Student Earnings/g, 'User Earnings');
    content = content.replace(/Student,/g, 'User,');
    
    content = content.replace(/student to update/g, 'user to update');
    content = content.replace(/between managers and students/g, 'between managers and users');
    content = content.replace(/help students find you/g, 'help users find you');
    content = content.replace(/No student skills/ig, 'No user skills');
    content = content.replace(/No accepted students yet/ig, 'No accepted users yet');
    content = content.replace(/for this student yet/ig, 'for this user yet');
    content = content.replace(/Accepted Student/ig, 'Accepted User');

    // specifically the list column headers
    content = content.replace(/title: 'Student'/g, "title: 'User'");

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log('Updated:', filePath);
    }
}

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            replaceInFile(fullPath);
        }
    }
}

processDir('./src/pages');
processDir('./src/components');
console.log('Done');

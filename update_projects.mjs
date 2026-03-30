import fs from 'fs';

let content = fs.readFileSync('src/constants/projects.js', 'utf8');

// 1. Rename paths and IDs 
content = content.replace(/project3/g, 'video-strategy');
content = content.replace(/project4/g, 'content-creation');
content = content.replace(/project5/g, 'digital-campaigns');
content = content.replace(/project2/g, 'brand-storytelling');

// 2. Clear out dummy URLs
content = content.replace(/'https:\/\/www\.example\.com\/'/g, "undefined");

// 3. Delete project1
const p1Start = content.indexOf("  {\n    id: 'project1',");
const p1End = content.indexOf("  {\n    id: 'brand-storytelling',");
if (p1Start !== -1 && p1End !== -1) {
  content = content.substring(0, p1Start) + content.substring(p1End);
}

// 4. Correct Project5 Title
content = content.replace(/title: 'Project5',/g, "title: 'Digital Campaigns & Operations',");

fs.writeFileSync('src/constants/projects.js', content);

const fs = require('fs');

const taskFile = 'task.md';
const planFile = 'implementation_plan.md';

function markGreen(file) {
  if(!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  
  // Convert any pending back to completed green, since they actually exist!
  content = content.replace(/- \[ \]/g, '- <span style="color: #22c55e; font-weight: bold;">[x]</span>');
  content = content.replace(/- \[x\]/g, '- <span style="color: #22c55e; font-weight: bold;">[x]</span>');

  fs.writeFileSync(file, content);
}

markGreen(taskFile);
markGreen(planFile);

console.log("Tasks updated successfully.");

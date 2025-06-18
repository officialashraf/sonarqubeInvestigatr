// generate-build-info.js
const fs = require('fs');
const { execSync } = require('child_process');
const packageJson = require('./package.json');

const buildInfo = {
  productName: packageJson.name,
  version: packageJson.version,
  lastModifiedOn: execSync('git log -1 --format=%cd').toString().trim(),
  updatedBy: execSync('git log -1 --format=%an').toString().trim(),
  commit: execSync('git rev-parse --short HEAD').toString().trim(),
  maintainedBy: "Ashraf Shaikh", 
};

fs.writeFileSync('./src/InfoApp/build-info.js', `export default ${JSON.stringify(buildInfo, null, 2)};`);
console.log('✅ build-info.js created');

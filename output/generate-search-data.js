const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'pages');
const searchData = [];

fs.readdirSync(pagesDir).forEach((fileName) => {
  const filePath = path.join(pagesDir, fileName);
  if (fs.statSync(filePath).isFile() && path.extname(fileName) === '.md') {
    const pageName = path.basename(fileName, path.extname(fileName));
    searchData.push({ title: pageName, url: `/${pageName}.html` });
  }
});

fs.writeFileSync('search-data.json', JSON.stringify(searchData));

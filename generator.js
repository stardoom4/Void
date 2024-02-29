const fs = require('fs');
const path = require('path');
const marked = require('markdown-it')();
const nunjucks = require('nunjucks');
const express = require('express');

// Set up Nunjucks environment
const templatesDir = path.join(__dirname, 'templates');
const outputDir = path.join(__dirname, 'output');

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const env = nunjucks.configure(templatesDir, {
  autoescape: true,
});

// Function to generate HTML from Markdown
function convertMarkdownToHTML(markdown) {
  return marked.render(markdown);
}

// Function to replace wiki-style links with actual HTML links
function processWikiLinks(content) {
  const wikiLinkRegex = /\[([^\]]+)\]\(([^)]+)\.md\)/g;
  const processedContent = content.replace(wikiLinkRegex, (match, text, link) => {
    return `<a href="${link}.html">${text}</a>`;
  });
  return processedContent;
}

// Function to generate static pages
function generatePages() {
  const pagesDir = path.join(__dirname, 'pages');

  // Read each markdown file in the pages directory
  fs.readdirSync(pagesDir).forEach((fileName) => {
    const filePath = path.join(pagesDir, fileName);

    if (fs.statSync(filePath).isFile() && path.extname(fileName) === '.md') {
      const pageContent = fs.readFileSync(filePath, 'utf-8');

      // Process wiki-style links
      const processedContent = processWikiLinks(pageContent);

      // Extract page name without extension
      const pageName = path.basename(fileName, path.extname(fileName));

      // Render the page using Nunjucks
      const outputHtml = nunjucks.render('page-template.html', {
        content: convertMarkdownToHTML(processedContent),
        title: pageName,
      });

      // Write the generated HTML to the output directory
      const outputPath = path.join(outputDir, `${pageName}.html`);
      fs.writeFileSync(outputPath, outputHtml);
    }
  });
}

// Create an Express app for production server
const app = express();

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Serve generated HTML files from the 'output' directory
app.use(express.static('output'));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Production server is running on http://localhost:${port}`);
});

// Generate the pages
generatePages();

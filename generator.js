const fs = require('fs');
const path = require('path');
const marked = require('markdown-it')();
const nunjucks = require('nunjucks');
const liveServer = require('live-server');

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
// Function to start the live server
function startLiveServer() {
  const serverParams = {
    port: 3000, // Choose a port that suits your needs
    root: path.join(__dirname, 'output'),
    open: false,
    wait: 500,
  };

  liveServer.start(serverParams);

  console.log(`Dev server is running at http://localhost:${serverParams.port}`);
}

// Check if it's a local development environment
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  // If it's a local development environment, start the live server
  startLiveServer();
} else {
  // If it's a deployment environment (e.g., Netlify), skip the live server
  console.log('Void generation completed.');

  // Call generatePages() at the end
  generatePages();
}

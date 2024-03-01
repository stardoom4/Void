const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');
const markdown = require('markdown-it')();

// Set up Nunjucks environment with custom template
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('templates'));
env.addGlobal('include', function (filename, context) {
  const path = 'templates/' + filename + '.html';
  const file = fs.readFileSync(path, 'utf-8');
  const macro = nunjucks.compile(file, env);
  return new nunjucks.runtime.SafeString(macro.render(context));
});

// Function to read site metadata from site.json
function readSiteMetadata() {
  const siteJsonPath = path.join(__dirname, 'site.json');

  try {
    const data = fs.readFileSync(siteJsonPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading site.json: ${error.message}`);
    return {};
  }
}

// Function to parse metadata and content from markdown with wiki-style links
function parseMarkdown(content) {
  // ... (unchanged)
}

// Function to generate pages and page index
function generatePages() {
  const siteMetadata = readSiteMetadata();

  // Read pages from the 'pages' directory
  const pagesDirectory = path.join(__dirname, 'pages');
  const pageFiles = fs.readdirSync(pagesDirectory);

  // Generate page index
  const pageIndexHtml = env.render('page-index.njk', {
    siteName: siteMetadata.siteName,
    pageFiles,
    year: siteMetadata.year || new Date().getFullYear(),
  });

  // Write the page index to the 'output' directory
  fs.writeFileSync(path.join(__dirname, 'output', 'page-index.html'), pageIndexHtml);

  // Iterate through each page file
  pageFiles.forEach((filename) => {
    // Read the content of the page markdown file
    const content = fs.readFileSync(path.join(pagesDirectory, filename), 'utf-8');

    // Parse metadata and content from the markdown file
    const { metadata, body } = parseMarkdown(content);

    // Render the page using the custom template
    const html = env.render('page-template.html', {
      title: metadata.title || 'Untitled',
      siteName: siteMetadata.siteName,
      content: markdown.render(body),
      year: siteMetadata.year || new Date().getFullYear(),
    });

    // Write the generated HTML to the 'output' directory
    const outputFilename = path.join(__dirname, 'output', filename.replace(/\.md$/, '.html'));
    fs.writeFileSync(outputFilename, html);
  });
}

// Generate pages and page index
generatePages();

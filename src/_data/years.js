const fs = require('fs');
const path = require('path');

module.exports = function() {
  const visitsDir = path.join(__dirname, '..', 'visits');
  const years = new Set();

  // Check if visits directory exists
  if (fs.existsSync(visitsDir)) {
    const files = fs.readdirSync(visitsDir);

    files.forEach(file => {
      if (file.endsWith('.md')) {
        // Extract year from filename (YYYY-MM-DD-slug.md)
        const year = file.substring(0, 4);
        if (!isNaN(year)) {
          years.add(year);
        }
      }
    });
  }

  // Return sorted years (descending)
  return Array.from(years).sort((a, b) => b - a);
};

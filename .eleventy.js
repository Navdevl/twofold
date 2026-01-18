module.exports = function(eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("css");

  // Collection: All places, sorted alphabetically
  eleventyConfig.addCollection("places", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/places/*.md").sort((a, b) => {
      return a.data.title.localeCompare(b.data.title);
    });
  });

  // Collection: All visits, sorted by date descending
  eleventyConfig.addCollection("visits", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/visits/*.md").sort((a, b) => {
      return new Date(b.data.date) - new Date(a.data.date);
    });
  });

  // Collection: Visits grouped by year
  eleventyConfig.addCollection("visitsByYear", function(collectionApi) {
    const visits = collectionApi.getFilteredByGlob("src/visits/*.md");
    const byYear = {};

    visits.forEach(visit => {
      const year = new Date(visit.data.date).getFullYear();
      if (!byYear[year]) {
        byYear[year] = [];
      }
      byYear[year].push(visit);
    });

    // Sort visits within each year (descending)
    Object.keys(byYear).forEach(year => {
      byYear[year].sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
    });

    return byYear;
  });

  // Collection: Visits grouped by place
  eleventyConfig.addCollection("visitsByPlace", function(collectionApi) {
    const visits = collectionApi.getFilteredByGlob("src/visits/*.md");
    const byPlace = {};

    visits.forEach(visit => {
      const place = visit.data.place;
      if (!byPlace[place]) {
        byPlace[place] = [];
      }
      byPlace[place].push(visit);
    });

    // Sort visits within each place (descending)
    Object.keys(byPlace).forEach(place => {
      byPlace[place].sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
    });

    return byPlace;
  });

  // Filter: Get place data by slug
  eleventyConfig.addFilter("getPlace", function(places, slug) {
    return places.find(p => p.data.slug === slug);
  });

  // Filter: Calculate average rating
  eleventyConfig.addFilter("averageRating", function(ratings) {
    if (!ratings) return 0;
    const values = Object.values(ratings).filter(v => typeof v === 'number');
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  });

  // Filter: Format date for display
  eleventyConfig.addFilter("formatDate", function(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  // Filter: Format date as YYYY-MM-DD for URLs
  eleventyConfig.addFilter("dateSlug", function(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  // Filter: Get year from date
  eleventyConfig.addFilter("getYear", function(date) {
    return new Date(date).getFullYear();
  });

  // Filter: Get day number from date
  eleventyConfig.addFilter("getDay", function(date) {
    return new Date(date).getDate();
  });

  // Filter: Get short month name from date
  eleventyConfig.addFilter("getMonth", function(date) {
    return new Date(date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  });

  // Filter: Get unique cities from places
  eleventyConfig.addFilter("uniqueCities", function(places) {
    const cities = new Set();
    places.forEach(p => {
      if (p.data.location && p.data.location.city) {
        cities.add(p.data.location.city);
      }
    });
    return Array.from(cities);
  });

  // Filter: Get all years from visits
  eleventyConfig.addFilter("getYears", function(visitsByYear) {
    return Object.keys(visitsByYear).sort((a, b) => b - a);
  });

  // Filter: Current year
  eleventyConfig.addFilter("currentYear", function() {
    return new Date().getFullYear();
  });

  // Shortcode: Rating stars
  eleventyConfig.addShortcode("stars", function(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    let html = '';
    for (let i = 0; i < fullStars; i++) {
      html += '<span class="star full">★</span>';
    }
    if (hasHalf) {
      html += '<span class="star half">★</span>';
    }
    for (let i = 0; i < emptyStars; i++) {
      html += '<span class="star empty">☆</span>';
    }
    return html;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    pathPrefix: "/twofold/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};

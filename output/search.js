$(document).ready(function() {
    $('#searchBtn').on('click', function() {
        var searchQuery = $('#searchInput').val().toLowerCase();
        var searchResults = [];

        // Perform search logic (dummy data for demonstration)
        var pages = [
            { title: 'Lorem', url: '/lorem.html' },
            { title: 'About', url: '/about.html' },
            { title: 'Page 3', url: '/page3.html' }
        ];

        // Filter pages based on search query
        pages.forEach(function(page) {
            if (page.title.toLowerCase().includes(searchQuery)) {
                searchResults.push(page);
            }
        });

        // Display search results
        displayResults(searchResults);
    });
});

function displayResults(results) {
    var resultsContainer = $('#searchResults');
    resultsContainer.empty();

    if (results.length === 0) {
        resultsContainer.text('No results found.');
    } else {
        results.forEach(function(result) {
            var link = $('<a>').attr('href', result.url).text(result.title);
            resultsContainer.append(link).append('<br>');
        });
    }
}

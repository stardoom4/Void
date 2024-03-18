$(document).ready(function() {
    // Function to filter search results
    function filterResults(searchQuery) {
        var filteredResults = [];
        var pages = [
            { title: 'Page 1', url: '/page1.html' },
            { title: 'Page 2', url: '/page2.html' },
            { title: 'Page 3', url: '/page3.html' }
        ];

        // Filter pages based on search query
        if (searchQuery.trim() !== '') {
            filteredResults = pages.filter(function(page) {
                return page.title.toLowerCase().includes(searchQuery.toLowerCase());
            });
        }

        return filteredResults;
    }

    // Function to display search results
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

    // Event listener for search input keyup event
    $('#searchInput').on('keyup', function() {
        var searchQuery = $(this).val();
        var filteredResults = filterResults(searchQuery);
        displayResults(filteredResults);
    });
});

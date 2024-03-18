document.getElementById('searchForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const searchQuery = document.getElementById('searchInput').value.toLowerCase();

  fetch('search-data.json')
    .then(response => response.json())
    .then(data => {
      const results = data.filter(page => page.title.toLowerCase().includes(searchQuery));
      displayResults(results);
    })
    .catch(error => console.error('Error fetching search data:', error));
});

function displayResults(results) {
  const resultsContainer = document.getElementById('searchResults');
  resultsContainer.innerHTML = '';

  if (results.length === 0) {
    resultsContainer.innerHTML = 'No results found.';
  } else {
    results.forEach(result => {
      const link = document.createElement('a');
      link.href = result.url;
      link.textContent = result.title;
      resultsContainer.appendChild(link);
      resultsContainer.appendChild(document.createElement('br'));
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const favoritesCards = document.getElementById('favoritesCards');
  const searchResultTemplate = document.getElementById('searchResultTemplate').innerHTML;

  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  const saveFavorites = () => localStorage.setItem('favorites', JSON.stringify(favorites));
  const isFavorited = (title) => favorites.includes(title);

  const toggleFavorite = (title) => {
    if (isFavorited(title)) {
      favorites = favorites.filter(fav => fav !== title);
    } else {
      favorites.push(title);
    }
    saveFavorites();
    renderFavorites();
    renderSearchResults(searchInput.value.trim());
  };

  const renderFavorites = () => {
    favoritesCards.innerHTML = '';
    if (!favorites.length) {
      favoritesCards.innerHTML = '<p>No favorites yet.</p>';
      return;
    }

    favorites.forEach(title => {
      const game = data.find(g => g.title === title);
      if (!game) return;

      const wrapper = document.createElement('div');
      wrapper.innerHTML = searchResultTemplate.replace(/{{(.*?)}}/g, (match, key) => game[key.trim()]);
      const link = wrapper.querySelector('a');

      const star = document.createElement('span');
      star.className = 'star favorited';
      star.textContent = '★';
      star.style.color = 'yellow';
      star.addEventListener('click', (e) => {
        e.preventDefault();
        toggleFavorite(title);
      });

      link.appendChild(star);
      favoritesCards.appendChild(wrapper.firstElementChild);
    });
  };

  const renderSearchResults = (searchTerm = '') => {
    searchResults.innerHTML = '';
    const filteredResults = data.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));

    filteredResults.forEach(result => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = searchResultTemplate.replace(/{{(.*?)}}/g, (match, key) => result[key.trim()]);
      const link = wrapper.querySelector('a');

      const star = document.createElement('span');
      star.className = `star ${isFavorited(result.title) ? 'favorited' : 'not-favorited'}`;
      star.textContent = '★';
      star.style.color = isFavorited(result.title) ? 'yellow' : 'gray';
      star.addEventListener('click', (e) => {
        e.preventDefault();
        toggleFavorite(result.title);
      });

      link.appendChild(star);
      searchResults.appendChild(wrapper.firstElementChild);
    });
  };

  // Fetch data and init renders
  let data = [];
  try {
    data = await fetch('games.json').then(res => res.json());
    renderSearchResults();
    renderFavorites();
  } catch (err) {
    console.error('Error loading games:', err);
    searchResults.innerHTML = 'Error loading games.';
  }

  // Debounce search input
  let timeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => renderSearchResults(searchInput.value.trim()), 200);
  });
});

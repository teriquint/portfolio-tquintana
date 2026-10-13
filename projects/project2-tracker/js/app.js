let favorites = [];

const form = document.getElementById("add-favorite-form");
const favoritesList = document.getElementById("favorites-list");

const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const ratingFilter = document.getElementById("rating-filter");
const favoritesCount = document.getElementById("favorites-count");
const clearAllButton = document.getElementById("clear-all");

function addFavorite(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const category = document.getElementById("category").value;
  const rating = parseInt(document.getElementById("rating").value);
  const notes = document.getElementById("notes").value.trim();

  if (!name || !category) {
    return;
  }

  const favorite = {
    name: name,
    category: category,
    rating: rating,
    notes: notes,
    dateAdded: new Date().toLocaleDateString()
  };

  favorites.push(favorite);
  saveFavorites();
  form.reset();

  displayFavorites();
}

function deleteFavorite(index) {
  const favorite = favorites[index];

  if (confirm(`Delete "${favorite.name}"?`)) {
    favorites.splice(index, 1);
    saveFavorites();
    searchFavorites();
  }
}

function clearAllFavorites() {
  if (confirm("Delete all favorites?")) {
    favorites = [];
    saveFavorites();
    displayFavorites();
  }
}

function searchFavorites() {
  const searchText = searchInput.value.toLowerCase().trim();
  const selectedCategory = categoryFilter.value;
  const selectedRating = ratingFilter.value;

  const filtered = favorites.filter(function(favorite) {
    const matchesSearch = searchText === '' ||
      favorite.name.toLowerCase().includes(searchText) ||
      favorite.notes.toLowerCase().includes(searchText);

    const matchesCategory = selectedCategory === 'all' ||
      favorite.category === selectedCategory;

    const matchesRating = selectedRating === 'all' ||
      favorite.rating === Number(selectedRating);

    return matchesSearch && matchesCategory && matchesRating;
  });

  favoritesCount.textContent =
    `Showing ${filtered.length} of ${favorites.length} favorites`;

  favoritesList.innerHTML = "";

  if (favorites.length === 0) {
    favoritesCount.textContent = "";

    favoritesList.innerHTML =
      '<p class="empty-message">No favorites yet. Add your first favorite place above!</p>';

    return;
  }

  if (filtered.length === 0) {
    favoritesList.innerHTML =
      '<p class="empty-message">No favorites match your search.</p>';

    return;
  }

  filtered.forEach(function(favorite) {
    const index = favorites.indexOf(favorite);

    favoritesList.innerHTML += `
      <article class="favorite-card">
        <h3>${favorite.name}</h3>
        <p>Category: ${favorite.category}</p>
        <p>Rating: ${"⭐".repeat(favorite.rating)}</p>
        <p>${favorite.notes}</p>
        <p>Added: ${favorite.dateAdded}</p>
        <button class="btn-danger" onclick="deleteFavorite(${index})">Delete</button>
      </article>
    `;
  });
}

function displayFavorites() {
  searchInput.value = '';
  categoryFilter.value = 'all';
  ratingFilter.value = 'all';

  searchFavorites();
}

function saveFavorites() {
  try {
    localStorage.setItem('localFavorites', JSON.stringify(favorites));
  } catch (error) {
    alert('Unable to save favorites. Storage may be disabled.');
  }
}

function loadFavorites() {
  try {
    const saved = localStorage.getItem('localFavorites');

    if (saved) {
      favorites = JSON.parse(saved);
    } else {
      favorites = [];
    }
  } catch (error) {
    favorites = [];
  }
}

form.addEventListener("submit", addFavorite);

clearAllButton.addEventListener("click", clearAllFavorites);
searchInput.addEventListener('input', searchFavorites);
categoryFilter.addEventListener('change', searchFavorites);
ratingFilter.addEventListener('change', searchFavorites);

loadFavorites();
displayFavorites();


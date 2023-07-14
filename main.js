const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultsContainer = document.getElementById("resultsContainer");
const form = document.getElementById("form");
const refresh = document.querySelector(".refresh");
const errEl = document.getElementById("err");
const loading = document.querySelector('.loading');
const imageType = document.getElementById("imageType");
const colorFilter = document.getElementById("colorFilter");
const paginationContainer = document.getElementById("paginationContainer");
const historyContainer = document.getElementById("historyContainer");
const favoritesContainer = document.getElementById("favoritesContainer");
const MAX_RESULTS_PER_PAGE = 10;

searchButton.addEventListener("click", searchImages);
form.addEventListener("submit", e => {
  e.preventDefault();
  searchImages();
});

const showLoadingAnimation = () => {
  resultsContainer.innerHTML = '<div id="load"><div class="loader"></div></div>';
  loading.style.display = 'flex';
}

const hideLoadingAnimation = () => {
  loading.style.display = 'none';
}

const searchImages = async () => {
  const query = searchInput.value;
  const type = imageType.value;
  const apiKey = "38258547-06fd9b1b7822176548228c8b2";
  const color = colorFilter.checked ? "purple" || "orange" || "purple" : "black";
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=${type}&colors=${color}`;

  if (query) {
    showLoadingAnimation();

    try {
      const response = await fetch(url);
      const data = await response.json();
      const hits = data.hits;
      resultsContainer.innerHTML = "";

      hits.forEach(hit => {
        const img = document.createElement("img");
        img.src = hit.webformatURL;
        img.classList.add("centered-image");
        resultsContainer.appendChild(img);
      });

      hideLoadingAnimation();
      displayPagination(hits);
      displaySearchHistory(query);
    } catch (error) {
      console.log(error);
      resultsContainer.innerHTML = `<h3>An error occurred while loading: ${query} from pixabay.com</h3>`;
      hideLoadingAnimation();
    }
  }

  searchInput.value = "";
  searchInput.focus();
}

const displayPagination = hits => {
  const numPages = Math.ceil(hits.length / MAX_RESULTS_PER_PAGE);
  paginationContainer.innerHTML = "";

  for (let i = 0; i < numPages; i++) {
    const button = document.createElement("button");
    button.innerText = i + 1;
    button.addEventListener("click", () => {
      const startIndex = i * MAX_RESULTS_PER_PAGE;
      const endIndex = startIndex + MAX_RESULTS_PER_PAGE;
      displayResults(hits.slice(startIndex, endIndex));
    });
    paginationContainer.appendChild(button);
  }
}

const displayResults = results => {
  resultsContainer.innerHTML = "";

  results.forEach(result => {
    const img = document.createElement("img");
    img.src = result.webformatURL;
    img.classList.add("centered-image");
    resultsContainer.appendChild(img);
  });
}

const displaySearchHistory = query => {
  const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  history.push(query);
  localStorage.setItem("searchHistory", JSON.stringify(history));

  historyContainer.innerHTML = "";

  history.forEach(query => {
    const button = document.createElement("button");
    button.innerText = query;
    button.addEventListener("click", () => {
      searchInput.value = query;
      searchImages();
    });
    historyContainer.appendChild(button);
  });
}

const displayFavorites = () => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favoritesContainer.innerHTML = "";

  favorites.forEach(favorite => {
    const img = document.createElement("img");
    img.src = favorite.webformatURL;
    img.classList.add("centered-image");
    favoritesContainer.appendChild(img);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  searchImages();
  displayFavorites();
});

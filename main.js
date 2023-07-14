var searchInput = document.getElementById("searchInput");
var searchButton = document.getElementById("searchButton");
var resultsContainer = document.getElementById("resultsContainer");
var form = document.getElementById("form");
var refresh = document.querySelector(".refresh");
var errEl = document.getElementById("err");
var loading = document.querySelector('.loading');
var imageType = document.getElementById("imageType");
var colorFilter = document.getElementById("colorFilter");
var paginationContainer = document.getElementById("paginationContainer");
var historyContainer = document.getElementById("historyContainer");
var favoritesContainer = document.getElementById("favoritesContainer");
var MAX_RESULTS_PER_PAGE = 10;

function searchImages() {
  var query = searchInput.value;
  var type = imageType.value;
  var color = colorFilter.checked ? "purple" || "orange" || "purple" : "black";
  var url = `https://pixabay.com/api/?key=38258547-06fd9b1b7822176548228c8b2&q=${query}&image_type=${type}&colors=${color}`;

  if (query) {
    showLoadingAnimation();

    fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        var hits = data.hits;
        resultsContainer.innerHTML = "";

        hits.forEach(function(hit) {
          var img = document.createElement("img");
          img.src = hit.webformatURL;
          img.classList.add("centered-image");
          resultsContainer.appendChild(img);
        });

        hideLoadingAnimation();
        displayPagination(hits);
        displaySearchHistory(query);
      })
      .catch(function(error) {
        console.log(error);
        resultsContainer.innerHTML = `<h3>An error occurred while loading: ${query} from pixabay.com</h3><h3>Check the console for more details.</h3>`;
        hideLoadingAnimation();
      });
  }

  searchInput.value = "";
  searchInput.focus();
}

searchButton.addEventListener("click", searchImages);
form.addEventListener("submit", function(e) {
  e.preventDefault();
  searchImages();
});

function showLoadingAnimation() {
  resultsContainer.innerHTML = '<div id="load"><div class="loader"></div></div>';
  loading.style.display = 'flex';
}

function hideLoadingAnimation() {
  loading.style.display = 'none';
}

function displayPagination(hits) {
  var numPages = Math.ceil(hits.length / MAX_RESULTS_PER_PAGE);
  paginationContainer.innerHTML = "";

  for (var i = 0; i < numPages; i++) {
    var button = document.createElement("button");
    button.innerText = i + 1;
    button.addEventListener("click", function() {
      var startIndex = i * MAX_RESULTS_PER_PAGE;
      var endIndex = startIndex + MAX_RESULTS_PER_PAGE;
      displayResults(hits.slice(startIndex, endIndex));
    });
    paginationContainer.appendChild(button);
  }
}

function displayResults(results) {
  resultsContainer.innerHTML = "";

  results.forEach(function(result) {
    var img = document.createElement("img");
    img.src = result.webformatURL;
    img.classList.add("centered-image");
    resultsContainer.appendChild(img);
  });
}

function displaySearchHistory(query) {
  var history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  history.push(query);
  localStorage.setItem("searchHistory", JSON.stringify(history));

  historyContainer.innerHTML = "";

  history.forEach(function(query) {
    var button = document.createElement("button");
    button.innerText = query;
    button.addEventListener("click", function() {
      searchInput.value = query;
      searchImages();
    });
    historyContainer.appendChild(button);

  });
}

function displayFavorites() {
  var favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favoritesContainer.innerHTML = "";

  favorites.forEach(function(favorite) {
    var img = document.createElement("img");
    img.src = favorite.webformatURL;
    img.classList.add("centered-image");
    favoritesContainer.appendChild(img);
  });
}


const searchInput = document.getElementById('user-input');
const searchButtons = document.querySelectorAll('.magnifier, .SearchButton');
const clearButton = document.querySelector('.button:nth-child(2)');
const searchResultsContainer = document.querySelector('.search-results');

const keywords = {
    "beach": "beaches",
    "beaches": "beaches",
    "temple": "temples",
    "temples": "temples",
    "country": "countries",
    "countries": "countries"
};

let travelData = {};

document.addEventListener('DOMContentLoaded', () => {
    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            travelData = data;
            console.log(travelData); // Check if data is fetched correctly
        })
        .catch(error => console.error('Error fetching the JSON file:', error));
});

searchButtons.forEach(button => {
  button.addEventListener('click', function() {
    const userInput = searchInput.value.toLowerCase();
    parseInput(userInput);
  });
});

function parseInput(inputString) {
  if (keywords.hasOwnProperty(inputString)) {
    const searchString = keywords[inputString];
    constructResult(searchString);
  } else {
    alert("No matching keyword found");
  }
}

function constructResult(searchTerm) {
  const results = travelData[searchTerm];
  if (!results) {
    alert("No results found");
    return;
  }

  searchResultsContainer.innerHTML = "";

  let suggestions = [];
  if (searchTerm === "countries") {
    results.forEach(country => {
      country.cities.forEach(city => {
        suggestions.push(city);
      });
    });
  } else {
    suggestions = results;
  }

  suggestions.forEach(suggestion => {
    searchResultsContainer.append(constructResultCard(suggestion.imageUrl, suggestion.name, suggestion.description));
  });
}

function constructResultCard(imageUrl, title, description) {
  const cardContainer = document.createElement('div');
  const cardImage = document.createElement('img');
  const cardTextContainer = document.createElement('div');
  const cardTextTitle = document.createElement('div');
  const cardTextDescription = document.createElement('div');
  const cardTextButton = document.createElement('button');

  cardContainer.classList.add('search-result');
  cardTextContainer.classList.add('search-result-container');
  cardTextTitle.classList.add('search-result-title');
  cardTextDescription.classList.add('search-result-description');
  cardTextButton.classList.add('search-result-button');

  cardImage.src = imageUrl;
  cardTextTitle.innerText = title;
  cardTextDescription.innerText = description;
  cardTextButton.innerText = "Visit";

  cardContainer.append(cardImage, cardTextContainer);
  cardTextContainer.append(cardTextTitle, cardTextDescription, cardTextButton);

  return cardContainer;
}

clearButton.addEventListener('click', () => {
  console.log('Clear button clicked');
  searchResultsContainer.innerHTML = ""; // Clear the search results
  searchInput.value = ""; // Clear the search input field
});


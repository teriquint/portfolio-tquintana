
function loadWeather() {
    fetch('./data/weather.json')
        .then(response => {
            if (!response.ok) throw new Error('Data could not be loaded');
            return response.json();
        })
        .then(data => displayWeather(data))
        .catch(error => {
            console.error('Error loading weather:', error);
            displayWeatherError();
        });
}

function displayWeather(weather) {
    document.getElementById('weather-display').classList.remove('loading');

    document.getElementById('weather-display').innerHTML = `
        <div class="weather-current">
            <div class="weather-icon">${weather.icon}</div>
            <div class="weather-temp">${weather.temperature}°F</div>
            <div class="weather-location">${weather.location}</div>
            <div class="weather-condition">${weather.condition}</div>
            <p>Humidity: ${weather.humidity}%</p>
            <p>Wind Speed: ${weather.windSpeed} mph</p>
        </div>
    `;
}

function displayWeatherError() {
    document.getElementById('weather-display').classList.remove('loading');

    document.getElementById('weather-display').innerHTML = `
        <p>Weather data is unavailable right now.</p>
    `;
}

let allQuotes = [];
let lastQuoteIndex = -1;

const newQuoteButton = document.getElementById('new-quote');

function displayRandomQuote() {
    document.getElementById('quote-display').classList.remove('loading');

    if (allQuotes.length === 0) {
        document.getElementById('quote-display').innerHTML = `
            <p>There are no quotes to show.</p>
        `;
        return;
    }

    let randomIndex;

    do {
        randomIndex = Math.floor(Math.random() * allQuotes.length);
    } while (randomIndex === lastQuoteIndex && allQuotes.length > 1);

    lastQuoteIndex = randomIndex;

    const quote = allQuotes[randomIndex];

    document.getElementById('quote-display').innerHTML = `
        <p>"${quote.text}"</p>
        <p>— ${quote.author}</p>
    `;
}

function loadQuotes() {
    fetch('./data/quotes.json')
        .then(response => {
            if (!response.ok) throw new Error('Data could not be loaded');
            return response.json();
        })
        .then(quotes => {
            allQuotes = quotes;
            displayRandomQuote();

            if (allQuotes.length > 0) {
                newQuoteButton.disabled = false;
            }
        })
        .catch(error => {
            console.error('Error loading quotes:', error);
            displayQuotesError();
        });
}

function displayQuotesError() {
    document.getElementById('quote-display').classList.remove('loading');

    document.getElementById('quote-display').innerHTML = `
        <p>Quote data is unavailable right now.</p>
    `;
}

function initializeTheme() {
    if (localStorage.getItem('dashboardTheme') === 'dark') {
        document.body.classList.add('theme-dark');
    }

    updateThemeButton();
}

function updateThemeButton() {
    const isDark = document.body.classList.contains('theme-dark');
    const button = document.getElementById('theme-toggle');

    button.textContent = isDark
        ? 'Switch to light mode'
        : 'Switch to dark mode';

    button.setAttribute('aria-pressed', String(isDark));
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('theme-dark');

    if (isDark) {
        localStorage.setItem('dashboardTheme', 'dark');
    } else {
        localStorage.setItem('dashboardTheme', 'light');
    }

    updateThemeButton();
}

document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
newQuoteButton.addEventListener('click', displayRandomQuote);

initializeTheme();
loadWeather();
loadQuotes();

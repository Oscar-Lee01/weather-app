
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherIcon = document.getElementById("weatherIcon");

const message = document.getElementById("message");
const spinner = document.getElementById("spinner");

const toggleTheme = document.getElementById("toggleTheme");
const app = document.getElementById("app");
const dateTime = document.getElementById("dateTime");

const forecastContainer = document.getElementById("forecast");

const feelsLike = document.getElementById("feelsLike");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");


/* API KEY */

const API_KEY = "575dfbb9fd4aaeea6ca850fd896ca0f6";

/* SPINNER FUNCTIONS */

function showSpinner() {
    spinner.style.display = "block";
}

function hideSpinner() {
    spinner.style.display = "none";
}

/* FETCH WEATHER BY CITY */

async function getWeather(city) {

    showSpinner();
    message.textContent = "";

    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );

    const data = await res.json();

    hideSpinner();

    updateUI(data);

    getForecast(city);

}

/* FETCH WEATHER BY LOCATION */

async function getLocationWeather(lat, lon) {

    showSpinner();

    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    const data = await res.json();

    hideSpinner();

    updateUI(data);

    getForecastByCoords(lat, lon);
}

/* FETCH FORECAST BY LOCATION */

async function getForecastByCoords(lat, lon) {

    // call forecast endpoint using coordinates
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    const data = await res.json();

    // reuse same display function
    displayForecast(data);
}

/* FETCH 5-DAY FORECAST */

async function getForecast(city) {

    // call forecast endpoint
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );

    const data = await res.json();

    displayForecast(data);
}

/* DISPLAY FORECAST */

function displayForecast(data) {

    // clear old forecast
    forecastContainer.innerHTML = "";

    // filter: take one result every 24hrs (8 slots)
    const daily = data.list.filter((item, index) => index % 8 === 0);

    daily.forEach(day => {

        // create card
        const card = document.createElement("div");
        card.className = "forecast-card";

        // convert date
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

        // add content
        card.innerHTML = `
            <p>${dayName}</p>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" />
            <p>${Math.round(day.main.temp)}°</p>
        `;

        forecastContainer.appendChild(card);
    });
}

/* UPDATE UI */

function updateUI(data) {

    cityName.textContent = data.name;

    temperature.textContent = `${Math.round(data.main.temp)}°`;

    description.textContent = data.weather[0].description;

    humidity.textContent = `${data.main.humidity}%`;

    wind.textContent = `${data.wind.speed} m/s`;

    feelsLike.textContent = `${Math.round(data.main.feels_like)}°`;

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;


    /* sunrise & sunset */

    const rise = new Date(data.sys.sunrise * 1000);
    const set = new Date(data.sys.sunset * 1000);

    sunrise.textContent = "🌅 " + rise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    sunset.textContent  = "🌇 " + set.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


    /* dynamic background */

    const weather = data.weather[0].main.toLowerCase();

    document.body.className = ""; // reset

    if (weather.includes("cloud")) document.body.classList.add("clouds");
    else if (weather.includes("rain")) document.body.classList.add("rain");
    else document.body.classList.add("clear");


    /* auto night mode */

    const hour = new Date().getHours();

    if (hour >= 19 || hour <= 6) {
        document.body.classList.add("night");
        app.classList.add("dark");
    }
}

/* EVENTS */

searchBtn.onclick = () => {
    getWeather(cityInput.value);
};

locationBtn.onclick = () => {

    navigator.geolocation.getCurrentPosition((pos) => {
        getLocationWeather(pos.coords.latitude, pos.coords.longitude);
    });
};

/* DARK MODE */

toggleTheme.onclick = () => {
    app.classList.toggle("dark");
};

/* LIVE CLOCK */

setInterval(() => {
    dateTime.textContent = new Date().toLocaleString();
}, 1000);

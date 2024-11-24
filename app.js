//API keys
const OPENWEATHERMAP_API_KEY = '103e06f5a36f58275bafa859b4872759';
const UNSPLASH_ACCESS_KEY = 'BkBwk1PxoBe3I4DO2LqScGnJBbUSExWFK8GKcbl2iMc';


document.getElementById('get-weather-btn').addEventListener('click', () => {
    const location = document.getElementById('location-input').value.trim();
    if (location) {
        getWeather(location);
    } else {
        alert('Please enter a city name.');
    }
});

function getWeather(location) {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;

    const loadingIcon = document.getElementById('loading-icon');
    loadingIcon.style.display = 'block';

    fetch(weatherApiUrl)
        .then(response => response.json())
        .then(data => {
            const weatherInfoDiv = document.getElementById('weather-info');
            if (data.cod === 200) {
                const weatherDescription = data.weather[0].description;
                const temperature = data.main.temp;
                const cityName = data.name;
                const iconCode = data.weather[0].icon;
                const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

                weatherInfoDiv.innerHTML = `
                    <h2>${cityName}</h2>
                    <img src="${iconUrl}" alt="${weatherDescription}">
                    <p><strong>${Math.round(temperature)}°C</strong>, ${capitalizeFirstLetter(weatherDescription)}</p>
                `;
                getImage(weatherDescription);
            } else {
                weatherInfoDiv.innerHTML = `<p>City not found. Please try again.</p>`;
                document.body.style.backgroundImage = '';
                loadingIcon.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            loadingIcon.style.display = 'none';
        });
}

function getImage(query) {
    const unsplashApiUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`;

    fetch(unsplashApiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.urls && data.urls.full) {
                const imageUrl = data.urls.full + '&w=1920';
                const backgroundImage = new Image();
                backgroundImage.src = imageUrl;
                backgroundImage.onload = () => {
                    document.body.style.backgroundImage = `url('${imageUrl}')`;
                    
                    const loadingIcon = document.getElementById('loading-icon');
                    loadingIcon.style.display = 'none';
                };
            } else {
                document.body.style.backgroundImage = '';
                const loadingIcon = document.getElementById('loading-icon');
                loadingIcon.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error fetching image data:', error);
            const loadingIcon = document.getElementById('loading-icon');
            loadingIcon.style.display = 'none';
        });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

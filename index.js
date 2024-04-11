const searchbar = document.querySelector('.searchbar');
const serachBtn = document.getElementById('search-btn');
const weatherCardDisplay = document.querySelector('.weather-display');

const API_KEY = 'f47db6b6f645e78497ff623754cdd186';


function getLocation () {
    if (searchbar.value.trim() !== '') {
        const location = searchbar.value;
        searchbar.value = '';
        return location;
    } else {
        searchbar.value = '';
        return null;
    }
}

async function getWeatherData (city_name) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${API_KEY}&units=metric`);
        if (response.ok) {
            const weatherData = await response.json();
            createWeatherCard(weatherData);
        } else {
            createErrorCard();
        }
    } catch (error) {
        createErrorCard();
    }
    
}

function angleToDirection(angle) {
    angle = angle % 360;
    if (angle < 0) {
        angle += 360;
    }

    const directions = {
        'N': [0, 22.5],
        'NE': [22.5, 67.5],
        'E': [67.5, 112.5],
        'SE': [112.5, 157.5],
        'S': [157.5, 202.5],
        'SW': [202.5, 247.5],
        'W': [247.5, 292.5],
        'NW': [292.5, 337.5],
        'N': [337.5, 360]
    };

    for (let direction in directions) {
        if (angle >= directions[direction][0] && angle < directions[direction][1]) {
            return direction;
        }
    }

    return null;
}


function createWeatherCard (data) {
    weatherCardDisplay.innerHTML = '';
    weatherCardDisplay.innerHTML = `
    <div class="weather-card">
        <div class="upper">
            <ul class="main-props">
                <li class="weather-condition">
                    ${data.weather[0].main}
                </li>
                <li class="weather-temp">
                    ${data.main.temp}&deg;C
                </li>
                <li class="weather-location">
                    ${data.name},${data.sys.country}
                </li>
            </ul>
        </div>
        <div class="lower">
            <ul class="other-props">
                <li class="wind">
                    <h4 class="wind-head">Wind</h4>
                    <p class="wind-data">${angleToDirection(data.wind.deg)} ${data.wind.speed}m/s</p>
                </li>
                <li class="humidity">
                    <h4 class="humidity-head">Humidity</h4>
                    <p class="humidity-data">${data.main.humidity}%</p>
                </li>
                <li class="pressure">
                    <h4 class="pressure-head">Pressure</h4>
                    <p class="pressure-data">${data.main.pressure} hpa</p>
                </li>
            </ul>
        </div>
    </div>
    `;
    const weatherCondition = document.querySelector('.weather-condition');
    weatherCondition.style.background = `url(http://openweathermap.org/img/w/${data.weather[0].icon}.png)`;
    weatherCondition.style.backgroundPosition = 'right';
    weatherCondition.style.backgroundRepeat = 'no-repeat';
}

serachBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const locationName = getLocation();
    if(locationName != null) {
        getWeatherData(locationName);
    } else {
        alert('search a location')
    }
})

function createErrorCard () {
    weatherCardDisplay.innerHTML = '';
    weatherCardDisplay.innerHTML = `
    <div class="weather-error-card">
        <h1 class="error">OOpps</h1>
        <p class="error-desc">Location not found</p>
    </div>
    `;
    const errorCard = document.querySelector('.weather-error-card');
    errorCard.style.background = 'red';
    errorCard.style.color = 'white';
}
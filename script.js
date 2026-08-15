const apiKey = '0a153e1994350ea023e4886b2bc88084'; // Aapki di gayi key
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherDisplay = document.getElementById('weather-display');

// Pokemon mappings based on weather condition
const weatherToPokemon = {
    Clear: {
        type: 'FIRE',
        iconUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png' // Charmander
    },
    Clouds: {
        type: 'ELECTRIC',
        iconUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' // Pikachu
    },
    Rain: {
        type: 'WATER',
        iconUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png' // Squirtle
    },
    Drizzle: {
        type: 'WATER',
        iconUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png' // Psyduck
    },
    Thunderstorm: {
        type: 'ELECTRIC',
        iconUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/135.png' // Jolteon
    },
    Snow: {
        type: 'ICE',
        iconUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/37.png' // Vulpix
    },
    Mist: {
        type: 'GHOST',
        iconUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/92.png' // Gastly
    },
    Default: {
        type: 'NORMAL',
        iconUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png' // Ditto
    }
};

// Event Listeners
searchBtn.addEventListener('click', fetchWeather);
cityInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        fetchWeather();
    }
});

async function fetchWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    // Show Scanning State
    weatherDisplay.innerHTML = '<div class="intro-screen"><p>Scanning Database...</p></div>';

    try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.cod !== 200) {
            showError(data.message || "City not found!");
        } else {
            displayWeather(data);
        }

    } catch (error) {
        console.error('Error fetching weather:', error);
        showError("Network connection failed!");
    }
}

function displayWeather(data) {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const humidity = data.main.humidity;
    const windSpeed = Math.round(data.wind.speed * 3.6); 
    const weatherMain = data.weather[0].main;

    const pokemonData = weatherToPokemon[weatherMain] || weatherToPokemon.Default;

    weatherDisplay.innerHTML = `
        <div class="weather-result" style="display: flex; flex-direction: column; height: 100%; justify-content: space-around;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-weight: bold; font-size: 14px;">${cityName}</div>
                    <div style="font-size: 9px; text-transform: uppercase; margin-top: 2px;">${data.weather[0].description}</div>
                </div>
                <div style="background: #ffcc00; padding: 3px 6px; border-radius: 4px; font-size: 8px; border: 1px solid #333;">${pokemonData.type} TYPE</div>
            </div>
            
            <div style="text-align: center;">
                <img src="${pokemonData.iconUrl}" alt="Pokemon" style="width: 90px; height: 90px; object-fit: contain; image-rendering: pixelated;">
            </div>

            <div style="display: flex; justify-content: space-around; background-color: rgba(0,0,0,0.1); padding: 8px; border-radius: 5px;">
                <div style="text-align: center;">
                    <span style="font-size: 7px; display: block;">TEMP</span>
                    <span style="font-size: 12px; font-weight: bold;">${temperature}°C</span>
                </div>
                <div style="text-align: center;">
                    <span style="font-size: 7px; display: block;">HUMIDITY</span>
                    <span style="font-size: 12px; font-weight: bold;">${humidity}%</span>
                </div>
                <div style="text-align: center;">
                    <span style="font-size: 7px; display: block;">WIND</span>
                    <span style="font-size: 12px; font-weight: bold;">${windSpeed} km/h</span>
                </div>
            </div>
        </div>
    `;
}

function showError(message) {
    weatherDisplay.innerHTML = `
        <div style="text-align: center; color: #900; margin-top: 40px;">
            <p style="font-size: 11px; font-weight: bold;">ERROR: ${message}</p>
            <p style="font-size: 8px; margin-top: 10px;">Check city spelling or API Key validity.</p>
        </div>
    `;
}

// --- 8-BIT AUDIO SYNTHESIZER ---
function playRetroSound(theme) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        if (theme === 'dbz') {
            osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
            osc.type = 'sawtooth';
        } else if (theme === 'naruto') {
            osc.frequency.setValueAtTime(440, audioCtx.currentTime);
            osc.type = 'square';
        } else if (theme === 'doraemon') {
            osc.frequency.setValueAtTime(659.25, audioCtx.currentTime);
            osc.type = 'sine';
        } else {
            osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
            osc.type = 'square';
        }

        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {}
}

// --- VERIFIED ANIME CHARACTER ARTWORK DATABASE ---
const characterDatabase = {
    pokemon: {
        sunny: { name: "Charizard", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png", fallback: "🔥", desc: "A wild Charizard soaks up the sun!" },
        rainy: { name: "Squirtle", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png", fallback: "💧", desc: "A wild Squirtle enjoys the heavy rain!" },
        thunder: { name: "Pikachu", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png", fallback: "⚡", desc: "Pikachu charges up in the thunderstorm!" },
        snowy: { name: "Alolan Vulpix", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/37-alola.png", fallback: "❄️", desc: "Alolan Vulpix frolics in the snow!" },
        default: { name: "Pikachu", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png", fallback: "🎮", desc: "Scanning weather conditions..." }
    },
    dbz: {
        sunny: { name: "Super Saiyan Goku", sprite: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300", fallback: "🌟", desc: "Power level rising under blazing sun!" },
        rainy: { name: "Blue Aura Goku", sprite: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300", fallback: "🌊", desc: "Training intensely through the downpour!" },
        thunder: { name: "Majin Vegeta", sprite: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300", fallback: "💥", desc: "Lightning strikes across the battlefield!" },
        snowy: { name: "Gohan (Winter)", sprite: "https://images.unsplash.com/photo-1517824806704-9040b037703b?w=300", fallback: "🏔️", desc: "Meditating calmly in freezing winds!" },
        default: { name: "Goku", sprite: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300", fallback: "🥋", desc: "Ready for battle!" }
    },
    naruto: {
        sunny: { name: "Naruto (Sage Mode)", sprite: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=300", fallback: "☀️", desc: "Gathering natural energy in the sun!" },
        rainy: { name: "Kakashi Hatake", sprite: "https://images.unsplash.com/photo-1563089145-599997674d42?w=300", fallback: "🌧️", desc: "Mission underway in the misty rain." },
        thunder: { name: "Sasuke Uchiha", sprite: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=300", fallback: "⚡", desc: "Channeling lightning for Kirin!" },
        snowy: { name: "Haku", sprite: "https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=300", fallback: "❄️", desc: "Ice mirrors freezing the snowfall." },
        default: { name: "Naruto Uzumaki", sprite: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=300", fallback: "🍥", desc: "Dattebayo!" }
    },
    doraemon: {
        sunny: { name: "Doraemon (Take-copter)", sprite: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300", fallback: "🚁", desc: "Flying high with the Take-copter!" },
        rainy: { name: "Doraemon (Umbrella)", sprite: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=300", fallback: "☂️", desc: "Holding a futuristic rain umbrella!" },
        thunder: { name: "Nobita Nobi", sprite: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300", fallback: "🌩️", desc: "Hiding from the thunderstorm!" },
        snowy: { name: "Doraemon (Anywhere Door)", sprite: "https://images.unsplash.com/photo-1483982258113-b72862e6cff6?w=300", fallback: "🚪", desc: "Stepping through snow into winter!" },
        default: { name: "Doraemon", sprite: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300", fallback: "🔔", desc: "Have a secret gadget ready!" }
    }
};

// --- THEME SWITCHER LOGIC ---
const themeSelect = document.getElementById('theme-select');
themeSelect.addEventListener('change', (e) => {
    const selectedTheme = e.target.value;
    document.body.className = `theme-${selectedTheme}`;
    playRetroSound(selectedTheme);
});

// --- WEATHER FETCHING LOGIC ---
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherDisplay = document.getElementById('weather-display');

searchBtn.addEventListener('click', fetchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchWeather();
});

async function fetchWeather() {
    const cityName = cityInput.value.trim();
    const currentTheme = themeSelect.value;
    playRetroSound(currentTheme);

    if (!cityName) {
        alert('Please enter a city name!');
        return;
    }

    weatherDisplay.innerHTML = `<div class="intro-screen"><p>Scanning Multi-Verse...</p></div>`;

    try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            weatherDisplay.innerHTML = `<div class="error-screen"><p>Target not found in radar!</p></div>`;
            return;
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`);
        const weatherData = await weatherRes.json();
        const current = weatherData.current;

        const code = current.weather_code;
        let conditionKey = 'default';
        let conditionText = 'Clear Skies';

        if (code >= 1 && code <= 3) { conditionKey = 'sunny'; conditionText = 'Sunny / Clear'; }
        else if (code >= 51 && code <= 67) { conditionKey = 'rainy'; conditionText = 'Rain Showers'; }
        else if (code >= 95) { conditionKey = 'thunder'; conditionText = 'Thunderstorm'; }
        else if (code >= 71 && code <= 77) { conditionKey = 'snowy'; conditionText = 'Snowfall'; }

        const themeChar = characterDatabase[currentTheme][conditionKey] || characterDatabase[currentTheme].default;

        weatherDisplay.innerHTML = `
            <div class="weather-result">
                <div class="weather-top">
                    <span class="city-name">${name}, ${country || ''}</span>
                    <span class="temp-val">${Math.round(current.temperature_2m)}°C</span>
                </div>
                <div class="weather-icon-container">
                    <img src="${themeChar.sprite}" alt="${themeChar.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px; border: 2px solid #333;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div class="fallback-emoji" style="display:none; font-size: 45px; margin: 2px 0;">${themeChar.fallback}</div>
                    <p class="condition-text">${themeChar.name}</p>
                </div>
                <div class="weather-lore" style="font-size: 8px; text-align:center; color:#222; margin-top:-3px;">
                    <em>"${themeChar.desc}"</em>
                </div>
                <div class="weather-details">
                    <div class="detail-item">
                        <span class="detail-label">HUMIDITY</span>
                        <span class="detail-value">${current.relative_humidity_2m}%</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">WIND</span>
                        <span class="detail-value">${current.wind_speed_10m} km/h</span>
                    </div>
                </div>
            </div>
        `;

    } catch (err) {
        weatherDisplay.innerHTML = `<div class="error-screen"><p>Connection Error! Check network.</p></div>`;
    }
}

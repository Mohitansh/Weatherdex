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

// --- GUARANTEED EMOJI-BASED CHARACTER DATABASE ---
const characterDatabase = {
    pokemon: {
        sunny: { name: "Charizard", avatar: "🐲", desc: "A wild Charizard soaks up the sun!" },
        rainy: { name: "Squirtle", avatar: "🐢", desc: "A wild Squirtle enjoys the heavy rain!" },
        thunder: { name: "Pikachu", avatar: "⚡", desc: "Pikachu charges up in the thunderstorm!" },
        snowy: { name: "Alolan Vulpix", avatar: "🦊", desc: "Alolan Vulpix frolics in the snow!" },
        default: { name: "Pikachu", avatar: "🔴", desc: "Scanning weather conditions..." }
    },
    dbz: {
        sunny: { name: "Super Saiyan Goku", avatar: "💥", desc: "Power level rising under blazing sun!" },
        rainy: { name: "Blue Aura Goku", avatar: "🌊", desc: "Training intensely through the downpour!" },
        thunder: { name: "Majin Vegeta", avatar: "⚡", desc: "Lightning strikes across the battlefield!" },
        snowy: { name: "Gohan (Winter)", avatar: "🏔️", desc: "Meditating calmly in freezing winds!" },
        default: { name: "Goku", avatar: "🥋", desc: "Ready for battle!" }
    },
    naruto: {
        sunny: { name: "Naruto (Sage Mode)", avatar: "☀️", desc: "Gathering natural energy in the sun!" },
        rainy: { name: "Kakashi Hatake", avatar: "🌧️", desc: "Mission underway in the misty rain." },
        thunder: { name: "Sasuke Uchiha", avatar: "⚡", desc: "Channeling lightning for Kirin!" },
        snowy: { name: "Haku", avatar: "❄️", desc: "Ice mirrors freezing the snowfall." },
        default: { name: "Naruto Uzumaki", avatar: "🍥", desc: "Dattebayo!" }
    },
    doraemon: {
        sunny: { name: "Doraemon (Take-copter)", avatar: "🚁", desc: "Flying high with the Take-copter!" },
        rainy: { name: "Doraemon (Umbrella)", avatar: "☂️", desc: "Holding a futuristic rain umbrella!" },
        thunder: { name: "Nobita & Gadgets", avatar: "🌩️", desc: "Hiding from the thunderstorm!" },
        snowy: { name: "Doraemon (Anywhere Door)", avatar: "🚪", desc: "Stepping through snow into winter!" },
        default: { name: "Doraemon", avatar: "🔔", desc: "Have a secret gadget ready!" }
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
                <div class="weather-icon-container" style="text-align: center; margin: 10px 0;">
                    <div style="font-size: 45px; margin-bottom: 5px;">${themeChar.avatar}</div>
                    <p class="condition-text" style="font-size: 11px; font-weight: bold; text-transform: uppercase;">${themeChar.name}</p>
                </div>
                <div class="weather-lore" style="font-size: 8px; text-align:center; color:#222; margin-top:-2px;">
                    <em>"${themeChar.desc}"</em>
                </div>
                <div class="weather-details" style="margin-top: 5px;">
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
        weatherDisplay.keyword = '';
        weatherDisplay.innerHTML = `<div class="error-screen"><p>Connection Error! Check network.</p></div>`;
    }
}

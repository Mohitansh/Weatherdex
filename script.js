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

// --- FOOLPROOF RETRO UNIVERSE & CHARACTER DATABASE ---
const characterDatabase = {
    pokemon: {
        sunny: { name: "Charizard", symbol: "🔥", badge: "KANTO FIRE", desc: "A wild Charizard soaks up the sun!" },
        rainy: { name: "Squirtle", symbol: "💧", badge: "WATER TYPE", desc: "A wild Squirtle enjoys the heavy rain!" },
        thunder: { name: "Pikachu", symbol: "⚡", badge: "ELECTRIC SHOCK", desc: "Pikachu charges up in the thunderstorm!" },
        snowy: { name: "Alolan Vulpix", symbol: "❄️", badge: "ICE BLIZZARD", desc: "Alolan Vulpix frolics in the snow!" },
        default: { name: "Pikachu", symbol: "🔴", badge: "POKÉ-DEX", desc: "Scanning weather conditions..." }
    },
    dbz: {
        sunny: { name: "Super Saiyan Goku", symbol: "🌟", badge: "SUPER SAIYAN", desc: "Power level rising under blazing sun!" },
        rainy: { name: "Blue Aura Goku", symbol: "🌊", badge: "GOD KI AURA", desc: "Training intensely through the downpour!" },
        thunder: { name: "Majin Vegeta", symbol: "💥", badge: "FINAL FLASH", desc: "Lightning strikes across the battlefield!" },
        snowy: { name: "Gohan (Winter)", symbol: "🏔️", badge: "ROOM OF SPIRIT", desc: "Meditating calmly in freezing winds!" },
        default: { name: "Goku", symbol: "🥋", badge: "DBZ SQUAD", desc: "Ready for battle!" }
    },
    naruto: {
        sunny: { name: "Naruto (Sage Mode)", symbol: "☀️", badge: "SAGE ENERGY", desc: "Gathering natural energy in the sun!" },
        rainy: { name: "Kakashi Hatake", symbol: "🌧️", badge: "ANBU SHINOBI", desc: "Mission underway in the misty rain." },
        thunder: { name: "Sasuke (Kirin)", symbol: "⚡", badge: "LIGHTNING BLADE", desc: "Channeling lightning for Kirin!" },
        snowy: { name: "Haku", symbol: "❄️", badge: "DEMONIC ICE", desc: "Ice mirrors freezing the snowfall." },
        default: { name: "Naruto Uzumaki", symbol: "🍥", badge: "HIDDEN LEAF", desc: "Dattebayo!" }
    },
    doraemon: {
        sunny: { name: "Doraemon (Take-copter)", symbol: "🚁", badge: "SECRET GADGET", desc: "Flying high with the Take-copter!" },
        rainy: { name: "Doraemon (Umbrella)", symbol: "☂️", badge: "FUTURE TOOL", desc: "Holding a futuristic rain umbrella!" },
        thunder: { name: "Nobita & Gadgets", symbol: "🌩️", badge: "NOBITA'S ROOM", desc: "Hiding from the thunderstorm!" },
        snowy: { name: "Doraemon (Anywhere Door)", symbol: "🚪", badge: "ANYWHERE DOOR", desc: "Stepping through snow into winter!" },
        default: { name: "Doraemon", symbol: "🔔", badge: "FUTURE GADGET", desc: "Have a secret gadget ready!" }
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
                <div class="weather-icon-container" style="text-align: center; margin: 8px 0;">
                    <div style="font-size: 40px; margin-bottom: 2px;">${themeChar.symbol}</div>
                    <div style="font-size: 8px; background: rgba(0,0,0,0.1); display: inline-block; padding: 3px 6px; border-radius: 4px; font-weight: bold; margin-bottom: 2px;">[ ${themeChar.badge} ]</div>
                    <p class="condition-text" style="font-size: 10px; font-weight: bold;">${themeChar.name}</p>
                </div>
                <div class="weather-lore" style="font-size: 8px; text-align:center; color:#222; margin-top:-2px;">
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

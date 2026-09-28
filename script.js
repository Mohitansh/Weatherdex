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

// --- FOOLPROOF STABLE ANIME DATABASE (No Broken Links) ---
const characterDatabase = {
    pokemon: {
        sunny: { name: "Charizard", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png", title: "KANTO FIRE DRAGON", desc: "A wild Charizard soaks up the sun!" },
        rainy: { name: "Squirtle", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png", title: "WATER POKÉMON", desc: "A wild Squirtle enjoys the heavy rain!" },
        thunder: { name: "Pikachu", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png", title: "ELECTRIC MOUSE", desc: "Pikachu charges up in the thunderstorm!" },
        snowy: { name: "Alolan Vulpix", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/37-alola.png", title: "SNOW FOX", desc: "Alolan Vulpix frolics in the snow!" },
        default: { name: "Pikachu", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png", title: "POKÉ-DEX SCANNER", desc: "Scanning weather conditions..." }
    },
    dbz: {
        sunny: { name: "Super Saiyan Goku", icon: "💥", title: "SUPER SAIYAN GOD", desc: "Power level rising under blazing sun!" },
        rainy: { name: "Goku (Blue Aura)", icon: "🌊", title: "SSB INTENSE TRAINING", desc: "Training intensely through the downpour!" },
        thunder: { name: "Majin Vegeta", icon: "⚡", title: "PRINCE OF SAIYANS", desc: "Lightning strikes across the battlefield!" },
        snowy: { name: "Gohan (Winter)", icon: "🏔️", title: "ROOM OF SPIRIT", desc: "Meditating calmly in freezing winds!" },
        default: { name: "Goku", icon: "🥋", title: "EARTH'S DEFENDER", desc: "Ready for battle!" }
    },
    naruto: {
        sunny: { name: "Naruto (Sage Mode)", icon: "☀️", title: "HOKAGE SAGE", desc: "Gathering natural energy in the sun!" },
        rainy: { name: "Kakashi Hatake", icon: "🌧️", title: "ANBU SHINOBI", desc: "Mission underway in the misty rain." },
        thunder: { name: "Sasuke (Kirin)", icon: "⚡", title: "LIGHTNING BLADE", desc: "Channeling lightning for Kirin!" },
        snowy: { name: "Haku", icon: "❄️", title: "DEMONIC ICE MIRROR", desc: "Ice mirrors freezing the snowfall." },
        default: { name: "Naruto Uzumaki", icon: "🍥", title: "HIDDEN LEAF HERO", desc: "Dattebayo!" }
    },
    doraemon: {
        sunny: { name: "Doraemon (Take-copter)", icon: "🚁", title: "FUTURE CAT ROBOT", desc: "Flying high with the Take-copter!" },
        rainy: { name: "Doraemon (Umbrella)", icon: "☂️", title: "FUTURE GADGET USER", desc: "Holding a futuristic rain umbrella!" },
        thunder: { name: "Nobita & Gadgets", icon: "🌩️", title: "NOBITA'S ROOM", desc: "Hiding from the thunderstorm!" },
        snowy: { name: "Doraemon (Anywhere Door)", icon: "🚪", title: "ANYWHERE DOOR", desc: "Stepping through snow into winter!" },
        default: { name: "Doraemon", icon: "🔔", title: "FUTURE GADGETRY", desc: "Have a secret gadget ready!" }
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

        // Precise weather condition code mapping
        if (code === 0) { conditionKey = 'sunny'; conditionText = 'Clear Sky'; }
        else if (code >= 1 && code <= 3) { conditionKey = 'sunny'; conditionText = 'Sunny / Cloudy'; }
        else if (code >= 51 && code <= 55) { conditionKey = 'rainy'; conditionText = 'Light Drizzle'; }
        else if (code >= 56 && code <= 65) { conditionKey = 'rainy'; conditionText = 'Heavy Rain Showers'; }
        else if (code >= 66 && code <= 67) { conditionKey = 'rainy'; conditionText = 'Freezing Rain'; }
        else if (code >= 71 && code <= 77) { conditionKey = 'snowy'; conditionText = 'Snowfall'; }
        else if (code >= 95) { conditionKey = 'thunder'; conditionText = 'Thunderstorm Active'; }

        const themeChar = characterDatabase[currentTheme][conditionKey] || characterDatabase[currentTheme].default;

        // Render layout handling image vs stylized retro icons dynamically
        let mediaHtml = '';
        if (themeChar.img) {
            mediaHtml = `<img src="${themeChar.img}" alt="${themeChar.name}" style="width: 45px; height: 45px; object-fit: contain;">`;
        } else {
            mediaHtml = `<span style="font-size: 32px;">${themeChar.icon}</span>`;
        }

        weatherDisplay.innerHTML = `
            <div class="weather-result">
                <div class="weather-top">
                    <span class="city-name">${name}, ${country || ''}</span>
                    <span class="temp-val">${Math.round(current.temperature_2m)}°C</span>
                </div>
                
                <div class="anime-character-card">
                    <div class="anime-avatar-box">${mediaHtml}</div>
                    <div class="anime-name-tag">${themeChar.name}</div>
                    <div style="font-size: 8px; color: #b00; font-weight: bold; margin-top: 2px;">⚡ ${conditionText.toUpperCase()} ⚡</div>
                    <div style="font-size: 7px; color: #444; margin-top: 1px;">★ ${themeChar.title} ★</div>
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

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

// --- COMPLETE CHARACTER & ARTWORK DATABASE ---
const characterDatabase = {
    pokemon: {
        sunny: { name: "Charizard", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png", fallback: "🐲", title: "KANTO FIRE DRAGON", desc: "A wild Charizard soaks up the sun!" },
        rainy: { name: "Squirtle", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png", fallback: "🐢", title: "WATER POKÉMON", desc: "A wild Squirtle enjoys the heavy rain!" },
        thunder: { name: "Pikachu", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png", fallback: "⚡", title: "ELECTRIC MOUSE", desc: "Pikachu charges up in the thunderstorm!" },
        snowy: { name: "Alolan Vulpix", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/37-alola.png", fallback: "🦊", title: "SNOW FOX", desc: "Alolan Vulpix frolics in the snow!" },
        default: { name: "Pikachu", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png", fallback: "🔴", title: "POKÉ-DEX SCANNER", desc: "Scanning weather conditions..." }
    },
    dbz: {
        sunny: { name: "Super Saiyan Goku", img: "https://upload.wikimedia.org/wikipedia/en/2/2e/Goku_Dragon_Ball.png", fallback: "💥", title: "SAIYAN WARRIOR", desc: "Power level rising under blazing sun!" },
        rainy: { name: "Blue Aura Goku", img: "https://upload.wikimedia.org/wikipedia/en/2/2e/Goku_Dragon_Ball.png", fallback: "🌊", title: "SUPER SAIYAN BLUE", desc: "Training intensely through the downpour!" },
        thunder: { name: "Majin Vegeta", img: "https://upload.wikimedia.org/wikipedia/en/2/2e/Goku_Dragon_Ball.png", fallback: "⚡", title: "PRINCE OF SAIYANS", desc: "Lightning strikes across the battlefield!" },
        snowy: { name: "Gohan (Winter)", img: "https://upload.wikimedia.org/wikipedia/en/2/2e/Goku_Dragon_Ball.png", fallback: "🏔️", title: "HALF-SAIYAN KEEPER", desc: "Meditating calmly in freezing winds!" },
        default: { name: "Goku", img: "https://upload.wikimedia.org/wikipedia/en/2/2e/Goku_Dragon_Ball.png", fallback: "🥋", title: "EARTH'S DEFENDER", desc: "Ready for battle!" }
    },
    naruto: {
        sunny: { name: "Naruto (Sage Mode)", img: "https://upload.wikimedia.org/wikipedia/en/9/94/Naruto_cover_vol_1.jpg", fallback: "☀️", title: "HOKAGE SAGE", desc: "Gathering natural energy in the sun!" },
        rainy: { name: "Kakashi Hatake", img: "https://upload.wikimedia.org/wikipedia/en/9/94/Naruto_cover_vol_1.jpg", fallback: "🌧️", title: "COPY NINJA", desc: "Mission underway in the misty rain." },
        thunder: { name: "Sasuke Uchiha", img: "https://upload.wikimedia.org/wikipedia/en/9/94/Naruto_cover_vol_1.jpg", fallback: "⚡", title: "AVENGING SHINOBI", desc: "Channeling lightning for Kirin!" },
        snowy: { name: "Haku", img: "https://upload.wikimedia.org/wikipedia/en/9/94/Naruto_cover_vol_1.jpg", fallback: "❄️", title: "ICE MIRROR MASTER", desc: "Ice mirrors freezing the snowfall." },
        default: { name: "Naruto Uzumaki", img: "https://upload.wikimedia.org/wikipedia/en/9/94/Naruto_cover_vol_1.jpg", fallback: "🍥", title: "HIDDEN LEAF HERO", desc: "Dattebayo!" }
    },
    doraemon: {
        sunny: { name: "Doraemon (Take-copter)", img: "https://upload.wikimedia.org/wikipedia/en/c/c9/Doraemon_character.png", fallback: "🚁", title: "FUTURE CAT ROBOT", desc: "Flying high with the Take-copter!" },
        rainy: { name: "Doraemon (Umbrella)", img: "https://upload.wikimedia.org/wikipedia/en/c/c9/Doraemon_character.png", fallback: "☂️", title: "SECRET GADGET USER", desc: "Holding a futuristic rain umbrella!" },
        thunder: { name: "Nobita & Gadgets", img: "https://upload.wikimedia.org/wikipedia/en/c/c9/Doraemon_character.png", fallback: "🌩️", title: "NOBITA'S ROOM", desc: "Hiding from the thunderstorm!" },
        snowy: { name: "Doraemon (Anywhere Door)", img: "https://upload.wikimedia.org/wikipedia/en/c/c9/Doraemon_character.png", fallback: "🚪", title: "ANYWHERE DOOR", desc: "Stepping through snow into winter!" },
        default: { name: "Doraemon", img: "https://upload.wikimedia.org/wikipedia/en/c/c9/Doraemon_character.png", fallback: "🔔", title: "FUTURE GADGETRY", desc: "Have a secret gadget ready!" }
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
                
                <div class="anime-character-card">
                    <div class="anime-avatar-box">
                        <img src="${themeChar.img}" alt="${themeChar.name}" style="width: 45px; height: 45px; object-fit: contain; image-rendering: pixelated;" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';">
                        <span style="display:none; font-size: 30px;">${themeChar.fallback}</span>
                    </div>
                    <div class="anime-name-tag">${themeChar.name}</div>
                    <div style="font-size: 7px; color: #444; margin-top: 2px;">★ ${themeChar.title} ★</div>
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

const time = document.getElementById("time");

const dayNames = {
    "en": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "ru": ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
    "esp": ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
};

const hourMs = 3600000;

var settings = {
    timeOffset: 0,
    language: "en",
    rotationEnabled: true,
    autoRipple: true
};

var elements = {
    weekday: document.getElementById("weekday"),
    date: document.getElementById("date"),
    gradientFill: document.querySelector(".gradient-fill"),
    bgVideo: document.querySelector("#background-vid"),
    audioLayer: document.getElementById("audio-layer")
};


var propertyApplier = new PropertyApplier(settings, elements);
var audioAnalyzer = new AudioAnalyzer(elements.audioLayer);
var wallpaperEffects = new WallpaperEffects(elements.date);

let initialDate = getDate();
var seconds = new Counter(initialDate.getSeconds());
var minutes = new Counter(initialDate.getMinutes());
var hours = new Counter(initialDate.getHours());

var lastRippleTime = 0;

elements.audioLayer.analyzer = audioAnalyzer;
elements.audioLayer.width = window.innerWidth;
elements.audioLayer.height = window.innerHeight;

window.wallpaperPropertyListener = {
    applyUserProperties: function(prop) {
        propertyApplier.updateProperties(prop);
    }
};

if (window.wallpaperRegisterAudioListener) {
    window.wallpaperRegisterAudioListener(function(levels) {
        audioAnalyzer.draw(levels);
    });
}

time.append(
    hours.element(),
    Counter.separator(":"),
    minutes.element(),
    Counter.separator(":"),
    seconds.element()
);

document.addEventListener("mousemove", function (e) {
    if (settings.rotationEnabled) wallpaperEffects.rotateTime(e.clientX, e.clientY);
});
document.addEventListener("mousedown", (e) => {
    if (!settings.autoRipple) wallpaperEffects.spawnRipple(e.clientX, e.clientY, settings.autoRipple);
});

window.requestAnimationFrame(frameUpdate);

function frameUpdate(_time) {
    let date = getDate();

    wallpaperEffects.updateCounter(seconds, date.getSeconds());
    wallpaperEffects.updateCounter(minutes, date.getMinutes());
    wallpaperEffects.updateCounter(hours, date.getHours());

    if (elements.weekday.style.display != "none") {
        elements.weekday.textContent = dayNames[settings.language][date.getDay()];
    }

    if (settings.autoRipple && _time - lastRippleTime >= 300) {
        lastRippleTime = _time;
        wallpaperEffects.spawnRipple(undefined, undefined, settings.autoRipple);
    }

    window.requestAnimationFrame(frameUpdate);
}

function getDate() {
    return new Date(Date.now() + settings.timeOffset);
}

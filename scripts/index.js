// constants
const time = document.getElementById("time");
const audioLayerContext = document.getElementById("audio-layer").getContext("2d");
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const hourMs = 3600000;

// declarations
var values = {
    timeOffset: 0,
    rotationEnabled: true,
    autoRipple: true,
    drawAudio: true,
    weekday: document.getElementById("weekday"),
    date: document.getElementById("date"),
    gradientFill: document.querySelector(".gradient-fill"),
    bgVideo: document.querySelector("#background-vid")
};

var propertyApplier = new PropertyApplier(values);
var audioAnalyzer = new AudioAnalyzer();
var wallpaperEffects = new WallpaperEffects();

let initialDate = getDate();
var seconds = new Counter(initialDate.getSeconds());
var minutes = new Counter(initialDate.getMinutes());
var hours = new Counter(initialDate.getHours());

var lastRippleTime = 0;

window.wallpaperPropertyListener = {
    applyUserProperties: function(prop) {
        propertyApplier.updateProperties(prop);
    }
};

window.wallpaperRegisterAudioListener(function(data) {
    if (values.drawAudio === true)
        audioAnalyzer.draw(data, audioLayerContext);
});

time.append(
    hours.element(),
    Counter.separator(":"),
    minutes.element(),
    Counter.separator(":"),
    seconds.element()
);

document.addEventListener("mousemove", function (e) {
    if (values.rotationEnabled) wallpaperEffects.rotateTime(e.clientX, e.clientY);
});
document.addEventListener("mousedown", (e) => {
    if (!values.autoRipple) wallpaperEffects.spawnRipple(e.clientX, e.clientY, values.autoRipple);
});

window.requestAnimationFrame(frameUpdate);

// declarations
function frameUpdate(_time) {
    let date = getDate();

    wallpaperEffects.updateCounter(seconds, date.getSeconds());
    wallpaperEffects.updateCounter(minutes, date.getMinutes());
    wallpaperEffects.updateCounter(hours, date.getHours());

    if (values.weekday.style.display != "none")
        values.weekday.textContent = days[date.getDay()];

    if (values.autoRipple && _time - lastRippleTime >= 300) {
        lastRippleTime = _time;
        wallpaperEffects.spawnRipple(undefined, undefined, values.autoRipple);
    }

    window.requestAnimationFrame(frameUpdate);
}

function getDate() {
    return new Date(Date.now() + values.timeOffset);
}

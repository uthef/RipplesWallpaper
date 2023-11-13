// constants
const time = document.getElementById("time");
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const hourMs = 3600000;

// declarations
var values = {
    timeOffset: 0,
    rotationEnabled: true,
    autoRipple: true,
    weekday: document.getElementById("weekday"),
    date: document.getElementById("date"),
    gradientFill: document.querySelector(".gradient-fill"),
    bgVideo: document.querySelector("#background-vid")
};

var propertyApplier = new PropertyApplier(values);
var wallpaperEffects = new WallpaperEffects();

var seconds = new Counter();
var minutes = new Counter();
var hours = new Counter();

var lastRippleTime = 0;

// initialization
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

window.wallpaperPropertyListener = {
    applyUserProperties: function(prop) {
        propertyApplier.updateProperties(prop);
    }
};

window.requestAnimationFrame(frameUpdate);

// declarations
function frameUpdate(_time) {
    let date = new Date(Date.now() + values.timeOffset);

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

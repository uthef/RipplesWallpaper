const time = document.getElementById("time");
const date = document.getElementById("date");
const weekday = document.getElementById("weekday");
const rotationLimit = 100;
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const hourMs = 3600000;

var seconds = new Counter();
var minutes = new Counter();
var hours = new Counter();

var lastRippleTime = 0;

var timeOffset = 0;
var rotationEnabled = true;
var autoRipple = true;

time.append(
    hours.element(),
    Counter.separator(":"),
    minutes.element(),
    Counter.separator(":"),
    seconds.element()
);

document.addEventListener("mousemove", onMouseMove);
document.addEventListener("mousedown", (e) => {
    if (!autoRipple) spawnRipple(e.clientX, e.clientY);
});

window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        if (properties.rotatetime) {
            rotationEnabled = properties.rotatetime.value;

            if (!rotationEnabled && date.hasAttribute("style")) {
                date.removeAttribute("style");
            }
        }

        if (properties.displaydayofweek) {
            weekday.style.display = properties.displaydayofweek.value ? "block" : "none";
        }

        if (properties.timeoffset) {
            timeOffset = properties.timeoffset.value * hourMs;
        }
    },
};

window.requestAnimationFrame(frameUpdate);

function frameUpdate(_time) {
    let date = new Date(Date.now() + timeOffset);

    updateCounter(seconds, date.getSeconds());
    updateCounter(minutes, date.getMinutes());
    updateCounter(hours, date.getHours());

    if (weekday.style.display != "none")
        weekday.textContent = days[date.getDay()];

    if (autoRipple && _time - lastRippleTime >= 300) {
        lastRippleTime = _time;
        spawnRipple();
    }

    window.requestAnimationFrame(frameUpdate);
}

function onMouseMove(e) {
    if (!rotationEnabled) return;

    const x = e.clientX / window.innerWidth - 0.5;
    const y = -(e.clientY / window.innerHeight - 0.5);

    const rotationX = y * rotationLimit;
    const rotationY = x * rotationLimit;

    date.style.transform = `translate(-50%, -50%) perspective(1000px) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
}

function spawnRipple(x, y) {
    let ripple = document.createElement("div");
    ripple.setAttribute("class", "ripple");

    ripple.style.top = y ? y + "px" : Math.floor(Math.random() * 100) + "%";
    ripple.style.left = x ? x + "px" : Math.floor(Math.random() * 100) + "%";

    ripple.addEventListener("animationend", () => ripple.remove());

    document.body.appendChild(ripple);
}

function updateCounter(counter, value) {
    if (counter.lastValue() != value) {
        counter.push(value, false);
    }
}

// constants
const time = document.getElementById("time");
const rotationLimit = 100;
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const rippleSizes = ["small", "medium", "big"];
const hourMs = 3600000;
const propertyApplier = new PropertyApplier(values);

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

document.addEventListener("mousemove", onMouseMove);
document.addEventListener("mousedown", (e) => {
    if (!values.autoRipple) spawnRipple(e.clientX, e.clientY);
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

    updateCounter(seconds, date.getSeconds());
    updateCounter(minutes, date.getMinutes());
    updateCounter(hours, date.getHours());

    if (values.weekday.style.display != "none")
        values.weekday.textContent = days[date.getDay()];

    if (values.autoRipple && _time - lastRippleTime >= 300) {
        lastRippleTime = _time;
        spawnRipple();
    }

    window.requestAnimationFrame(frameUpdate);
}

function onMouseMove(e) {
    if (!values.rotationEnabled) return;

    const x = e.clientX / window.innerWidth - 0.5;
    const y = -(e.clientY / window.innerHeight - 0.5);

    const rotationX = y * rotationLimit;
    const rotationY = x * rotationLimit;

    values.date.style.transform = `translate(-50%, -50%) perspective(1000px) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
}

function spawnRipple(x, y) {
    let ripple = document.createElement("div");
    let sizeIndex = rippleSizes.length - 1;

    ripple.classList.add("ripple");

    if (values.autoRipple) sizeIndex = randomNumber(rippleSizes.length);
    else ripple.classList.add("quick");

    ripple.classList.add(rippleSizes[sizeIndex]);

    ripple.style.top = y ? y + "px" : randomNumber(101) + "%";
    ripple.style.left = x ? x + "px" : randomNumber(101) + "%";

    ripple.addEventListener("animationend", () => ripple.remove());

    document.body.appendChild(ripple);
}

function randomNumber(limit) {
    return Math.floor(Math.random() * limit);
}

function updateCounter(counter, value) {
    if (counter.lastValue() != value) {
        counter.push(value, false);
    }
}

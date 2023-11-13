class WallpaperEffects {
    rotationLimit = 100;
    rippleSizes = ["small", "medium", "big"];

    rotateTime(clientX, clientY) {
        const x = clientX / window.innerWidth - 0.5;
        const y = -(clientY / window.innerHeight - 0.5);

        const rotationX = y * this.rotationLimit;
        const rotationY = x * this.rotationLimit;

        values.date.style.transform = `translate(-50%, -50%) perspective(1000px) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    }

    spawnRipple(x, y, autoRipple) {
        let ripple = document.createElement("div");
        let sizeIndex = this.rippleSizes.length - 1;

        ripple.classList.add("ripple");

        if (autoRipple) sizeIndex = this.randomNumber(this.rippleSizes.length);
        else ripple.classList.add("quick");

        ripple.classList.add(this.rippleSizes[sizeIndex]);

        ripple.style.top = y ? y + "px" : this.randomNumber(101) + "%";
        ripple.style.left = x ? x + "px" : this.randomNumber(101) + "%";

        ripple.addEventListener("animationend", () => ripple.remove());

        document.body.appendChild(ripple);
    }

    randomNumber(limit) {
        return Math.floor(Math.random() * limit);
    }

    updateCounter(counter, value) {
        if (counter.lastValue() != value) {
            counter.push(value, false);
        }
    }
}

class PropertyApplier {
    constructor(valuesRef) {
        this.values = valuesRef;
    }

    updateProperties(properties) {
        if (properties.rotatetime) {
            this.values.rotationEnabled = properties.rotatetime.value;

            if (!this.values.rotationEnabled && this.values.date.hasAttribute("style")) {
                this.values.date.removeAttribute("style");
            }
        }

        if (properties.displaydayofweek) {
            this.values.weekday.style.display = properties.displaydayofweek.value ? "block" : "none";
        }

        if (properties.houroffset) {
            this.values.timeOffset = properties.houroffset.value * hourMs;
        }

        if (properties.ripplemode) {
            this.values.autoRipple = properties.ripplemode.value.toLowerCase() === "true";
        }

        if (properties.backgroundimage) {
            this.imagePath = properties.backgroundimage.value;
        }

        if (properties.backgroundvideo) {
            this.videoPath = properties.backgroundvideo.value;
        }

        if (properties.background) {
            this.mode = Number(properties.background.value);
        }

        if (properties.backgroundimage || properties.backgroundvideo || properties.background) {
            switch (this.mode) {
                // Gradient only
                case 0:
                    this.setVideoVisibility(false, this.values.bgVideo);
                    this.setBackgroundVisibility(false);
                    break;
                // Gradient + image
                case 1:
                    this.setVideoVisibility(false, this.values.bgVideo);
                    this.setBackgroundVisibility(true);
                    break;
                // Gradient + video
                case 2:
                    this.setBackgroundVisibility(false);
                    this.setVideoVisibility(true, this.values.bgVideo);
            }
        }
    }

    setVideoVisibility(value, element) {
        if (value === true) {
            element.style.display = "block";
            element.src = this.videoPath === "" ? "samples/particles.webm" : this.getFilePath(this.videoPath);
            this.setGradientFillTransparency(true);
            return;
        }

        element.src = "";
        element.style.display = "none";
        this.setGradientFillTransparency(false);
    }

    setBackgroundVisibility(value) {
        if (value === true) {
            let path = this.imagePath === "" ? "samples/mountains.jpg" : this.getFilePath(this.imagePath);
            document.body.style.backgroundImage = `url('${path}')`;
            this.setGradientFillTransparency(true);
            console.log("image");
            return;
        }

        document.body.style.removeProperty("background-image");
        this.setGradientFillTransparency(false);
    }

    getFilePath(propertyValue) {
        return "file:///" + decodeURI(propertyValue);
    }

    setGradientFillTransparency(value) {
        if (value === true) {
            if (!this.values.gradientFill.classList.contains("semitransparent")) {
                this.values.gradientFill.classList.add("semitransparent");
            }

            return;
        }

        this.values.gradientFill.classList.remove("semitransparent");
    }
}

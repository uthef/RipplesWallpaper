class PropertyApplier {
    constructor(settingsRef, elementsRef) {
        this.settings = settingsRef;
        this.elements = elementsRef;
    }

    updateProperties(properties) {
        if (properties.rotatetime) {
            this.settings.rotationEnabled = properties.rotatetime.value;

            if (!this.settings.rotationEnabled && this.elements.date.hasAttribute("style")) {
                this.elements.date.removeAttribute("style");
            }
        }

        if (properties.audioprocessing) {
            this.settings.drawAudio = false;

            if (this.settings.drawAudio === false) {
                this.elements.audioLayer.analyzer.clear();
            }
        }

        if (properties.language) {
            this.settings.language = properties.language.value;
        }

        if (properties.displaydayofweek) {
            this.elements.weekday.style.display = properties.displaydayofweek.value ? "block" : "none";
        }

        if (properties.houroffset) {
            this.settings.timeOffset = properties.houroffset.value * hourMs;
        }

        if (properties.ripplemode) {
            this.settings.autoRipple = properties.ripplemode.value.toLowerCase() === "true";
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
                    this.setVideoVisibility(false, this.elements.bgVideo);
                    this.setBackgroundVisibility(false);
                    break;
                // Gradient + image
                case 1:
                    this.setVideoVisibility(false, this.elements.bgVideo);
                    this.setBackgroundVisibility(true);
                    break;
                // Gradient + video
                case 2:
                    this.setBackgroundVisibility(false);
                    this.setVideoVisibility(true, this.elements.bgVideo);
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
            if (!this.elements.gradientFill.classList.contains("semitransparent")) {
                this.elements.gradientFill.classList.add("semitransparent");
            }

            return;
        }

        this.elements.gradientFill.classList.remove("semitransparent");
    }
}

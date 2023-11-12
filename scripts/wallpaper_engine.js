var imagePath = "", videoPath = "", mode = 0;

function onPropertiesUpdate(properties, values) {
    if (properties.rotatetime) {
        values.rotationEnabled = properties.rotatetime.value;

        if (!values.rotationEnabled && values.date.hasAttribute("style")) {
            values.date.removeAttribute("style");
        }
    }

    if (properties.displaydayofweek) {
        values.weekday.style.display = properties.displaydayofweek.value ? "block" : "none";
    }

    if (properties.houroffset) {
        values.timeOffset = properties.houroffset.value * hourMs;
    }

    if (properties.ripplemode) {
        values.autoRipple = properties.ripplemode.value.toLowerCase() === "true";
    }

    if (properties.backgroundimage) {
        imagePath = properties.backgroundimage.value;
    }

    if (properties.backgroundvideo) {
        videoPath = properties.backgroundvideo.value;
    }

    if (properties.background) {
        mode = Number(properties.background.value);
    }

    if (properties.backgroundimage || properties.backgroundvideo || properties.background) {
        switch (mode) {
            // Gradient only
            case 0:
                setVideoVisibility(false, values.bgVideo);
                setBackgroundVisibility(false);
                break;
            // Gradient + image
            case 1:
                setVideoVisibility(false, values.bgVideo);
                setBackgroundVisibility(true);
                break;
            // Gradient + video
            case 2:
                setBackgroundVisibility(false);
                setVideoVisibility(true, values.bgVideo);
        }
    }
}

function setVideoVisibility(value, element) {
    if (value === true && videoPath !== "") {
        element.style.display = "block";
        element.src = getFilePath(videoPath);

        if (!values.gradientFill.classList.contains("semitransparent")) {
            values.gradientFill.classList.add("semitransparent");
        }

        return;
    }

    element.src = "";
    element.style.display = "none";
    values.gradientFill.classList.remove("semitransparent");
}

function setBackgroundVisibility(value) {
    if (value === true && imagePath !== "") {
        document.body.style.backgroundImage = `url('${getFilePath(imagePath)}')`;

        if (!values.gradientFill.classList.contains("semitransparent")) {
            values.gradientFill.classList.add("semitransparent");
        }

        return;
    }

    document.body.style.removeProperty("background-image");
    values.gradientFill.classList.remove("semitransparent");
}

function getFilePath(propertyValue) {
    return "file:///" + decodeURI(propertyValue);
}

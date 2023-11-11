class Counter {
    constructor(value, places) {
        this.places = places ?? 2;
        this._queue = [];
        this._lastValue = value ?? 0;

        let container = document.createElement("div");
        container.classList.add("counter");
        container.appendChild(this.createNumber(this._lastValue));

        this._element = container;
    }

    formatValue(value) {
        let string = value.toString();
        return "0".repeat(Math.max(0, this.places - string.length)) + string;
    }

    createNumber(value) {
        let number = document.createElement("div");
        number.textContent = this.formatValue(value);
        return number;
    }

    push(newValue, queue) {
        queue = queue ?? true;

        if (this._element.childNodes.length <= 1) {
            let number = this.createNumber(newValue);
            this._element.appendChild(number);
            let prevSibling = number.previousSibling;

            prevSibling.classList.add("shift");
            this._lastValue = newValue;

            prevSibling.addEventListener("transitionend", (_e) => {
                prevSibling.remove();

                if (this._queue.length > 0) {
                    this.push(this._queue.shift());
                }
            });

            return;
        }

        if (queue === true) {
            this._queue.push(newValue);
        }
    }

    element() {
        return this._element;
    }

    lastValue() {
        return this._lastValue;
    }

    static separator(content) {
        let separator = document.createElement("div");
        separator.setAttribute("class", "counter separator");
        separator.textContent = content ?? "";

        return separator;
    }
}

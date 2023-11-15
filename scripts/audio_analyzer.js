class AudioAnalyzer {
    gap = 5;
    sensitivity = 2;

    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
    }

    draw(levels) {
        this.clear();

        let barWidth = (this.canvas.width / levels.length) * 2.5 / 2;
        let barHeight;
        let x = -this.gap * levels.length;

        this.context.fillStyle = 'rgba(255, 255, 255, 0.1)';

        for (let level of levels) {
            barHeight = level * (this.canvas.height * this.sensitivity);
            this.context.fillRect(x, this.canvas.height - barHeight / 2, barWidth, barHeight);
            x += barWidth + this.gap;
        }
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

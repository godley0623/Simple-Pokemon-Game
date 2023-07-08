export class HealthBar {
    constructor (element, initialValue = 100) {
        this.valueElem = element.querySelector('.health-bar-value');
        this.fillElem = element.querySelector('.health-bar-fill');

        this.setValue(initialValue);
    }

    setValue (newValue) {
        if (newValue > 100) newValue = 100;
        if (newValue < 0) newValue = 0;

        this.value = newValue;
        this.update();
    }

    update () {
        const percentage = this.value + '%';
        
        this.fillElem.style.width = percentage;
        this.valueElem.textContent = percentage;
    }
}
import { LightropeBase } from '../index.js';

customElements.define('lr-counter',
    class LightropeCounter extends LightropeBase {
        connect() {
            this.counter = this.target('counter.count');
        }

        get count() {
            return +this.counter.innerHTML;
        }

        inc() {
            this.counter.innerHTML = this.count + 1;
            this.dispatchEvent(new CustomEvent('counter.inc', { detail: { count: this.count } }));
        }
    }
);

customElements.define('lr-counter-group',
    class LightropeCounterGroup extends LightropeBase {
        connect() {
            this.addCounter();
            this.computeSum();
        }

        computeSum() {
            this.total = this.target('counter-group.total');
            const sum = this.targets('counter-group.counter').reduce((sum, n) => sum + n.count, 0);
            this.total.innerHTML = sum;
        }

        addCounter() {
            const template = this.target('counter-group.template').content;
            const group = this.target('counter-group.counters');
            group.appendChild(template.cloneNode(true));
        }
    }
);
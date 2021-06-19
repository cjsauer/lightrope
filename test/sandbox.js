import { LightropeBase } from '../index.js';

customElements.define('lr-counter',
    class LightropeCounter extends LightropeBase {
        static attributes = {
            count: Number
        }

        countChanged(newCnt) {
            this.target('counter.count').textContent = newCnt;
            this.dispatchEvent(new CustomEvent('counter.inc', { detail: { count: this.count() } }));
        }

        inc() {
            this.setAttribute('count', this.count() + 1);
        }
    }
);

customElements.define('lr-counter-group',
    class LightropeCounterGroup extends LightropeBase {
        static attributes = {
            total: Number
        }

        connect() {
            this.addCounter();
            this.computeSum();
        }

        totalChanged(newTotal) {
            this.target('counter-group.total').textContent = newTotal;
        }

        computeSum() {
            const sum = this.targets('counter-group.counter').reduce((sum, n) => sum + n.count(), 0);
            this.setAttribute('total', sum);
        }

        addCounter() {
            const template = this.target('counter-group.template').content;
            const group = this.target('counter-group.counters');
            group.appendChild(template.cloneNode(true));
            this.computeSum();
        }
    }
);
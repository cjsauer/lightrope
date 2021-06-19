# Lightrope

[![npm version](https://badge.fury.io/js/lightrope.svg)](https://badge.fury.io/js/lightrope)

Check out the [Live Demo](https://angry-sinoussi-e727a0.netlify.app/test/)

```html
<lr-counter-group total="0" data-action="counter.inc->counter-group.computeSum" class="counter-group">
    <h3>Counter total: <span data-target="counter-group.total"></span></h3>
    <div data-target="counter-group.counters"></div>
    <div>
        <button data-action="click->counter-group.addCounter">Add Counter</button>
    </div>
    <template data-target="counter-group.template">
        <lr-counter count="10" data-target="counter-group.counter" class="counter">
            <span data-target="counter.count"></span>
            <button data-action="click->counter.inc">Increment</button>
        </lr-counter>
    </template>
</lr-counter-group>
```

```javascript
import { LightropeBase } from 'lightrope';

customElements.define('lr-counter',
    class LightropeCounter extends LightropeBase {
        static attributes = {
            count: Number
        }

        countChanged(newCnt) {
            this.target('counter.count').textContent = newCnt;
            this.dispatchEvent(new CustomEvent('counter.inc'));
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
```
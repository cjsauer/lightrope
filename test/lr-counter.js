import { LightropeBase } from '../index.js';

customElements.define('lr-counter',
    class extends LightropeBase {
        inc() {
            const count = this.target('count');
            let cnt = +count.innerHTML;
            count.innerHTML = cnt + 1;
        }
    }
);
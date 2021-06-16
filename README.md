# Lightrope

[![npm version](https://badge.fury.io/js/lightrope.svg)](https://badge.fury.io/js/lightrope)

```html
<body>
  <lr-counter>
    <p data-target="count">0</p>
    <button data-action="click->inc">Do thing!</button>
  </lr-counter>
  <script src="script.js"></script>
</body>
```

```javascript
import { LightropeBase } from 'lightrope';

customElements.define('lr-counter',
  class extends LightropeBase {
    inc() {
      const count = this.target('count');
      let cnt = +count.innerHTML;
      cnt++;
      count.innerHTML = cnt;
    }
  }
);
```
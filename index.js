function parseAction(s) {
	const [event, method] = s.split('->');
	return { event, method };
}

export class LightropeBase extends HTMLElement {
	connectedCallback() {
		// Wire up actions
		const actions = this.querySelectorAll('[data-action]');
		actions.forEach((el) => {
			const { action } = el.dataset;
			const { event, method } = parseAction(action);
			el.addEventListener(event, () => this[method].call(this));
		});
	}

	target(key) {
		return this.querySelector(`[data-target="${key}"]`);
	}

	targets(key) {
		return this.querySelectorAll(`[data-target="${key}"]`)
	}
}

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
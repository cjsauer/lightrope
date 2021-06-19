function parseAction(s) {
    const [eventName, tagMethodName] = s.split('->');
    const [tag, methodName] = tagMethodName.split('.');
    return { eventName, methodName, tag };
}

function createActionCallback(host, methodName) {
    return function (event) {
        if (host[methodName]) {
            host[methodName].call(host, event)
        } else {
            const className = host.constructor.name || '(Anonymous)'
            throw new Error(`Attempted to invoke action '${methodName}' on ${className} but it doesn't exist`);
        }
    }
}

function dropTagPrefix(tagName) {
    return tagName.slice(tagName.indexOf('-') + 1);
}

function wireUpAction(host, el) {
    const { action } = el.dataset;
    const { eventName, methodName, tag } = parseAction(action);
    if (dropTagPrefix(host.tagName).toLowerCase() === tag) {
        const callback = createActionCallback(host, methodName);
        el.addEventListener(eventName, callback, true);
        host.registeredEventListeners.push([el, eventName, callback]);
    }
}

export class LightropeBase extends HTMLElement {
    constructor() {
        super();
        this.registeredEventListeners = [];
    }

    connect() { }
    disconnect() { }

    connectedCallback() {
        // Wire up actions

        if (this.dataset.action) {
            wireUpAction(this, this);
        }

        const actionElements = this.querySelectorAll('[data-action]',);
        actionElements.forEach(el => wireUpAction(this, el));

        // Call subclass connect
        this.connect();
    }

    disconnectedCallback() {
        // Unwire actions
        this.registeredEventListeners.forEach(([el, eventName, callback]) => {
            el.removeEventListener(eventName, callback);
        });
        this.registeredEventListeners = [];

        // Call subclass disconnect
        this.disconnect();
    }

    /*
     * Subclass API
     */

    target(key) {
        return this.querySelector(`[data-target="${key}"]`);
    }

    targets(key) {
        return Array.from(this.querySelectorAll(`[data-target="${key}"]`));
    }
}
/*
 * Primary base class
 */
export class LightropeBase extends HTMLElement {
    static get observedAttributes() {
        // Automatically observe the attributes in the base class's static attributes object
        return Object.keys(this.attributes || []);
    }

    constructor() {
        super();
        this.registeredEventListeners = [];

        // Set up automatic value fetching functions from base class's static attributes object
        for (const [valName, parseFn] of Object.entries(this.constructor.attributes)) {
            this[valName] = () => tryParse(parseFn, this.getAttribute(valName));
        }
    }

    connectedCallback() {
        wireUpAllActions(this);

        // Call subclass connect
        this.connect();
    }

    disconnectedCallback() {
        unwireAllActions(this);

        // Call subclass disconnect
        this.disconnect();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            const methodName = name + 'Changed';
            const method = this[methodName];
            if (method) {
                const parseFn = this.constructor.attributes[name] || (x => x);
                method.call(this, tryParse(parseFn, newValue), tryParse(parseFn, oldValue));
            }
        }
    }

    /*
     * Subclass API
     */
    connect() { /* Override this in your base class */ }
    disconnect() {  /* Override this in your base class */ }

    target(key) {
        return this.querySelector(`[data-target="${key}"]`);
    }

    targets(key) {
        return Array.from(this.querySelectorAll(`[data-target="${key}"]`));
    }
} // END LightropeBase

/*
 * Private functions
 */
function tryParse(parseFn, value) {
    return value ? parseFn(value) : value;
}

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

function wireUpAllActions(host) {
    // Wire up any actions placed on the host component
    if (host.dataset.action) {
        wireUpAction(host, host);
    }

    // Wire up child actions
    const actionElements = host.querySelectorAll('[data-action]',);
    actionElements.forEach(el => wireUpAction(host, el));
}

function unwireAllActions(host) {
    host.registeredEventListeners.forEach(([el, eventName, callback]) => {
        el.removeEventListener(eventName, callback);
    });
    host.registeredEventListeners = [];
}
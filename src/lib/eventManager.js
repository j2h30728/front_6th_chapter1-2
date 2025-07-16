const EVENT_TYPES = ["click", "change", "input", "submit", "keydown", "keyup", "keypress", "mouseover", "focus"];

const eventListeners = new WeakMap(); // Map<eventType, handler>

export function setupEventListeners(root) {
  EVENT_TYPES.forEach((eventType) => {
    root.addEventListener(eventType, (event) => {
      let target = event.target;
      while (target && target !== root) {
        const listeners = eventListeners.get(target);
        if (listeners && listeners.has(eventType)) {
          listeners.get(eventType)(event);
          break;
        }
        target = target.parentNode;
      }
    });
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventListeners.has(element)) {
    eventListeners.set(element, new Map());
  }

  const listeners = eventListeners.get(element);
  listeners.set(eventType, handler);
}

export function removeEvent(element, eventType) {
  if (eventListeners.has(element)) {
    const listeners = eventListeners.get(element);
    listeners.delete(eventType);
    if (listeners.size === 0) {
      eventListeners.delete(element);
    }
  }
}

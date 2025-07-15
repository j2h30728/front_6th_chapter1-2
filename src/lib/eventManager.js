const EVENT_TYPES = ["click", "change", "input", "submit", "keydown", "keyup", "keypress"];

const EVENT_MAP = new WeakMap();

export function setupEventListeners(root) {
  EVENT_TYPES.forEach((eventType) => {
    root.addEventListener(eventType, (event) => {
      let target = event.target;
      while (target && target !== root) {
        const eventInfo = EVENT_MAP.get(target);
        if (eventInfo && eventInfo.eventType === eventType) {
          eventInfo.handler(event);
          break;
        }
        target = target.parentNode;
      }
    });
  });

  return () => {
    EVENT_MAP.forEach((event) => {
      removeEvent(event.element, event.eventType, event.handler);
    });
  };
}

export function addEvent(element, eventType, handler) {
  EVENT_MAP.set(element, { eventType, handler });
}

export function removeEvent(element, eventType, handler) {
  const event = EVENT_MAP.get(element);
  if (event.eventType === eventType && event.handler === handler) {
    EVENT_MAP.delete(element);
  }
}

import { removeEvent, setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const containerVNodeMap = new WeakMap();

export function renderElement(vNode, container) {
  const normalizedVNode = normalizeVNode(vNode);
  const prevVNode = containerVNodeMap.get(container);

  if (prevVNode === undefined) {
    container.innerHTML = "";
    const element = createElement(normalizedVNode);
    container.appendChild(element);
    setupEventListeners(container);
    containerVNodeMap.set(container, normalizedVNode);
  } else {
    removeEvent(container, prevVNode);
    updateElement(container, normalizedVNode, prevVNode, 0);
    containerVNodeMap.set(container, normalizedVNode);
  }
}

import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement";

function updateAttributes(target, originNewProps, originOldProps) {
  const newProps = originNewProps || {};
  const oldProps = originOldProps || {};

  Object.keys(oldProps).forEach((key) => {
    if (!(key in newProps)) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        removeEvent(target, eventType, oldProps[key]);
        return;
      }

      if (key === "className") {
        target.removeAttribute("class");
        return;
      }

      if (key === "children") {
        return;
      }

      if (["checked", "disabled", "selected", "readOnly"].includes(key)) {
        target[key] = false;
        const attrName = key === "readOnly" ? "readonly" : key;
        target.removeAttribute(attrName);
        return;
      }

      if (key === "style") {
        Object.assign(target.style, {});
        return;
      }

      target.removeAttribute(key);
    }
  });

  Object.keys(newProps).forEach((key) => {
    if (newProps[key] !== oldProps[key]) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        if (oldProps[key]) {
          removeEvent(target, eventType, oldProps[key]);
        }
        addEvent(target, eventType, newProps[key]);
        return;
      }

      if (key === "style" && typeof newProps[key] === "object") {
        Object.assign(target.style, newProps[key]);
        return;
      }

      if (["checked", "disabled", "selected", "readOnly"].includes(key)) {
        const attrName = key === "readOnly" ? "readonly" : key;
        if (newProps[key] === true) {
          target[key] = true;
          if (key === "disabled" || key === "readOnly") {
            target.setAttribute(attrName, "");
          } else {
            target.removeAttribute(attrName);
          }
        } else {
          target[key] = false;
          target.removeAttribute(attrName);
        }
        return;
      }

      if (key === "className") {
        target.setAttribute("class", newProps[key]);
        return;
      }

      if (newProps[key] === null || newProps[key] === undefined) {
        target.removeAttribute(key);
        return;
      }

      target.setAttribute(key, newProps[key]);
    }
  });
}

/**
 *
 * @param {*} parentElement
 * @param {*} newNode
 * @param {*} oldNode
 * @param {*} index
 * @returns
 */
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!newNode && oldNode) {
    const oldElement = parentElement.children[index];
    if (oldElement) {
      parentElement.removeChild(oldElement);
    }
    return;
  }

  if (!oldNode && newNode) {
    const newElement = createElement(newNode);
    parentElement.appendChild(newElement);
    return;
  }

  if (
    (typeof oldNode === "string" && typeof newNode === "string") ||
    (typeof oldNode === "number" && typeof newNode === "number")
  ) {
    if (oldNode !== newNode) {
      parentElement.textContent = String(newNode);
    }
    return;
  }

  if (newNode.type !== oldNode.type) {
    const newElement = createElement(newNode);
    const oldElement = parentElement.children[index];
    if (oldElement) {
      parentElement.replaceChild(newElement, oldElement);
    }
    return;
  }

  updateAttributes(oldNode.el, newNode.props, oldNode.props);

  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];

  for (let i = 0; i < Math.min(newChildren.length, oldChildren.length); i++) {
    updateElement(oldNode.el, newChildren[i], oldChildren[i], i);
  }

  for (let i = oldChildren.length; i < newChildren.length; i++) {
    updateElement(oldNode.el, newChildren[i], null, i);
  }

  for (let i = oldChildren.length - 1; i >= newChildren.length; i--) {
    updateElement(oldNode.el, null, oldChildren[i], i);
  }

  if (typeof newNode === "object" && newNode !== null && !Array.isArray(newNode)) {
    newNode.el = oldNode.el;
  }
}

export function createElement(vNode) {
  if (vNode === undefined || vNode === null || vNode === false || vNode === true) {
    return document.createTextNode("");
  }

  if (typeof vNode === "number" || typeof vNode === "string") {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((node) => {
      const element = document.createElement(node.type);
      if (node.props) {
        updateAttributes(element, node.props);
      }
      fragment.appendChild(element);
    });
    return fragment;
  }

  if (typeof vNode.type === "function") {
    throw new Error("컴포넌트는 직접 사용할 수 없습니다.");
  }

  if (Array.isArray(vNode.children) && vNode.children.length > 0) {
    const element = document.createElement(vNode.type);
    vNode.children.forEach((child) => {
      const childElement = createElement(child);
      if (child.props) {
        updateAttributes(childElement, child.props);
      }
      element.appendChild(childElement);
    });
    return element;
  }

  const element = document.createElement(vNode.type);
  if (vNode.props) {
    updateAttributes(element, vNode.props);
  }
  return element;
}

function updateAttributes($el, props) {
  Object.entries(props).forEach(([key, value]) => {
    if (key === "className") {
      $el.setAttribute("class", value);
      return;
    }

    if (key === "children") {
      return;
    }
    $el.setAttribute(key, value);
  });
}

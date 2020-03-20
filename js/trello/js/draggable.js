var initialX, initialY, offsetX, offsetY;
var prevX = 0;
var prevY = 0;
var initialPositionX = 0;
var initialPositionY = 0;
var active = false;
var activeButton;
var container = window;
var wrapper = document.querySelector(".board-view");
var buttons = document.querySelectorAll(".card");
var cloned;
var cloneButton;

var getSiblings = (element, type) => {
  var siblings = [];
  var sibling = element[type];
  while (sibling) {
    siblings.push(sibling);
    sibling = sibling[type];
  }
  return siblings;
};

if (wrapper) {
  wrapper.style.position = "relative";
}

container.addEventListener("mousedown", e => {
  initialX = e.clientX;
  initialY = e.clientY;
  prevX = e.clientX;
  prevY = e.clientY;
  buttons.forEach(button => {
    if (e.target === button || button.contains(event.target)) {
      activeButton = button;
      active = true;
    }
  });
  if (activeButton) {
    cloneButton = activeButton.cloneNode(true);
    cloned = document.createElement("div");
    cloned.classList.add("cloned");
    wrapper.prepend(cloned);
    cloned.appendChild(cloneButton);
    initialPositionX = activeButton.getBoundingClientRect().left;
    initialPositionY = activeButton.getBoundingClientRect().top;
    cloneButton.style.transform =
      "translate3d(" +
      initialPositionX +
      "px, " +
      initialPositionY +
      "px, 0)";
    activeButton.classList.add("dragging-active");
  }
});

container.addEventListener("mousemove", e => {
  offsetX = e.clientX - initialX + initialPositionX;
  offsetY = e.clientY - initialY + initialPositionY;
  e.preventDefault();
  if (active) {
    cloneButton.style.transform =
      "translate3d(" + offsetX + "px, " + offsetY + "px, 0)";

    if (e.clientY > prevY) {
      var nextSiblings = getSiblings(
        activeButton.parentNode,
        "nextSibling"
      );
      nextSiblings.forEach(sibling => {
        var button = sibling.firstChild;
        if (
          cloneButton.getBoundingClientRect().top >
          button.getBoundingClientRect().top
        ) {
          button.parentNode.parentNode.insertBefore(
            activeButton.parentNode,
            button.parentNode.nextSibling
          );
        }
      });
    } else if (e.clientY < prevY) {
      var previousSiblings = getSiblings(
        activeButton.parentNode,
        "previousSibling"
      );
      previousSiblings.forEach(sibling => {
        var button = sibling.firstChild;
        if (
          cloneButton.getBoundingClientRect().top <
          button.getBoundingClientRect().top
        ) {
          button.parentNode.parentNode.insertBefore(
            activeButton.parentNode,
            button.parentNode
          );
        }
      });
    } else if (e.clientX > prevX) {
      var nextLists = getSiblings(
        activeButton.closest(".list"),
        "nextSibling"
      );
      nextLists.forEach(list => {
        if (
          cloneButton.getBoundingClientRect().right >
          list.getBoundingClientRect().left + list.offsetWidth / 2
        ) {
          var firstChild = list.querySelector(".cards").firstChild;
          if (!firstChild) {
            list.querySelector(".cards").prepend(activeButton.parentNode);
          } else if (
            cloneButton.getBoundingClientRect().top <
            firstChild.getBoundingClientRect().top
          ) {
            firstChild.parentNode.insertBefore(
              activeButton.parentNode,
              firstChild
            );
          } else {
            list.querySelectorAll(".card-item").forEach(item => {
              var button = item.firstChild;
              if (
                cloneButton.getBoundingClientRect().top >
                button.getBoundingClientRect().top &&
                cloneButton.getBoundingClientRect().top <
                button.getBoundingClientRect().bottom &&
                cloneButton.getBoundingClientRect().right >
                button.getBoundingClientRect().left &&
                cloneButton.getBoundingClientRect().right <
                button.getBoundingClientRect().right
              ) {
                button.parentNode.parentNode.insertBefore(
                  activeButton.parentNode,
                  button.parentNode.nextSibling
                );
              }
            });
          }
        }
      });
    } else if (e.clientX < prevX) {
      var prevLists = getSiblings(
        activeButton.closest(".list"),
        "previousSibling"
      );
      prevLists.forEach(list => {
        if (
          cloneButton.getBoundingClientRect().left <
          list.getBoundingClientRect().left + list.offsetWidth / 2
        ) {
          var firstChild = list.querySelector(".cards").firstChild;
          if (!firstChild) {
            list.querySelector(".cards").prepend(activeButton.parentNode);
          } else if (
            cloneButton.getBoundingClientRect().top <
            firstChild.getBoundingClientRect().top
          ) {
            firstChild.parentNode.insertBefore(
              activeButton.parentNode,
              firstChild
            );
          } else {
            list.querySelectorAll(".card-item").forEach(item => {
              var button = item.firstChild;
              if (
                cloneButton.getBoundingClientRect().top >
                button.getBoundingClientRect().top &&
                cloneButton.getBoundingClientRect().top <
                button.getBoundingClientRect().bottom &&
                cloneButton.getBoundingClientRect().left <
                button.getBoundingClientRect().right &&
                cloneButton.getBoundingClientRect().left >
                button.getBoundingClientRect().left
              ) {
                button.parentNode.parentNode.insertBefore(
                  activeButton.parentNode,
                  button.parentNode.nextSibling
                );
              }
            });
          }
        }
      });
    }

    prevX = e.clientX;
    prevY = e.clientY;
  }
});

container.addEventListener("mouseup", e => {
  if (activeButton) {
    activeButton.classList.remove("dragging-active");
    activeButton = undefined;
    active = false;
    initialPositionX = 0;
    initialPositionY = 0;
    cloned.remove();
  }
});
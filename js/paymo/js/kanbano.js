(function () {
  this.Kanbano = function () {

    var defaults = {
      wrapper: 'body',
      cards: '.card',
    }

    if (arguments[0] && typeof arguments[0] === "object") {
      this.options = extendDefaults(defaults, arguments[0]);
    }
    else {
      this.options = defaults
    }

  }

  Kanbano.prototype.init = function () {

    var initialX, initialY, offsetX, offsetY;
    var prevX = 0;
    var prevY = 0;
    var initialPositionX = 0;
    var initialPositionY = 0;
    var active = false;
    var activeButton;
    var wrapper = document.querySelector(this.options.wrapper);
    var container = wrapper;
    var cloned;
    var cloneButton;



    container.addEventListener("mousedown", e => {
      var buttons = document.querySelectorAll(this.options.cards);
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
        wrapper.style.position = "relative";
        cloneButton = activeButton.cloneNode(true);
        cloned = document.createElement("div");
        cloned.classList.add("cloned");
        wrapper.prepend(cloned);
        cloned.appendChild(cloneButton);
        initialPositionX = activeButton.getBoundingClientRect().left;
        initialPositionY = activeButton.getBoundingClientRect().top;
        cloned.style.width = activeButton.offsetWidth + 'px'
        cloned.firstChild.style.margin = 0 + 'px'
        cloned.style.left = initialPositionX + 'px'
        cloned.style.top = initialPositionY + 'px'
        activeButton.classList.add("dragging-active");
      }
    });

    container.addEventListener("mousemove", e => {
      var buttons = document.querySelectorAll(this.options.cards);
      offsetX = e.clientX - initialX + initialPositionX;
      offsetY = e.clientY - initialY + initialPositionY;
      e.preventDefault();
      if (active) {
        cloned.style.left = offsetX + 'px'
        cloned.style.top = offsetY + 'px'

        buttons.forEach(button => {
          if (button !== activeButton && !button.parentNode.classList.contains('cloned')) {
            if (e.clientY > prevY) {
              if ((cloned.getBoundingClientRect().right > button.getBoundingClientRect().left && cloned.getBoundingClientRect().right < button.getBoundingClientRect().right ||
                cloned.getBoundingClientRect().left > button.getBoundingClientRect().left && cloned.getBoundingClientRect().left < button.getBoundingClientRect().right) &&
                (cloned.getBoundingClientRect().top > button.getBoundingClientRect().top && cloned.getBoundingClientRect().top < button.getBoundingClientRect().bottom ||
                  cloned.getBoundingClientRect().bottom > button.getBoundingClientRect().top && cloned.getBoundingClientRect().bottom < button.getBoundingClientRect().bottom) &&
                (cloned.getBoundingClientRect().bottom > button.getBoundingClientRect().top + button.offsetHeight / 2)
              ) {
                button.parentNode.insertBefore(
                  activeButton,
                  button.nextSibling
                );
              }
            }
            else if (e.clientY < prevY) {
              if ((cloned.getBoundingClientRect().right > button.getBoundingClientRect().left && cloned.getBoundingClientRect().right < button.getBoundingClientRect().right ||
                cloned.getBoundingClientRect().left > button.getBoundingClientRect().left && cloned.getBoundingClientRect().left < button.getBoundingClientRect().right) &&
                (cloned.getBoundingClientRect().top > button.getBoundingClientRect().top && cloned.getBoundingClientRect().top < button.getBoundingClientRect().bottom ||
                  cloned.getBoundingClientRect().bottom > button.getBoundingClientRect().top && cloned.getBoundingClientRect().bottom < button.getBoundingClientRect().bottom)
              ) {
                if (cloned.getBoundingClientRect().top > button.getBoundingClientRect().top && cloned.getBoundingClientRect().top < button.getBoundingClientRect().bottom && cloned.getBoundingClientRect().top > button.getBoundingClientRect().top + button.offsetHeight / 2) {
                  button.parentNode.insertBefore(
                    activeButton,
                    button.nextSibling
                  );
                }
                else if (cloned.getBoundingClientRect().top > button.getBoundingClientRect().top && cloned.getBoundingClientRect().top < button.getBoundingClientRect().bottom && cloned.getBoundingClientRect().top < button.getBoundingClientRect().top + button.offsetHeight / 2) {
                  button.parentNode.insertBefore(
                    activeButton,
                    button
                  );
                }
              }
            }
          }
        })

        prevX = e.clientX;
        prevY = e.clientY;
      }
    });

    container.addEventListener("mouseup", e => {
      if (activeButton) {
        activeButton.classList.remove("dragging-active");
        activeButton = undefined;
        active = false;
        wrapper.removeAttribute('style');
        initialPositionX = 0;
        initialPositionY = 0;
        cloned.remove();
      }
    });

  }

  function extendDefaults(source, properties) {
    var property;
    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }
    return source;
  }

}())

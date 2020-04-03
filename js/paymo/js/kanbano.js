(function () {
  this.Kanbano = function () {

    var defaults = {
      wrapper: 'body',
      cards: '.card',
      lists: '.list'
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
      e.preventDefault();
      if (active) {
        var centerX = cloned.getBoundingClientRect().top + cloned.offsetHeight / 2
        var centerY = cloned.getBoundingClientRect().left + cloned.offsetWidth / 2
        var lists = document.querySelectorAll(this.options.lists);
        offsetX = e.clientX - initialX + initialPositionX;
        offsetY = e.clientY - initialY + initialPositionY;
        cloned.style.left = offsetX + 'px'
        cloned.style.top = offsetY + 'px'

        lists.forEach(list => {
          var listLeft = list.getBoundingClientRect().left
          var listRight = list.getBoundingClientRect().right
          if (centerY > listLeft && centerY < listRight) {
            var cards = list.querySelectorAll(this.options.cards)
            var centers = []
            cards.forEach(button => {
              var buttonCenterX = button.getBoundingClientRect().top + cloned.offsetHeight / 2
              centers.push(Math.abs(centerX - buttonCenterX))
            })
            var index = centers.indexOf(Math.min.apply(Math, centers))
            var button = cards[index]
            if (button !== activeButton && !button.parentNode.classList.contains('cloned')) {
              if (centerX > button.getBoundingClientRect().top + cloned.offsetHeight / 2) {
                button.parentNode.insertBefore(
                  activeButton,
                  button.nextSibling
                );
              }
              else if (centerX < button.getBoundingClientRect().top + cloned.offsetHeight / 2) {
                button.parentNode.insertBefore(
                  activeButton,
                  button
                );
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

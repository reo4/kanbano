(function () {
  this.Kanbano = function () {

    var defaults = {
      board: '.board',
      cards: '.card',
      lists: '.list',
      listContent: '.list-content'
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
    var wrapper = document.body;
    var container = wrapper;
    var board = document.querySelector(this.options.board);
    var scrollBottomInterval;
    var scrollTopInterval;
    var scrollRightInterval;
    var scrollLeftInterval;
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
        wrapper.style.overflow = "hidden"
        cloneButton = activeButton.cloneNode(true);
        cloned = document.createElement("div");
        cloned.classList.add('cloned');
        cloned.style.position = 'absolute'
        cloned.style.zIndex = '1000'
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
      offsetX = e.clientX - initialX + initialPositionX;
      offsetY = e.clientY - initialY + initialPositionY;
      e.preventDefault();
      if (active) {
        var centerX = cloned.getBoundingClientRect().top + cloned.offsetHeight / 2
        var centerY = cloned.getBoundingClientRect().left + cloned.offsetWidth / 2
        var lists = document.querySelectorAll(this.options.lists);
        cloned.style.left = offsetX + 'px'
        cloned.style.top = offsetY + 'px'

        lists.forEach(list => {
          var listLeft = list.getBoundingClientRect().left
          var listRight = list.getBoundingClientRect().right
          if (centerY > listLeft && centerY < listRight) {
            var cards = list.querySelectorAll(this.options.cards)
            if (cards.length) {
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
            else {
              list.querySelector(this.options.listContent).appendChild(activeButton)
            }
          }

          if (list.contains(activeButton)) {
            var listContent = list.querySelector(this.options.listContent)

            if (cloned.getBoundingClientRect().bottom > listContent.getBoundingClientRect().bottom - 150) {
              var bottomIncrement = parseInt((cloned.getBoundingClientRect().bottom - listContent.getBoundingClientRect().bottom + 150) * .06)
              clearInterval(scrollBottomInterval)
              scrollBottomInterval = setInterval(() => {
                listContent.scrollTop = listContent.scrollTop + bottomIncrement
              }, 10)
              listContent.addEventListener('scroll', () => {
                if (listContent.scrollHeight - listContent.scrollTop === listContent.clientHeight) {
                  clearInterval(scrollBottomInterval)
                }
              })
            }
            else {
              clearInterval(scrollBottomInterval)
            }

            if (cloned.getBoundingClientRect().top < listContent.getBoundingClientRect().top + 150) {
              var topIncrement = parseInt((listContent.getBoundingClientRect().top + 150 - cloned.getBoundingClientRect().top) * .06)
              clearInterval(scrollTopInterval)
              scrollTopInterval = setInterval(() => {
                listContent.scrollTop = listContent.scrollTop - topIncrement
              }, 10)
              listContent.addEventListener('scroll', () => {
                if (listContent.scrollTop === 0) {
                  clearInterval(scrollTopInterval)
                }
              })
            }
            else {
              clearInterval(scrollTopInterval)
            }
          }
        })


        if (cloned.getBoundingClientRect().right > board.getBoundingClientRect().right - 250) {
          var rightIncrement = parseInt((cloned.getBoundingClientRect().right - board.getBoundingClientRect().right + 250) * .06)
          clearInterval(scrollRightInterval)
          scrollRightInterval = setInterval(() => {
            board.scrollLeft = board.scrollLeft + rightIncrement
          }, 10)
          board.addEventListener('scroll', () => {
            if (board.scrollWidth - board.scrollLeft === board.clientWidth) {
              clearInterval(scrollRightInterval)
            }
          })
        }
        else {
          clearInterval(scrollRightInterval)
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
        wrapper.removeAttribute('style');
        initialPositionX = 0;
        initialPositionY = 0;
        clearInterval(scrollTopInterval)
        clearInterval(scrollBottomInterval)
        clearInterval(scrollRightInterval)
        clearInterval(scrollLeftInterval)
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

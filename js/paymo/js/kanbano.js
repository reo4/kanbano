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

            if (cloned.getBoundingClientRect().bottom > listContent.getBoundingClientRect().bottom - 150 &&
              listContent.scrollHeight - listContent.scrollTop !== listContent.clientHeight
            ) {
              var bottomDifference = parseInt((wrapper.getBoundingClientRect().bottom - cloned.getBoundingClientRect().bottom) * .05)
              var bottomIncrement = parseInt((cloned.getBoundingClientRect().bottom - listContent.getBoundingClientRect().bottom + 150) * .02)
              clearInterval(scrollBottomInterval)
              scrollBottomInterval = setInterval(() => {
                console.log(90)
                listContent.scrollTop = listContent.scrollTop + bottomIncrement
              }, bottomDifference)
              listContent.addEventListener('scroll', () => {
                if (listContent.scrollHeight - listContent.scrollTop === listContent.clientHeight) {
                  clearInterval(scrollBottomInterval)
                }
              })
            }
            else {
              clearInterval(scrollBottomInterval)
            }

            if (cloned.getBoundingClientRect().top < listContent.getBoundingClientRect().top + 150 &&
              listContent.scrollTop !== 0
            ) {
              var topDifference = parseInt(cloned.getBoundingClientRect().top * .05)
              var topIncrement = parseInt((listContent.getBoundingClientRect().top + 150 - cloned.getBoundingClientRect().top) * .02)
              clearInterval(scrollTopInterval)
              scrollTopInterval = setInterval(() => {
                console.log(100)
                listContent.scrollTop = listContent.scrollTop - topIncrement
              }, topDifference)
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


        if (cloned.getBoundingClientRect().right > board.getBoundingClientRect().right - 150 &&
          board.scrollWidth - board.scrollLeft !== board.clientWidth
        ) {
          var rightIncrement = parseInt((cloned.getBoundingClientRect().right - board.getBoundingClientRect().right + 150) * .05)
          clearInterval(scrollRightInterval)
          scrollRightInterval = setInterval(() => {
            console.log(50)
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

        if (cloned.getBoundingClientRect().left < board.getBoundingClientRect().left + 150 &&
          board.scrollLeft !== 0
        ) {
          var LeftIncrement = parseInt((board.getBoundingClientRect().left + 150 - cloned.getBoundingClientRect().left) * .05)
          clearInterval(scrollLeftInterval)
          scrollLeftInterval = setInterval(() => {
            console.log(200)
            board.scrollLeft = board.scrollLeft - LeftIncrement
          }, 10)
          board.addEventListener('scroll', () => {
            if (board.scrollLeft === 0) {
              clearInterval(scrollLeftInterval)
            }
          })
        }
        else {
          clearInterval(scrollLeftInterval)
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

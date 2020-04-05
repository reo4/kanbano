(function () {
  this.Kanbano = function () {

    var defaults = {
      board: '.board',
      cards: '.card',
      cloneCardClass: 'cloned-card',
      cloneListClass: 'cloned-list',
      activeCardClass: 'dragging-active-card',
      activeListClass: 'dragging-active-list',
      lists: '.list',
      listTitle: '.list-title',
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
    var activeButton;
    var activeList;
    var wrapper = document.body;
    var container = wrapper;
    var board = document.querySelector(this.options.board);
    var scrollBottomInterval;
    var scrollTopInterval;
    var scrollRightInterval;
    var scrollLeftInterval;
    var cloned;
    var buttonFirstShot;
    var listFirstShot;



    container.addEventListener("mousedown", e => {
      var buttons = document.querySelectorAll(this.options.cards);
      var lists = document.querySelectorAll(this.options.lists)
      initialX = e.clientX;
      initialY = e.clientY;
      prevX = e.clientX;
      prevY = e.clientY;
      buttons.forEach(button => {
        if (e.target === button || button.contains(event.target)) {
          activeButton = button;
          buttonFirstShot = true
        }
      });
      lists.forEach(list => {
        var listTitle = list.querySelector(this.options.listTitle)
        if (event.target === listTitle || listTitle.contains(event.target)) {
          activeList = list
          listFirstShot = true
        }
      })
    });

    container.addEventListener("mousemove", e => {
      e.preventDefault();
      if (activeButton) {
        if (buttonFirstShot) {
          var cloneButton = activeButton.cloneNode(true);
          wrapper.style.position = "relative";
          wrapper.style.overflow = "hidden"
          cloned = document.createElement("div");
          cloned.classList.add(this.options.cloneCardClass);
          cloned.style.position = 'absolute'
          cloned.style.zIndex = '1000'
          wrapper.prepend(cloned);
          cloned.appendChild(cloneButton);
          initialPositionX = activeButton.getBoundingClientRect().left;
          initialPositionY = activeButton.getBoundingClientRect().top;
          cloned.style.width = activeButton.offsetWidth + 'px'
          cloned.style.height = activeButton.offsetHeight + 'px'
          cloned.firstChild.style.margin = 0 + 'px'
          cloned.style.left = initialPositionX + 'px'
          cloned.style.top = initialPositionY + 'px'
          activeButton.classList.add(this.options.activeCardClass);
          buttonFirstShot = false
        }

        offsetX = e.clientX - initialX + initialPositionX;
        offsetY = e.clientY - initialY + initialPositionY;
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
              if (button !== activeButton) {
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
        })

        // scrolling

        lists.forEach(list => {
          if (list.contains(activeButton)) {
            var listContent = list.querySelector(this.options.listContent)

            if (cloned.getBoundingClientRect().bottom > listContent.getBoundingClientRect().bottom - 150 &&
              listContent.scrollHeight - listContent.scrollTop !== listContent.clientHeight
            ) {
              var bottomDifference = parseInt((wrapper.getBoundingClientRect().bottom - cloned.getBoundingClientRect().bottom) * .05)
              var bottomIncrement = parseInt((cloned.getBoundingClientRect().bottom - listContent.getBoundingClientRect().bottom + 150) * .02)
              clearInterval(scrollBottomInterval)
              scrollBottomInterval = setInterval(() => {
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


        prevX = e.clientX;
        prevY = e.clientY;
      }
      if (activeList) {
        if (listFirstShot) {
          var cloneList = activeList.cloneNode(true);
          wrapper.style.position = "relative";
          wrapper.style.overflow = "hidden"
          cloned = document.createElement("div");
          cloned.classList.add(this.options.cloneListClass);
          cloned.style.position = 'absolute'
          cloned.style.zIndex = '1000'
          wrapper.prepend(cloned);
          cloned.appendChild(cloneList);
          initialPositionX = activeList.getBoundingClientRect().left;
          initialPositionY = activeList.getBoundingClientRect().top;
          cloned.style.width = activeList.offsetWidth + 'px'
          cloned.style.height = activeList.offsetHeight + 'px'
          cloned.style.left = initialPositionX + 'px'
          cloned.style.top = initialPositionY + 'px'
          activeList.classList.add(this.options.activeListClass);
          listFirstShot = false
        }
        offsetX = e.clientX - initialX + initialPositionX;
        offsetY = e.clientY - initialY + initialPositionY;
        var centerX = cloned.getBoundingClientRect().top + cloned.offsetHeight / 2
        var centerY = cloned.getBoundingClientRect().left + cloned.offsetWidth / 2
        var lists = document.querySelectorAll(this.options.lists);
        var newLists = []
        cloned.style.left = offsetX + 'px'
        cloned.style.top = offsetY + 'px'
        var centers = []
        lists.forEach(list => {
          if (list !== activeList && list !== cloned.querySelector('.list')) {
            newLists.push(list)
            var center = list.getBoundingClientRect().left + list.offsetWidth / 2
            centers.push(Math.abs(center - centerY))
          }
        })
        var index = centers.indexOf(Math.min.apply(Math, centers))
        var list = newLists[index]
        if (centerY > list.getBoundingClientRect().left && centerY < list.getBoundingClientRect().left + list.offsetWidth / 2) {
          board.insertBefore(
            activeList,
            list.nextSibling
          )
        }
        else if (centerY < list.getBoundingClientRect().right && centerY > list.getBoundingClientRect().right - list.offsetWidth / 2) {
          board.insertBefore(
            activeList,
            list
          )
        }
      }
      if (cloned) {
        if (cloned.getBoundingClientRect().right > board.getBoundingClientRect().right - 100 &&
          board.scrollWidth - board.scrollLeft !== board.clientWidth
        ) {
          var rightIncrement = parseInt((cloned.getBoundingClientRect().right - board.getBoundingClientRect().right + 100) * .05)
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

        if (cloned.getBoundingClientRect().left < board.getBoundingClientRect().left + 100 &&
          board.scrollLeft !== 0
        ) {
          var LeftIncrement = parseInt((board.getBoundingClientRect().left + 100 - cloned.getBoundingClientRect().left) * .05)
          clearInterval(scrollLeftInterval)
          scrollLeftInterval = setInterval(() => {
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
      }
    });

    container.addEventListener("mouseup", e => {
      if (activeButton) {
        activeButton.classList.remove(this.options.activeCardClass);
        activeButton = undefined;
        wrapper.removeAttribute('style');
        initialPositionX = 0;
        initialPositionY = 0;
        clearInterval(scrollTopInterval)
        clearInterval(scrollBottomInterval)
        clearInterval(scrollRightInterval)
        clearInterval(scrollLeftInterval)
        if (cloned) {
          cloned.remove();
          cloned = undefined
        }
        buttonFirstShot = false
      }
      if (activeList) {
        activeList.classList.remove(this.options.activeListClass);
        activeList = undefined;
        wrapper.removeAttribute('style')
        initialPositionX = 0;
        initialPositionY = 0;
        clearInterval(scrollRightInterval)
        clearInterval(scrollLeftInterval)
        if (cloned) {
          cloned.remove();
          cloned = undefined
        }
        listFirstShot = false
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

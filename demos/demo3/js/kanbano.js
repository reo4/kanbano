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
      listContent: '.list-content',
      lockClass: 'lock'
    }

    if (arguments[0] && typeof arguments[0] === "object") {
      this.options = extendDefaults(defaults, arguments[0]);
    }
    else {
      this.options = defaults
    }

  }

  Kanbano.prototype.init = function () {

    var self = this
    var initialX, initialY, offsetX, offsetY;
    var prevX = 0;
    var prevY = 0;
    var initialPositionX = 0;
    var initialPositionY = 0;
    var initialRight = 0;
    var initialBottom = 0;
    var activeButton;
    var activeList;
    var wrapper = document.body;
    var container = window;
    var board = document.querySelector(self.options.board);
    var scrollBottomInterval;
    var scrollTopInterval;
    var scrollRightInterval;
    var scrollLeftInterval;
    var cloned;
    var buttonFirstShot;
    var listFirstShot;
    var listId;
    var cardId;
    var containingList;

    document.querySelectorAll(self.options.cards).forEach(function (card) {
      card.style.cursor = 'grab'
    })

    document.querySelectorAll(self.options.lists).forEach(function (list) {
      var listTitle = list.querySelector(self.options.listTitle)
      listTitle.style.cursor = 'grab'
    })

    container.addEventListener("mousedown", function (e) {
      var lists = document.querySelectorAll(self.options.lists)
      initialX = e.clientX;
      initialY = e.clientY;
      prevX = e.clientX;
      prevY = e.clientY;
      lists.forEach(function (list, list_id) {
        var buttons = list.querySelectorAll(self.options.cards);
        var listTitle = list.querySelector(self.options.listTitle)
        if ((e.target === listTitle || listTitle.contains(e.target))) {
          activeList = list
          listFirstShot = true
          listId = list_id
        }
        buttons.forEach(function (button, card_id) {
          if ((e.target === button || button.contains(e.target))) {
            activeButton = button;
            containingList = list;
            buttonFirstShot = true
            cardId = card_id
            listId = list_id
          }
        });
      })
    });

    container.addEventListener("mousemove", function (e) {
      e.preventDefault();
      if (activeButton) {
        if (buttonFirstShot) {
          var cloneButton = activeButton.cloneNode(true);
          wrapper.style.position = "relative";
          wrapper.style.overflow = "hidden"
          cloned = document.createElement("div");
          cloned.classList.add(self.options.cloneCardClass);
          cloned.style.position = 'absolute'
          cloned.style.zIndex = '1000'
          wrapper.prepend(cloned);
          cloned.appendChild(cloneButton);
          initialPositionX = activeButton.getBoundingClientRect().left;
          initialPositionY = activeButton.getBoundingClientRect().top;
          initialRight = activeButton.getBoundingClientRect().right
          initialBottom = activeButton.getBoundingClientRect().bottom
          cloned.style.width = activeButton.offsetWidth + 'px'
          cloned.style.height = activeButton.offsetHeight + 'px'
          cloneButton.style.cursor = 'grabbing'
          cloned.firstChild.style.margin = 0 + 'px'
          cloned.style.left = initialPositionX + 'px'
          cloned.style.top = initialPositionY + 'px'
          activeButton.classList.add(self.options.activeCardClass);
          buttonFirstShot = false

        }
        offsetX = e.clientX - initialX + initialPositionX;
        offsetY = e.clientY - initialY + initialPositionY;
        var centerX = cloned.getBoundingClientRect().top + cloned.offsetHeight / 2
        var centerY = cloned.getBoundingClientRect().left + cloned.offsetWidth / 2
        var lists = document.querySelectorAll(self.options.lists);
        if (!activeButton.classList.contains(self.options.lockClass)) {
          cloned.style.left = offsetX + 'px'
        }
        cloned.style.top = offsetY + 'px'

        lists.forEach(function (list) {
          var listLeft = list.getBoundingClientRect().left
          var listRight = list.getBoundingClientRect().right
          if (centerY > listLeft && centerY < listRight) {
            var cards = list.querySelectorAll(self.options.cards)
            if (cards.length) {
              var centers = []
              cards.forEach(function (button) {
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
              list.querySelector(self.options.listContent).appendChild(activeButton)
            }
          }
        })

        // scrolling

        lists.forEach(function (list) {
          if (list.contains(activeButton)) {
            var listContent = list.querySelector(self.options.listContent)

            if (cloned.getBoundingClientRect().bottom > listContent.getBoundingClientRect().bottom - 100 &&
              listContent.scrollHeight - listContent.scrollTop !== listContent.clientHeight &&
              cloned.getBoundingClientRect().top - initialPositionY > 50
            ) {
              var bottomDifference = parseInt((wrapper.getBoundingClientRect().bottom - cloned.getBoundingClientRect().bottom) * .05)
              var bottomIncrement = parseInt((cloned.getBoundingClientRect().bottom - listContent.getBoundingClientRect().bottom + 100) * .02)
              clearInterval(scrollBottomInterval)
              scrollBottomInterval = setInterval(function () {
                listContent.scrollTop = listContent.scrollTop + bottomIncrement
              }, bottomDifference)
              listContent.addEventListener('scroll', function () {
                if (listContent.scrollHeight - listContent.scrollTop === listContent.clientHeight) {
                  clearInterval(scrollBottomInterval)
                }
              })
            }
            else {
              clearInterval(scrollBottomInterval)
            }


            if (cloned.getBoundingClientRect().top < listContent.getBoundingClientRect().top + 100 &&
              listContent.scrollTop !== 0 &&
              initialBottom - cloned.getBoundingClientRect().bottom > 50
            ) {
              var topDifference = parseInt(cloned.getBoundingClientRect().top * .05)
              var topIncrement = parseInt((listContent.getBoundingClientRect().top + 100 - cloned.getBoundingClientRect().top) * .02)
              clearInterval(scrollTopInterval)
              scrollTopInterval = setInterval(function () {
                listContent.scrollTop = listContent.scrollTop - topIncrement
              }, topDifference)
              listContent.addEventListener('scroll', function () {
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
      }
      if (activeList) {
        if (listFirstShot) {
          var cloneList = activeList.cloneNode(true);
          wrapper.style.position = "relative";
          wrapper.style.overflow = "hidden"
          cloned = document.createElement("div");
          cloned.classList.add(self.options.cloneListClass);
          cloned.style.position = 'absolute'
          cloned.style.zIndex = '1000'
          wrapper.prepend(cloned);
          cloned.appendChild(cloneList);
          initialPositionX = activeList.getBoundingClientRect().left;
          initialPositionY = activeList.getBoundingClientRect().top;
          initialRight = activeList.getBoundingClientRect().right
          initialBottom = activeList.getBoundingClientRect().bottom
          cloned.style.width = activeList.offsetWidth + 'px'
          cloned.style.height = activeList.offsetHeight + 'px'
          cloneList.querySelector(self.options.listTitle).style.cursor = 'grabbing'
          cloned.style.left = initialPositionX + 'px'
          cloned.style.top = initialPositionY + 'px'
          activeList.classList.add(self.options.activeListClass);
          listFirstShot = false
        }
        offsetX = e.clientX - initialX + initialPositionX;
        offsetY = e.clientY - initialY + initialPositionY;
        var centerX = cloned.getBoundingClientRect().top + cloned.offsetHeight / 2
        var centerY = cloned.getBoundingClientRect().left + cloned.offsetWidth / 2
        var lists = document.querySelectorAll(self.options.lists);
        var newLists = []
        cloned.style.left = offsetX + 'px'
        if (!activeList.classList.contains(self.options.lockClass)) {
          cloned.style.top = offsetY + 'px'
        }
        var centers = []
        lists.forEach(function (list) {
          if (list !== activeList && list !== cloned.querySelector('.list')) {
            newLists.push(list)
            var center = list.getBoundingClientRect().left + list.offsetWidth / 2
            centers.push(Math.abs(center - centerY))
          }
        })
        var index = centers.indexOf(Math.min.apply(Math, centers))
        var list = newLists[index]
        if (list && centerY > list.getBoundingClientRect().left && centerY < list.getBoundingClientRect().left + list.offsetWidth / 2) {
          board.insertBefore(
            activeList,
            list.nextSibling
          )
        }
        else if (list && centerY < list.getBoundingClientRect().right && centerY > list.getBoundingClientRect().right - list.offsetWidth / 2) {
          board.insertBefore(
            activeList,
            list
          )
        }
      }
      if (cloned) {
        if (cloned.getBoundingClientRect().right > board.getBoundingClientRect().right - 100 &&
          board.scrollWidth - board.scrollLeft !== board.clientWidth &&
          cloned.getBoundingClientRect().left - initialPositionX > 50
        ) {
          var rightIncrement = parseInt((cloned.getBoundingClientRect().right - board.getBoundingClientRect().right + 100) * .05)
          clearInterval(scrollRightInterval)
          scrollRightInterval = setInterval(function () {
            board.scrollLeft = board.scrollLeft + rightIncrement
          }, 10)
          board.addEventListener('scroll', function () {
            if (board.scrollWidth - board.scrollLeft === board.clientWidth) {
              clearInterval(scrollRightInterval)
            }
          })
        }
        else {
          clearInterval(scrollRightInterval)
        }

        if (cloned.getBoundingClientRect().left < board.getBoundingClientRect().left + 100 &&
          board.scrollLeft !== 0 &&
          initialRight - cloned.getBoundingClientRect().right > 50
        ) {
          var LeftIncrement = parseInt((board.getBoundingClientRect().left + 100 - cloned.getBoundingClientRect().left) * .05)
          clearInterval(scrollLeftInterval)
          scrollLeftInterval = setInterval(function () {
            board.scrollLeft = board.scrollLeft - LeftIncrement
          }, 10)
          board.addEventListener('scroll', function () {
            if (board.scrollLeft === 0) {
              clearInterval(scrollLeftInterval)
            }
          })
        }
        else {
          clearInterval(scrollLeftInterval)
        }
      }

      prevX = e.clientX;
      prevY = e.clientY;
    });

    container.addEventListener("mouseup", function (e) {
      if (cloned) {
        cloned.remove();
        cloned = undefined
      }
      if (activeButton) {
        var lists = document.querySelectorAll(self.options.lists)
        lists.forEach(function (list, list_id) {
          var buttons = list.querySelectorAll(self.options.cards);
          buttons.forEach(function (button, card_id) {
            if (activeButton === button) {
              if (cardId !== card_id || list !== containingList) {
                if (self.options.onCardMoved) {
                  self.options.onCardMoved({
                    from: { list: listId + 1, order: cardId + 1 },
                    to: { list: list_id + 1, order: card_id + 1 }
                  })
                }
              }
            }
          });
        })
        listId = undefined
        cardId = undefined
        containingList = undefined
        activeButton.classList.remove(self.options.activeCardClass);
        activeButton = undefined;
        wrapper.removeAttribute('style');
        initialPositionX = 0;
        initialPositionY = 0;
        initialRight = 0;
        initialBottom = 0
        clearInterval(scrollTopInterval)
        clearInterval(scrollBottomInterval)
        clearInterval(scrollRightInterval)
        clearInterval(scrollLeftInterval)
        buttonFirstShot = false
      }
      if (activeList) {
        var lists = document.querySelectorAll(self.options.lists)
        lists.forEach(function (list, list_id) {
          if (activeList === list) {
            if (listId !== list_id) {
              if (self.options.onListMoved) {
                self.options.onListMoved({
                  from: { order: listId + 1 },
                  to: { order: list_id + 1 }
                })
              }
            }
          }
        })
        listId = undefined
        cardId = undefined
        activeList.classList.remove(self.options.activeListClass);
        activeList = undefined;
        wrapper.removeAttribute('style')
        initialPositionX = 0;
        initialPositionY = 0;
        initialRight = 0;
        initialBottom = 0
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

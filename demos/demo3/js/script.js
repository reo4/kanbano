function calculateNumberOfCards() {
  var lists = document.querySelectorAll('.list')
  lists.forEach(function (list) {
    var cardNumbers = list.querySelectorAll('.card').length
    list.querySelector('.right').innerHTML = cardNumbers
  })
}
(function () {
  var snackbar = document.querySelector('.snackbar')
  var eventName = snackbar.querySelector('.event-name')
  var listGroup = document.querySelectorAll('.list-group')
  var fromList = snackbar.querySelector('.from-list.list-value')
  var fromOrder = snackbar.querySelector('.from-order.order-value')
  var toList = snackbar.querySelector('.to-list.list-value')
  var toOrder = snackbar.querySelector('.to-order.order-value')

  var kanbano = new Kanbano({
    onCardMoved: function (data) {
      snackbar.classList.add('show')
      eventName.classList.remove('show')
      listGroup.forEach(function (list) {
        list.style.display = 'inline-block'
      })
      fromList.innerHTML = data.from.list_order
      fromOrder.innerHTML = data.from.card_order
      toList.innerHTML = data.to.list_order
      toOrder.innerHTML = data.to.card_order
      setTimeout(function () {
        eventName.classList.add('show')
        eventName.innerHTML = 'onCardMoved'
      }, 200)
      calculateNumberOfCards()
    },
    onListMoved: function (data) {
      snackbar.classList.add('show')
      eventName.classList.remove('show')
      listGroup.forEach(function (list) {
        list.style.display = 'none'
      })
      fromOrder.innerHTML = data.from.list_order
      toOrder.innerHTML = data.to.list_order
      setTimeout(function () {
        eventName.classList.add('show')
        eventName.innerHTML = 'onListMoved'
      }, 200)
    },
    direction: 'horizontal'
  });

  kanbano.init();

  document.querySelector('.close-btn').addEventListener('click', function () {
    snackbar.classList.remove('show')
  })

  calculateNumberOfCards()


}())
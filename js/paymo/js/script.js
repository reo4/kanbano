(function () {
  var kanbano = new Kanbano();
  kanbano.init({
    onCardMoved: function (data) {
      alert('card moved from list: ' +
        data.from.list + 'to list: ' +
        data.to.list + 'from order: ' +
        data.from.order + 'to order: ' +
        data.to.order)
    },
    onListMoved: function (data) {
      alert('list moved from order: ' +
        data.from.order + 'to order: ' +
        data.to.order)
    }
  });
}())
(function () {
  var kanbano = new Kanbano({
    onCardMoved: function (data) {
      alert(
        'card moved from list: ' + data.from.list +
        ' order: ' + data.from.order +
        ' to list: ' + data.to.list +
        ' order: ' + data.to.order
      )
    },
    onListMoved: function (data) {
      alert(
        'list moved from order: ' + data.from.order +
        ' to order: ' + data.to.order
      )
    }
  });
  kanbano.init();
}())
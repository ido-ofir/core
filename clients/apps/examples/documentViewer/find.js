window.find = function (string) {
  var instance = new Mark(document.querySelector("#page-container"));
  var items = [];
  instance.mark(string, {
    each: function (item) {
      items.push(item);
    }
  });
  return {
    items: items,
    instance: instance
  };
}

window.scrollTo = function (el) {
  var container = document.querySelector("#page-container");
  var top = el.getBoundingClientRect().top;
  var containerTop = container.getBoundingClientRect().top;
  var newTop = (container.scrollTop || 0) + (top - containerTop);
  container.scrollTop = newTop - 50;
}

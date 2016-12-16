var draw = function () {

  var TILE_WIDTH = 40;
  var TILE_HEIGHT = 40;

  function createElementAt(x, y) {
    var el = document.createElement('div');
    el.style.position = 'fixed'; /* TODO probably wants to be relative;, to refer to parent DOM object. not relevant with a single DOM object tho */
    el.style.display = 'block'; /* each element takes full width */

    el.style.width = TILE_WIDTH;
    el.style.height = TILE_HEIGHT;

    el.style.left = x * TILE_WIDTH;
    el.style.top = y * TILE_HEIGHT;

    return el;
  }

  var renderers = {
    player: function (object, el) {
      el.style.backgroundColor = 'red';
    }
  };

  return function (objects) {
    console.log('start draw');
    var el = document.getElementById('content');
    el.innerHTML = '';

    for (let object in objects) {
      var objEl = createElementAt(object.point.x, object.point.y);
      renderers[object.type](object, objEl);
    }
    console.log('end draw');
  };

}();

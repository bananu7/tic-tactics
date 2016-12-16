var placement = function (units, objects, placementContainer) {
  var picker = document.createElement('ul');

  var selectedUnit;
  for (let unit of units) {
    var unitEl = document.createElement('li');
    unitEl.innerHTML = unit;
    unitEl.onclick = function () {
      selectedUnit = unit;
    };

    picker.appendChild(unitEl);
  }

  for (let object of objects.filter(o => o.type === 'marker')) {
    object.callback = function () {
      if (!selectedUnit) {
        return;
      }

      object.type = 'unit';
      object.unitType = selectedUnit;
      /* TODO trigger draw *SOME OTHER WAY* */
      draw(objects, container /* this is the global one, LOL */);
    };
  }
  
  placementContainer.appendChild(picker);
};

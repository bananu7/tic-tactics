var placement = function (units, objects, container, placementContainer) {
  var picker = document.createElement('ul');

  var selectedUnit;
  for (let unit of ['(remove)', ...units]) {
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

      if (selectedUnit == '(remove)') {
        object.type = 'marker';
        delete object.unitType;
      } else {
        object.type = 'unit';
        object.unitType = selectedUnit;
      }

      /* XXX I'd like to find some CLEANER way than calling draw manually */
      draw(objects, container);
    };
  }
  
  placementContainer.appendChild(picker);
};

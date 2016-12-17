var placement = function ({units, objects, redraw, unitListEl, end, money}) {
  var locked = false;
  var picker = document.createElement('ul');

  var moneyEl = document.createElement('li');
  function addMoney(amount) {
    money += amount;
    moneyEl.innerHTML = money + ' gold(s) left';
  }
  picker.appendChild(moneyEl);
  addMoney(0); /* display money */

  var selectedUnit;
  for (let unit of [{type: '(remove)', price: 'refunds'}, ...units]) {
    var unitEl = document.createElement('li');
    unitEl.innerHTML = unit.type + ' (' + unit.price + ' gold)';
    unitEl.onclick = function () {
      selectedUnit = unit;
    };

    picker.appendChild(unitEl);
  }

  var lockButton = document.createElement('button');
  lockButton.innerHTML = 'GO';
  lockButton.onclick = function (e) {
    e.preventDefault();
    if (objects.filter(o => o.type !== 'marker')) {
      alert("You need to place your units");
      return;
    }
    locked = true;

    unitListEl.removeChild(picker);
    end(objects.filter(o => o.type !== 'marker'));
  };
  picker.appendChild(lockButton);

  for (let object of objects.filter(o => o.type === 'marker')) {
    object.callback = function () {
      if (!selectedUnit || locked) {
        return;
      }

      if (selectedUnit.type == '(remove)') {
        object.type = 'marker';
        addMoney(object.price);
        delete object.unitType;
        delete object.price;
      } else if (selectedUnit.price > money) {
        alert("You don't have enough money for this unit!");
      } else {
        if (object.type === 'unit') {
          // we already had a unit there - refund it first
          addMoney(object.price);
        }
        object.type = 'unit';
        object.unitType = selectedUnit.type;
        object.price = selectedUnit.price;
        addMoney(-selectedUnit.price);
      }

      redraw();
    };
  }
  
  unitListEl.appendChild(picker);
};

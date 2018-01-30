$(function () {
  $.getJSON('productInventoryAction!showProductInventory.action?rnd=' + Math.random(), function (data) {
    $.each(data.productInventories, function (i) {
      // P1
      if (data.productInventories[i].productName === 'P1') {
        $('.P1').text(data.productInventories[i].pNumber);
      }
      // P2
      if (data.productInventories[i].productName === 'P2') {
        $('.P2').text(data.productInventories[i].pNumber);
      }
      // P3
      if (data.productInventories[i].productName === 'P3') {
        $('.P3').text(data.productInventories[i].pNumber);
      }
      // P4
      if (data.productInventories[i].productName === 'P4') {
        $('.P4').text(data.productInventories[i].pNumber);
      }
      // 仓库名
      if (data.productInventories[i].wareHouseName === 'Warehouse 2') {
        $('.storehouse').text(data.productInventories[i].wareHouseName);
      }
    });
  });
});



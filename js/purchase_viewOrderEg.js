/**
 * 查看原料采购单
 */

$(function () {
  var pageSize = 14; // 每页所展示记录条数
  var pageIndex = 1; // 定义全局pageIndex变量，记录当前第几页

  // 加载原料订单数据
  function findMaterialOrders() {
    $('#orderInforTab tr:gt(0)').find('td').empty(); // 清空原内容

    $.post('materialOrderAction!findMaterialOrders.action', {
      'item': 2, // 表示加载全部订单
      'pageSize': pageSize,
      'pageNumber': pageIndex
    }, function (data) {
      $('#totalNumber').text(data.sum); // 总记录数
      if (data.sum % 14) {
        var pages = parseInt(data.sum / 14) + 1;
      }	else {
        var pages = parseInt(data.sum / 14);
      }

      if (pages == 0) {
        $('#presentPage').text(1);
        $('#totalPages').text(1); // 总页数
      } else {
        $('#presentPage').text(pageIndex);
        $('#totalPages').text(pages); // 总页数
      }

      // 获取到表格内的数据
      var orderInfor = data.materialOrders;

      $(orderInfor).each(function (index, items) {
        var orderInforTr = $('#orderInforTab tr').eq(index + 1);
        orderInforTr.find('td:eq(0)').text(items.orderId);
        orderInforTr.find('td:eq(1)').text(items.materialName);
        orderInforTr.find('td:eq(2)').text(items.materialNumber);
        orderInforTr.find('td:eq(3)').text(items.wareHouseName);
        orderInforTr.find('td:eq(4)').text(items.happenTime);
        orderInforTr.find('td:eq(5)').text(items.endTime);
      });

      $('#presentPage').text(pageIndex); // 当前页数
    }, 'json');
  }

  // 初始化页面时加载全部原料订单
  findMaterialOrders();

  // 上一页
  $('#prePage').on('click', function () {
    $('.orderInfor a').css('background', 'none');
    pageIndex--;

    if (pageIndex < 1) {
      $('#presentPage').text(1);
      alert('It is now the first page of the show record');
      pageIndex = 1;
    } else {
      findMaterialOrders();
    }
  });

  // 下一页
  $('#nextPage').on('click', function () {
    $('.orderInfor a').css('background', 'none');
    pageIndex++;

    var page = $('#totalPages').text();
    if (pageIndex > page) {
      alert('This is the last page showing the record');
      pageIndex = page;
    } else {
      findMaterialOrders();
    }
  });
});

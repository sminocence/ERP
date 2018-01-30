/**
 * 广告投放与订单选取
 */

/**
 * 设置导航条颜色
 *
 * @param i {Number}
 */
function changeMenu(i) {
  // 初始化
  $('.start_ads_ul li').removeClass();
  $('.start_ads_ul li').addClass('li_out');

  var $this = $('.start_ads_ul li').eq(i);

  $this.addClass('li_over');
  $this.children('div').addClass('div2');
  $this.next().addClass('li_next_over');
  $this.prevAll('li').addClass('lli');
  $this.prevAll('li').children('div').addClass('div_over');
}

// 设置聊天室的显示与隐藏
function hideChartRoom() {
  $('#ads_div2').hide();
  var oDiv1 = document.getElementById('ads_div1');
  var oDiv2 = document.getElementById('ads_div2');
  var Timer = null;

  oDiv1.onmouseover = oDiv2.onmouseover = function () {
    oDiv2.style.display = 'block';
    clearTimeout(Timer);
  };

  oDiv1.onmouseout = oDiv2.onmouseout = function () {
    Timer = setTimeout(function () {
      oDiv2.style.display = 'none';
    }, 300);
  };

  // 对聊天室的定位进行设置，视情况而定是否需要
  $('.start_ads_content_right').css('right', '12px');
}

// 加载数据
function load(url, oData, jsonCallBack) {
  $.post(url, oData, jsonCallBack, 'json');
}

/**
 * 加载子页面
 *
 * @param href {String} 目标页面 url
 */
function loadPage(href) {
  $('.start_ads_content_left').empty();

  $.get(href, function (data) {
    if (href === 'start_selectOrder.html') {
      $('.start_ads_content_left')[0].innerHTML = data;
      $.getScript('../../js/start_selectOrder.js');
    } else if (href === 'start_deliver_ads_affirm.html') {
      $('.start_ads_content_left')[0].innerHTML = data;
      $.getScript('../../js/start_deliver_ads_affirm.js');
    } else if (href === 'start_deliver_ads_wait.html') {
      $('.start_ads_content_left')[0].innerHTML = data;
      $.getScript('../../js/start_deliver_ads_wait.js');
    } else if (href === 'start_choseOrder.html') {
      $('.start_ads_content_left')[0].innerHTML = data;
      $.getScript('../../js/commonPop.js');
      $.getScript('../../js/start_choseOrder.js');
    } else {
      $('.start_ads_content_left')[0].innerHTML = data;
    }
  });
}

// 投放广告数据
function adsCallBack(data) {
  // 设置表格的单双行的颜色不同
  $('.start_table tr:odd').css('background', '#F4F4F4');

  $(data).each(function (index) {
    var adsTr = $('.deliver_ads_tab tr').eq(index + 1);

    $(adsTr).find('td').eq(0).text(data[index].id); // 编号
    $(adsTr).find('td').eq(1).text(data[index].productName); // 产品
    $(adsTr).find('td').eq(2).append('<input type="text" name="fee" value=" " />'); // 投放广告费框

    if (parseInt(data[index].money) !== 0) {
      // 如果 money 为 0，则填入空；否则填入相应的广告费,并将输入边框显示为黄色
      $(adsTr).find('input[name="fee"]').css('border', '2px solid #FFD24D').val(data[index].money);
    } else {
      $(adsTr).find('input[name="fee"]').val('0');
    }

    $(adsTr).find('td').eq(3).append('<button>' + '提交' + '</button>');  // 提交
  });

  $('#deliver_ads button').on('click', function () {
    // 设置确认投放广吿的按钮变色同时弹出对话框，输入框变为不可输

    var numcheck = /^(\d)+$/;
    var fee = $(this).parent().prev().find('input').val();
    var assets = $(window.parent.document).contents().find('.profile').children(0).children().html();

    if (parseInt(fee) < 0) {
      alert('广告费应该大于 0 万元');
    } else if (!numcheck.test(fee)) {
      alert('广告投放额度仅允许整数');
    } else if (parseInt(fee) > assets) {
      alert('您的现金不足');
    } else {
      // 提交广告之后，输入框变黄色
      var $thisInput = $(this).parent().prev().find('input[name=fee]');

      $thisInput.css('border', '2px solid #FFD24D');

      var btnPos = $(this).parents('tr').index();
      var id = $('#deliver_ads tbody tr').eq(btnPos).find('td').eq(0).text();
      var money = $(this).parent().prev().find('input').val();

      $.post('advertisementAction!putIntoAdvertisement.action?rnd=' + Math.random(), {
        'id': id,
        'money': money
      }, function () {
        alert('提交成功');
      });
    }
  });
}

/**
 * 投放广告页面所有操作
 */
function adsPage() {
  // select 选择框的内容动态加载
  $.post('marketAction!getDevelopedMarket.action?rnd=' + Math.random(), null, function (data) {
    for (var j = 0; j < data.marketName.length; j++) {
      if (data.marketName[j] === '本地市场') {
        $('select').append('<option selected >' + data.marketName[j] + '</option>');
      } else {
        $('select').append('<option >' + data.marketName[j] + '</option>');
      }
    }
  }, 'json');

	// 查询
  $('.search_orderForm, #btn').on('click', function () {
    var market = $('select option:checked').text();

    $('#deliver_ads tbody td').empty();
    load('advertisementAction!getAdByMarket.action?rnd=' + Math.random(), {
      'marketName': market
    }, adsCallBack);
  });
}

/**
 * 广告确认数据
 */
function adsAffirmCallBack(data) {
  // 设置表格的单双行的颜色不同
  $('.start_table tr:odd').css('background', '#F4F4F4');

  $(data).each(function (index) {
    var adsAffirmTr = $('.deliver_ads_tab tr').eq(index + 1);

    $(adsAffirmTr).find('td').eq(0).text(data[index].id);
    $(adsAffirmTr).find('td').eq(1).text(data[index].marketName);
    $(adsAffirmTr).find('td').eq(2).text(data[index].productName);
    $(adsAffirmTr).find('td').eq(3).text(data[index].money);
  });
}

/**
 * 等待大厅数据
 */
function waitCallBack(data) {
  ready = true;

  $('td').empty();

  var size = data.length; // 组数

  // 动态生成小组
  if (size > 5 && size < 10) {
    $('tr').eq(0).clone(true).appendTo('.ads_wait_tab');
  } else if (size > 10) {
    for (var i = 0; i < 2; i++) {
      $('tr').eq(i).clone(true).appendTo('.ads_wait_tab');
    }
  }

	// 填入小组数据
  $(data).each(function (index) {
		// 动态头像
    var sum = 0;
    for (i = 0; i < data[index].userId.length; i++) {
      sum = sum + data[index].userId.charCodeAt(i);
    }
    var j = sum % 7 + 1;

    if (data[index].status === 0) {
      // 根据是否投放广告显示头像
      $('.ads_wait_tab td').eq(index).empty().append('<img src="../../images/pic_meb' + j + '.jpg">');

      ready = false;
    } else {
      $('.ads_wait_tab td').eq(index).empty().append('<img src="../../images/pic_meb' + j + '_ready.jpg">');
    }

    $('.ads_wait_tab td').eq(index).append('<p>' + data[index].name + '</p>');
  });

  refreshWait();
}

function refreshWait() {
  if (ready === true) {
	  changeMenu(3);
    loadPage('start_choseOrder.html');
  }
}

/**
 * 先清空，生成订单table
 */
function orderCallBack(data) {
  var orderBackUp = $('.order').first().clone(true);

  $('.selectOrder_div').empty();

  for (var i = 0; i < data.chooseOrder.length; i++) {
	  $(orderBackUp).clone(true).appendTo('.selectOrder_div');
  }

  // table里加入数据
  $(data.chooseOrder).each(function (index) {
	  var oTabs = $('.selectOrder_div table').eq(index);
    var order = data.chooseOrder;
    var totalNumber = order[index].price * order[index].pNumber; // 总计金额
    var specialRem = order[index].specialRem; // 特别说明

    oTabs.find('span').eq(0).text(order[index].orderID);
    oTabs.find('td').eq(1).text('市场：' + order[index].marketName);
    oTabs.find('td').eq(2).text('总计金额：' + totalNumber);
    oTabs.find('td').eq(3).text('产品：' + order[index].productName);
    oTabs.find('td').eq(4).text('交货日期：' + order[index].needTime);
    oTabs.find('td').eq(5).text('数量：' + order[index].pNumber);
    oTabs.find('td').eq(6).text('货款日期：' + order[index].moneyTime);
    oTabs.find('td').eq(7).text('单价：' + order[index].price);
    oTabs.find('td').eq(8).text('罚金率：' + order[index].penalPercent);

    if (order[index].specialRem === null) specialRem = '无';

    oTabs.find('td').eq(9).text('特别说明：' + specialRem);

    if (order[index].userUnique !== data.userUnique) {
		  // 背景颜色变浅，然后显示该订单被某某选择

      $(oTabs).next('p').css('display', 'block');

      var username = order[index].userName;

      $(oTabs).next().children('span').text(username);

      // 按钮隐藏
      $(oTabs).find('input').css('display', 'none');

      $(oTabs).addClass('checked');
    } else {
			// 背景颜色变浅，然后显示该订单被某某选择
		  $(oTabs).next('p').css('display', 'none');

      // 按钮隐藏
      $(oTabs).find('input').css('display', 'block');
      $(oTabs).removeClass('checked');
    }
  });
}

/**
 * 选择订单select选择框
 */
function orderSelect() {
  // 先加载市场选择
  $.post('chooseOrderAction!putIntoMoneymarket.action?rnd=' + Math.random(), null, function (data) {
    for (var j = 0; j < data.length; j++) {
      $('.select_market').append('<option class="opt">' + data[j] + '</option>');
    }

    // 选择市场后，加载产品选择
    $('.select_market').on('click', function () {
      $('.select_product').empty();

      var market = $('.select_market option:selected').text();

      $.post('chooseOrderAction!getProductNameByMarket.action?rnd=' + Math.random(), {
        'marketName': market
      }, function (data) {
        for (var j = 0; j < data.length; j++) {
          $('.select_product').append('<option>' + data[j] + '</option>');
        }
      }, 'json');
    });
  }, 'json');
}

/**
 * 将聊天室显示出来
 */
function chartRoomShow() {
  $('#ads_div2').css('display', 'block');

  $('#ads_div1 #ads_div2')
    .mouseover(function () {
      $('#ads_div2').css('display', 'block');
    })
    .mouseout(function () {
      $('#ads_div2').css('display', 'block');
    });
}

/**
 * 选择订单页面所有操作
 */
function orderPage() {
  window.orderBackUp = $('.order').first().clone(true);

  // 查询
  $('#btn3').on('click', function () {
    var market = $('.select_market option:selected').text();
    var product = $('.select_product option:selected').text();
    load('chooseOrderAction!chooseOrderList.action?rnd=' + Math.random(), {
      'marketName': '' + market + '',
      'productName': '' + product + ''
    }, orderCallBack);
  });

	// 点击“选择订单”按钮之后将数据提交给后台，被选择订单消失
  $('.choseOrder').on('click', function () {
    var orderID = $(this).prev().text();
    var ok = confirm('是否选择该订单，确认后将不能修改');

    if (ok) {
      $.post('chooseOrderAction!choosingOrder.action?rnd=' + Math.random(), {
        'orderId': orderID
      }, function (data) {
        if (data === 1) {
          $(this).parents('.first_tr').parents('.order').hide(500);
          load('chooseOrderAction!chooseOrderList.action?rnd=' + Math.random(), null, orderCallBack, 'json');
        } else if (data === 2) {
          alert('请耐心等待前面的企业完成选单。');
        } else if (data === 3) {
          alert('请先完成产品研发认证。');
        } else if (data === 4) {
          alert('请先开拓市场。');
        } else {
          alert('此订单已经被其它企业选择。');
        }
      }, 'json');
    } else {
      return false;
    }
  });
}

$(function () {
	// 点击进入第二步步骤
  $('#btn2').on('click', function () {
    var i = 1;

    changeMenu(i);
    loadPage('start_deliver_ads_affirm.html');
  });

	// 点击返回第一步步骤
  $('.affirm_btn1').on('click', function () {
    loadPage('start_selectOrder.html');
  });

	// 点击进入第三步步骤
  $('.affirm_btn2').on('click', function () {
    var ok = confirm('是否提交广告费，确认后将不能修改');
    if (ok) {
      i = 2;

      $.ajaxSetup({ cache: false });

      $.post('advertisementAction!finishAdvertisement.action?rnd=' + Math.random(), function (data) {
        if (data === 1) {
          alert('资产不足!');
        } else if (data === 2) {
          changeMenu(i);
          loadPage('start_deliver_ads_wait.html');
        } else if (data === 3) {
          alert('广告已经投放完毕，请进行下一步操作。');
        }
      }, 'json');
    } else {
      return false;
    }
  });
});

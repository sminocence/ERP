/**
 * 弹出层的处理以及厂房和订货会的逻辑
 */

$(function () {
  // 获取到父页面的信息
  var parent = $(window.parent.document).contents();
  var myDiv = parent.find('.myDiv');
  var center_title = parent.find('.center_title');
  var title = parent.find('.title');
  var dialog = parent.find('.dialog');
  var fullbg = parent.find('.fullbg');
  var exit = parent.find('.exit');
  myDiv.css('color', '#000');

	// 设定弹窗的定位
  function Dialog() {
    _windowWidth = $(window.parent).width(); // 获取当前窗口宽度
    _windowHeight = $(window.parent).height(); // 获取当前窗口高度
    _popupHeight = dialog.height(); // 获取弹出层高度
    _popupWeight = dialog.width(); // 获取弹出层宽度
    _posiTop = (_windowHeight - _popupHeight) / 2;
    _posiLeft = (_windowWidth - _popupWeight) / 2;
    dialog.css({'left': _posiLeft + 'px', 'top': _posiTop + 'px'}); // 设置弹出层的位置
  }

   // 设置弹窗及遮罩层的共用部分,函数体元素次序不可随意更改
  function popupShow() {
	  var h = parent.find('#frame_content').height();
    parent.find('body').css('overflow', 'hidden');
		  // 弹窗自适应大
		   /* if(myDiv.height()>450)
			 {

				myDiv.css("height","450");
				myDiv.css("overflow-y","scroll");
			 }
			if(myDiv.width()>800)
			 {
				myDiv.css("width","800");
				myDiv.css("overflow-x","scroll");
			} */
    Dialog();
    fullbg.show();
    dialog.show();
  }


  $('.enterNext').click(function () {
	    dialog.css('border', '1px solid #336600');
	    center_title.empty();
	    center_title.css('background', '#12385F');
	    exit.css('background', '#355A87');
	    // myDiv.empty().text("是否确认进入下一周期？").addClass("popupFont");
	    myDiv.empty().append('<p class=\'common popupFont font_color\'>是否确认进入下一周期？</p><p class=\'enter_p2 common\'><input type=\'button\' value=\'确认\' class=\'sureBtn common_1 common_bgcolor common_border common_color\' /></p>');
	    popupShow();
	    $(myDiv).on('click', '.sureBtn', function () {
      window.parent.location.href = '../mainframework/forwardloadingpage.html';
    });
  });


	// 加载新建厂房弹框input内容
  function newFactory() {
    $(myDiv).find('.payType').attr('readonly', 'true');
    $(myDiv).find('.beginBuild').attr('readonly', 'true');
    $.get('factoryAction!getNewFactoryDetail.action?rnd=' + Math.random(), function (data) {
	        for (var i = 0; i < data.place.length; i++) {
	            $(myDiv).find('select[name=\'factoryLocation\']').append('<option>' + data.place[i] + '</option>');  // 选择市场
		    }
		    $(myDiv).find('input[name=\'payType\']').val(data.payMode);  // 支付方式
		    $(myDiv).find('.beginBuild').val(data.currentPeriod);  // 开始修建时间
	    }, 'json');
	    $(myDiv).find('button').click(function () {  // 确认新建--传厂房类型、市场
	        var factoryType = $(myDiv).find('select[name=\'factoryType\'] option:selected').text();
		    var place = $(myDiv).find('select[name=\'factoryLocation\'] option:selected').text();
		    // alert(factoryType);
		    $.post('factoryAction!addNewFactory.action', {'factoryType': factoryType, 'place': place}, function () {
		    	update('factoryAction!getAllFactoryAndProductLine.action?rnd=' + Math.random(), null, backUp1, backUp3);
		    	fullbg.hide();
      dialog.hide();
      parent.find('body').css('overflow', 'scroll');
		    });
		   // alert("新建厂房成功");
    });
  }

  function newRent() {
	    $(myDiv).find('.periodNeedMoney').attr('readonly', 'true');
	    $.post('factoryAction!getNewRentFactory.action?rnd=' + Math.random(), null, function (data) {
		    for (var i = 0; i < data.developedMarket.length; i++) {
	            $(myDiv).find('select[name=\'factoryLocation\']').append('<option>' + data.developedMarket[i].marketName + '</option>');  // 选择市场
		    }
      for (var i = 0; i < data.factoryRent.length; i++) {
        $(myDiv).find('select[name=\'factoryType\']').append('<option>' + data.factoryRent[i].factoryType + '</option>');
      }
		    $(myDiv).find('input[name=\'periodNeedMoney\']').val(1);  // 每期所需的资金
		    // $(myDiv).find(".waitPeriod").val(data.needPeriod);  //几期之后开始使用
      smallRentCost = data.factoryRent[1].rentcost;
      largeRentCost = data.factoryRent[0].rentcost;
    }, 'json');
		// 点击大小厂房确定租金
    $(myDiv).find('select[name=\'factoryType\']').click(function () {
      var selectedType = $(myDiv).find('select[name=\'factoryType\'] option:selected').text();
			// 这里先定死定金的大小
      selectedType == '小厂房' ? rentCost = 1 : rentCost = 2;
      $(myDiv).find('input[name=\'periodNeedMoney\']').val(rentCost);
    });
		// 确认租用--传厂房类型、市场、几期后开始使用
	    $(myDiv).find('button').click(function () {
	      var factoryType = $(myDiv).find('select[name=\'factoryType\'] option:selected').text();
		    var place = $(myDiv).find('select[name=\'factoryLocation\'] option:selected').text();
      var waitPeriod = $(myDiv).find('.waitPeriod').val();
      if (!waitPeriod || waitPeriod < 0) { alert('输入有误'); }		    else {
		    	$.post('factoryAction!addNewRentFactory.action?rnd=' + Math.random(), {'factoryType': factoryType, 'place': place, 'needPeriod': waitPeriod}, function () {
		    		update('factoryAction!getAllFactoryAndProductLine.action?rnd=' + Math.random(), null, backUp1, backUp3);
		    		alert('租用厂房成功');
      fullbg.hide(); // 点击alert确定后关闭弹窗
      dialog.hide();
      parent.find('body').css('overflow', 'scroll');
		    	});
      }
	    });
  }

	// 加载新增生产线弹框input内容
  function newLine() {
	  $(myDiv).find('input').attr('readonly', 'true');  // input里面的内容不可修改
    $(myDiv).find('.chooseLine').click(function () {
      $(myDiv).find('input').val('');
    });  // 点击请选择生产线按钮清空
	    // $(myDiv).find(".opt").click(function(){  //选择生产线
    $(myDiv).find('select[name=\'lineType\']').click(function () {
      var lineType = $(myDiv).find('select[name=\'lineType\'] option:selected').text();
      $.post('productLineAction!getAllProductLineBasic.action?rnd=' + Math.random(), null, function (data) {  // 遍历data，根据所选的生产线类型调用对应组的数据
			    // select选择框的内容
        var product = data.productName;
        $(myDiv).find('select[name=\'linePro\']').empty();
        for (var i = 0; i < product.length; i++) {
          $(myDiv).find('select[name=\'linePro\']').append('<option>' + product[i].productName + '</option>');
        }
        $(data.productLineBasic).each(function (index) {
          var line = data.productLineBasic[index];
          if (lineType == line.productLineType) {
            $(myDiv).find('.installPeriod').val(line.setupPeriod);  // 安装周期
            $(myDiv).find('.periodInstallFee').val(line.setupPeriodPrice);  // 每期安装费
            $(myDiv).find('.changePeriod').val(line.changePeriod);  // 转产周期
            $(myDiv).find('.changeFee').val(line.changeCost);  // 每期转产的费用
            $(myDiv).find('.efficiency').val(line.producePeriod);  // 生产效率
            $(myDiv).find('.keepFee').val(line.mainCost);  // 每期维护费
            $(myDiv).find('.discountFee').val(line.depreciation);  // 每期折旧费
            $(myDiv).find('.restValue').val(line.stumpCost);  // 残值
          }
        });// each
      }, 'json');// post
    });// click
	 $(myDiv).find('button').click(function () {  // 确认新建生产线--传生产线类型、厂房编号、生产产品
	    var lineType = $(myDiv).find('select[name=\'lineType\'] option:selected').text();
   var linePro = $(myDiv).find('select[name=\'linePro\'] option:selected').text();
   if (lineType == '请选择生产线类型') { alert(lineType); }   else {
     fullbg.hide(); // 点击alert确定后关闭弹窗
     dialog.hide();
     $.post('productLineAction!addProductLine.action?rnd=' + Math.random(), {'lineType': lineType, 'factoryId': factoryId, 'productName': linePro}, function () {
       update('factoryAction!getAllFactoryAndProductLine.action?rnd=' + Math.random(), null, backUp1, backUp3);
     });
     alert('新增生产线成功');
     parent.find('body').css('overflow', 'scroll');
   }
	 });
  }


	// 结束市场订单
  function overOrder() {
    $.post('chooseOrderAction!getAllChooseOrderDetail.action?rnd=' + Math.random(), null, function (data) {
      myDiv.find('.checkOrder_tab tbody').empty();
      var orderRecords = data.length;
      $(data).each(function (index) {
        myDiv.find('.checkOrder_tab tbody').append('<tr></tr>');
        var tar = myDiv.find('tbody tr').eq(index);
        for (var i = 0; i < 4; i++) {
          $(tar).append('<td></td>');
        }
        $(tar).find('td').eq(0).text(data[index].chooseID);
        $(tar).find('td').eq(1).text(data[index].marketName);
        $(tar).find('td').eq(2).text(data[index].productName);
        $(tar).find('td').eq(3).append('<button class=\'over\'>结束</button>');
        $(this).parents('tr').fadeOut(500);
      });
      $(myDiv).find('.over').on('click', function () {
        var ok = confirm('是否要结束该市场?\n 温馨提示:结束当前市场后就这季度的订单同时结束');
        if (ok) {
          var chooseID = $(this).parents('tr').find('td:eq(0)').text();
					// alert(chooseID);
          $.post('chooseOrderAction!endChoosingMarketAndProductName.action?rnd=' + Math.random(), {'orderId': chooseID}, function (data) {
            fullbg.hide();
            dialog.hide();
            parent.find('body').css('overflow', 'scroll');
            if (data == 'true') {
              changeMenu(4);
              loadPage('start_selectOver.html');
              chartRoomShow();
              return;
            }
            loadPage('start_choseOrder.html');
          });
        } else {
          return;
        }
      });
    }, 'json');


    myDiv.find('.overAll').click(function () {
	 var ok = confirm('是否要结束该市场?\n 温馨提示:结束当前市场后就这季度的订单同时结束');
      if (ok) {
	    fullbg.hide();
        dialog.hide();
        parent.find('body').css('overflow', 'scroll');
		  // 结束所有选单，跳到第五步
		  changeMenu(4);
        loadPage('start_selectOver.html');
        chartRoomShow();
        $.get('chooseOrderAction!endAllMarketAndProduct.action?rnd=' + Math.random());
      } else {
        return;
      }
    });
    myDiv.find('.returnOrder').click(function () {
      fullbg.hide();
      dialog.hide();
      parent.find('body').css('overflow', 'scroll');
      loadPage('start_choseOrder.html');
    });
  }


	// 查看所有的订单信息
  function overAllOrder() {
    $.post('chooseOrderAction!showAllOrderOfUser.action?rnd=' + Math.random(), null, function (data) {
      myDiv.find('.checkAllOrder_tab tbody').empty();

      var orderRecords = data.length;

      $(data).each(function (index) {
        myDiv.find('.checkAllOrder_tab tbody').append('<tr></tr>');

        var tar = myDiv.find('tbody tr').eq(index);

        for (var i = 0; i < 10; i++) {
          $(tar).append('<td></td>');
        }

        if (data[index].specialRem == null) {
          content = '无';
        } else {
          content = data[index].specialRem;
        }

        $(tar).find('td').eq(0).text(data[index].marketName); // 市场
        $(tar).find('td').eq(1).text(data[index].orderID); // 订单编号
        $(tar).find('td').eq(2).text(data[index].productName); // 产品名称
        $(tar).find('td').eq(3).text(data[index].pNumber); // 数量
        $(tar).find('td').eq(4).text(data[index].price); // 单价
        $(tar).find('td').eq(5).text(data[index].pNumber * data[index].price); // 总金额
        $(tar).find('td').eq(6).text(data[index].needTime); // 交货时间
        $(tar).find('td').eq(7).text(data[index].moneyTime); // 货款账期
        $(tar).find('td').eq(8).text(data[index].penalPercent); // 罚金率
        $(tar).find('td').eq(9).text(content); // 特殊说明
      });
    }, 'json');

    myDiv.find('.returnOrder').click(function () {
      fullbg.hide();
      dialog.hide();
      parent.find('body').css('overflow', 'scroll');
    });
  }


	// 新建厂房弹框
  $('input[name=\'createWorkshop\']').click(function () {
	    // myDiv.height(210);
		// $(myDiv).css("color","#000");
	    dialog.css('border', '1px solid #336600');
	    center_title.empty().text('新建厂房');
	    center_title.css('background', '#12385F');
	    exit.css('background', '#355A87');
	    myDiv.empty().load('newFactory.html', null, function () {
		    newFactory();
      popupShow();
    });
  });
	// 租用厂房弹框
  $('input[name=\'rentWorkshop\']').click(function () {
	    // myDiv.width(520);
		// myDiv.height(210);
	    dialog.css('border', '1px solid #336600');
	    center_title.empty().text('租用厂房');
	    center_title.css('background', '#12385F');
	    exit.css('background', '#355A87');
	    myDiv.empty().load('newRent.html', null, function () {
		    newRent();
      popupShow();
    });
  });

	// 新建生产线弹框
  $(document).on('click', 'input[name=\'add\']', function () {
    var $dl = $(this).parents('dl');
    var status = $dl.find('.status span').text();  // 厂房状态
    var finishBuild = $dl.find('.finished').text();
	    var lineCount = $dl.find('.currentLine').text();  // 现有生产线数量
    var totalLine = $dl.find('.totalLine').text();  // 能容纳生产线数量
		// 生产线是否可以新建
    if (status == '租用中' && finishBuild != '租赁厂房可用') { alert('等待周期未结束，无法增加生产线'); }		else if (lineCount == totalLine) {
      alert('该厂房能容纳的生产线已满');
    }		else {
      factoryId = $(this).parents('dt').siblings('.workshop_id ').find('span').text();  // 厂房编号
      dialog.css('border', '1px solid #336600');
      center_title.empty().text('新建生产线');
      center_title.css('background', '#12385F');
      exit.css('background', '#355A87');
      myDiv.empty().load('newLine.html', null, function () {
        newLine();
        popupShow();
      });
    }
  });

	// 查看订货会信息
  $('#btn4').click(function () {
	    dialog.css('border', '1px solid #336600');
	    center_title.empty().text('查看订货会信息');
	    center_title.css('background', '#12385F');
	    exit.css('background', '#355A87');
	    myDiv.empty().load('start_checkOrder.html', null, function () {
		    overOrder();
		    popupShow();
    });
  });

	// 查看所有订单信息
  $('#btn5').click(function () {
    dialog.css('border', '1px solid #336600');
	    center_title.empty().text('查看所有订单信息');
	    center_title.css('background', '#12385F');
	    exit.css('background', '#355A87');
	    myDiv.empty().load('start_checkAllOrder.html', null, function () {
		    overAllOrder();
		    popupShow();
    });
  });
});

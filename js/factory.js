// 加载生产线数据
function Line(data, target, lines, index, i, num) {
  for (var j = 0; j < lines[i].productLineType.length; j++) {
    num += lines[i].productLineType.charCodeAt(j);
  }
  // 计算生产线图片
  $(target).find('.lineType img').attr('src', '../../images/factory/' + num + '.jpg');
  // 生产线类型
  $(target).find('.lineType span').text(lines[i].productLineType);

  // 生产线状态
  var status = +lines[i].status;
  var str = '';

  if (status === 0 || status === 1) {
    // 生产线已完成安装周期
    $(target).find('.finishedPeriod').html('已完成周期：<span>' + lines[i].finishPeriod + '</span>');
    $(target).find('.workingPro').html('将生产的产品：<span>' + lines[i].productName + '</span>');
    if (status === 0) {
      str = '正在安装';
      $(target).find('.lineStatus span').text(str);
    } else {
      str = '暂停安装';
      $(target).find('.lineStatus span').text(str);
    }
  } else if (status === 2 || status === 3 || status === 4) {
    // 产品已生产周期
    $(target).find('.finishedPeriod').html('已生产周期：<span>' + lines[i].productFinishPeriod + '</span>');

    if (status === 2) {
      str = '正在生产';
      $(target).find('.lineStatus span').text(str);

      // 正在生产产品
      $(target).find('.workingPro').html(str + '产品：<span>' + lines[i].productName + '</span>');
    } else if (status === 3) {
      str = '暂停生产';
      $(target).find('.lineStatus span').text(str);

      // 正在生产产品
      $(target).find('.workingPro').html(str + '产品：<span>' + lines[i].productName + '</span>');
    } else if (status === 4) {
      str = '待生产';
      $(target).find('.lineStatus span').text(str);

      // 产品
      $(target).find('.workingPro').html(str + '产品：<span>' + lines[i].productName + '</span>');

      // 能点击转产
      $(target).find('input[name="changePro"]').css('cursor', 'pointer').removeAttr('disabled');

      // 此状态下可以出售
      $(target).find('input[name="sell"]').css('cursor', 'pointer').removeAttr('disabled');
    }
  } else if (status === 5 || status === 6) {
    // 生产线已完成转产周期
    $(target).find('.finishedPeriod').html('已转产周期：<span>' + lines[i].finishPeriod + '</span>');

    if (status === 5) {
      str = '正在转产';
      $(target).find('.lineStatus span').text(str);

      // 产品
      $(target).find('.workingPro').html(str + '产品：<span>' + lines[i].productName + '</span>');
    } else {
      str = '暂停转产';
      $(target).find('.lineStatus span').text(str);

      // 产品
      $(target).find('.workingPro').html(str + '产品：<span>' + lines[i].productName + '</span>');
    }
  } else return;

  // 储存生产线编号
  $(target).find('input[name=\'hidden\']').val(lines[i].productLineId);
  // 储存生产线状态
  $(target).find('input[name=\'hiddenStatus\']').val(lines[i].status);
}

// 加载全部厂房数据的方法
function update(url, oData, backUp1, backUp3) {
  $.post(url, oData, function (data) {
    var obj = data;
    // 所有厂房先清空后加载
    $('.workshop').empty();

    var factoryMadeNum = 0;
    var factoryRentNum = 0;
    // var factoryMakingNum=data.factoryMaking.length;
    // 加载已建成厂房
    if (data.factoryMade) {
      factoryMadeNum = data.factoryMade.length;
      $(data.factoryMade).each(function (index) {
        $(backUp1).clone(true).appendTo('.workshop');

        var tar = $('.workshop dl').eq(index);
        var factoryEach = data.factoryMade[index];
        $(tar).find('.shop').attr('src', '../../images/factory/made.jpg');
        // 状态
        $(tar).find('.status span').text(factoryEach.status);
        // 厂房编号
        $(tar).find('.workshop_id span').text(factoryEach.factoryId);
        // 所在市场
        $(tar).find('.market_area span').text(factoryEach.place);
        // 厂房类型
        $(tar).find('.workshop_type span').text(factoryEach.factoryType);
        // 残值
        $(tar).find('.restvalue span').text(factoryEach.sellPrice);
        // 开工时间
        $(tar).find('.buildtime span').text(factoryEach.beginTime);
        // 完工时间
        $(tar).find('.finished').text(factoryEach.finishTime);
        // 生产线现有数量
        $(tar).find('.currentLine').text(factoryEach.productLineNumber);
        // 可容纳生产线
        $(tar).find('.totalLine').text(factoryEach.capacity);

        var backUpLine = $(tar).find('#hiddenLine').clone(true).removeAttr('id');
        $('#hiddenLine').remove();
        // 生产线备份，清空，然后重新创建
        $(tar).find('dd').remove();

        // 加载生产线数据
        if (factoryEach.productLines) {
          var num = 0;
          var lines = factoryEach.productLines;

          for (var i = 0; i < lines.length; i++) {
            $(backUpLine).clone(true).appendTo(tar);

            var target = $(tar).find('dd:eq(' + i + ')');

            $('input[name=\'sell\']').css('cursor', 'auto');
            $('input[name=\'changePro\']').css('cursor', 'auto');

            // 根据生产线的状态来读取数据
            Line(obj, target, lines, index, i, num);
            num = 0;
          }
        }

        var productLines = $(tar).children('dd'); // 获取所有生产线

        for (i = 0; i < productLines.length; i++) {
          var lineStatus = $(productLines[i]).children().eq(1).children().html();
          var lineCycle = +$(productLines[i]).children().eq(2).children().html();

          if (lineStatus === '正在安装' && lineCycle === 0) {
            $(productLines[i]).append('<input type=\'button\' class=\'withdraw\' value=\'撤销\'>');
          }
        }

        $('.withdraw').on('click', function () {
          if (confirm('确认撤销吗？')) {
            var _this = this;
            var productLineId = $(_this).siblings('.operateLine').children().eq(4).val();

            $.get('productLineAction!withdrawProductLine.action', { 'productLineId': productLineId }, function (res) {
              var resp = JSON.parse(res);
              alert(resp.message);
              if (+res.status === 0) {
                $(_this).parent().remove();
              }
            });
          }
        });
      });
    }

    // 加载租用中厂房
    if (data.factoryRent) {
      factoryRentNum = data.factoryRent.length;
      $(data.factoryRent).each(function (index) {
        $(backUp1).clone(true).appendTo('.workshop');
        var tar = $('.workshop dl').eq(index + factoryMadeNum);
        var factoryEach = data.factoryRent[index];
        $(tar).find('.shop').attr('src', '../../images/factory/rent.jpg');
        // 状态
        $(tar).find('.status span').text(factoryEach.status);
        // 厂房编号
        $(tar).find('.workshop_id span').text(factoryEach.factoryId);
        // 所在市场
        $(tar).find('.market_area span').text(factoryEach.place);
        // 厂房类型
        $(tar).find('.workshop_type span').text(factoryEach.factoryType);
        $(tar).find('.restvalue p').text('每期需要交纳的租金');
        // 每期需要交纳的租金
        $(tar).find('.restvalue span').text(factoryEach.rentCost);
        // 残值
        $(tar).find('.buildtime p').text('残值');
        $(tar).find('.buildtime span').text(factoryEach.sellPrice);
        // 等待使用为0，就显示可用
        if (+factoryEach.needPeriod === 0) {
          $(tar).find('.finished').text('租赁厂房可用');
        } else {
          $(tar).find('.builttime p').text('等待使用周期');
          // 等待使用周期
          $(tar).find('.finished').text(factoryEach.needPeriod);
        }
        // 生产线现有数量
        $(tar).find('.currentLine').text(factoryEach.productLineNumber);
        // 可容纳生产线
        $(tar).find('.totalLine').text(factoryEach.capacity);
        $(tar).find('.operateFactory input').removeClass('sell').addClass('stopRent').val('租用中');

        var backUpLine = $(tar).find('#hiddenLine').clone(true).removeAttr('id');
        $('#hiddenLine').remove();
        $(tar).find('dd').remove();

        // 加载生产线数据
        if (factoryEach.productLines) {
          var num = 0;
          var lines = factoryEach.productLines;
          for (var i = 0; i < lines.length; i++) {
            $(backUpLine).clone(true).appendTo(tar);
            var target = $(tar).find('dd:eq(' + i + ')');

            $('input[name=\'sell\']').css('cursor', 'auto');
            $('input[name=\'changePro\']').css('cursor', 'auto');

            // 根据生产线的状态来读取数据
            Line(obj, target, lines, index, i, num);

            num = 0;
          }
        }
      });
    }

    // 加载修建中厂房
    if (data.factoryMaking) {
      $(data.factoryMaking).each(function (index) {
        $(backUp3).clone(true).appendTo('.workshop');

        var tar = $('.workshop dl').eq(index + factoryMadeNum + factoryRentNum);
        var factoryEach = data.factoryMaking[index];
        $(tar).find('.shop').attr('src', '../../images/factory/making.jpg');
        $(tar).find('.status span').text(factoryEach.status);  // 状态
        $(tar).find('.workshop_id span').text(factoryEach.factoryId);  // 厂房编号
        $(tar).find('.market_area span').text(factoryEach.place);  // 厂房位置
        $(tar).find('.workshop_type span').text(factoryEach.factoryType);  // 类型
        $(tar).find('.paytype span').text(factoryEach.payMode);  // 支付方式
        $(tar).find('.buildtime span').text(factoryEach.beginTime);  // 开工时间
        $(tar).find('.builttime span').text(factoryEach.finishedPeriod);  // 已完成建造周期
        $(tar).find('.buildPerioud span').text(factoryEach.makePeriod);  // 总建造周期
        $(tar).find('.lines span').text(factoryEach.capacity);  // 能容纳生产线
        if (factoryEach.status === '修建中') {
          $(tar).find('.operateFactory input').val('暂停修建');
          $(tar).find('.operateFactory input').removeClass('building').addClass('stopping');
        } else {
          $(tar).find('.operateFactory input').val('继续修建');
          $(tar).find('.operateFactory input').removeClass('stopping').addClass('building');
        }
      });
    }
  }, 'json');
}

// 重新加载某一条生产线信息
function updateLine(url, oData, target) {
  var zhuanchan = target[0];

  $.post(url, oData, function (data) {
    $('.changePro').css('display', 'none');

    if (!data) {
      alert('生产原料库存不够!无法生产');
      return;
    }

    // wxy
    var str;

    $(target).siblings('input[name="changePro"]').attr('disabled', 'true');
    $(target).siblings('input[name="sell"]').attr('disabled', 'true');

    switch (+(data.status)) {
    case 0: {
      str = '正在安装';
      alert('当前状态无法转产');
      break;
    }
    case 1: {
      str = '暂停安装';
      break;
    }
    case 2: {
      str = '正在生产';
      break;
    }
    case 3: {
      str = '暂停生产';
      break;
    }
    case 4: {
      str = '待生产';

      // 转产按钮可以点击
      $(zhuanchan)
        .css('cursor', 'pointer')
        .removeAttr('disabled');

      // 出售按钮可以点击
      $(target).siblings('input[name="sell"]')
        .css('cursor', 'pointer')
        .removeAttr('disabled');
      break;
    }
    case 5: {
      str = '正在转产';
      $(zhuanchan).attr('disabled', 'true');
      break;
    }
    case 6: {
      str = '暂停转产';
      break;
    }
    default: break;
    }
    $(target).parents('dd').find('.lineType span').text(data.productLineType);  // 类型
    $(target).parents('dd').find('.finishedPeriod span').text(data.productFinishPeriod);  // 已完成周期
    $(target).parents('dd').find('.lineStatus span').text(str);  // 生产线状态
    $(target).parents('dd').find('.workingPro').html(str + '产品：<span>' + data.productName + '</span>');  // 产品名称
    $(target).parents('dd').find('input[name=\'hiddenStatus\']').val(data.status);  // line status
    $('.configure p:eq(' + data.status + ')').show();
    $('.configure p:lt(' + data.status + ')').hide();
    $('.configure p:gt(' + data.status + ')').hide();
  }, 'json');
}

$(function () {
  $('.workshop .bg3:first-child dt:first-child').css({'background': '#fff'});
  // 生产线隐藏
  $('dd').hide();
  window.backUp1 = $('#hidden1').clone(true).removeAttr('id');
  $('#hidden1').remove();
  window.backUp3 = $('#hidden2').clone(true).removeAttr('id');
  $('#hidden2').remove();

  // 加载select框内容
  /* $.post("factory.json",null,function(data){
        //each遍历添加
        $("select[name='workshopStatus']").append("<option>"+"这里是data.[]"+"</option>");
     $("select[name='marketArea']").append("<option>"+"这里是data.[]"+"</option>");
    },"json");
  */

  // 根据市场所在地、状态查询
  $('.choose_status, .choose_market, .search_btn').click(function () {
    var selected1 = $('select[name=\'workshopStatus\'] option:selected').val();
    var selected2 = $('select[name=\'marketArea\'] option:selected').val();
    update('factoryAction!getFactoryByWorkshopStatusAndMarketArea.action', {
      'worshopStatus': selected1,
      'marketArea': selected2
    }, backUp1);
  });

  // select查询按钮
  $('.search_btn').hover(function () {
    $(this).removeClass('bg1').addClass('bg2');
    $(this).css({'font-size': '16px'});
  }, function () {
    $(this).removeClass('bg2').addClass('bg1');
    $(this).css({'font-size': '14px'});
  });

  // 点击展开生产线
  $(document).on('click', '.down', function () {
    if ($(this).find('.down_btn').attr('src') === '../../images/factory/down_btn2.gif') {
      $(this).find('.down_btn').removeAttr('src').attr('src', '../../images/factory/down_btn1.gif');
    } else {
      $(this).find('.down_btn').removeAttr('src').attr('src', '../../images/factory/down_btn2.gif');
    }
    $(this).parents('.bg3').nextAll('dd').slideToggle(500);
  });


    // 查看悬浮框
    /* $(document).on("mouseenter","input[name='examine']",function(){
         $(this).removeClass("bg1").addClass("bg4");
        }); */
  $(document).on('mouseleave', 'input[name=\'examine\']', function () {
    var timer = setTimeout(function () {
      $('.examine').hide();
      $('input[name=\'examine\']').removeClass('bg4').addClass('bg1');
    }, 100);
    // 使鼠标可以悬停而不收回，mouseover不可行
    $('.examine').mouseenter(function () {
      clearTimeout(timer);
    }).mouseleave(function () {
      $('.examine').hide(500);
      $('input[name=\'examine\']').removeClass('bg4').addClass('bg1');
    });
    // 停止还在排队的动画
    $('.examine').stop(true, true);
  });
  // 点击后才查看，并加载信息
  $(document).on('click', 'input[name=\'examine\']', function () {
    // 点击传值：生产线编号
    var lineId = $(this).siblings('input[name=\'hidden\']').val();
    $.post('productLineAction!getProductLineDetail.action', {'productLineId': lineId}, function (data) {
      $('.lineInfo1 p,.lineInfo2 p').empty();
      // 加载信息
      var status = +data.status;
      if (status === 0 || status === 1) {
        $('.lineInfo1 .p1').text('离安装完成还差 ' + (data.setupPeriod - data.finishPeriod) + ' 周期').css('font-weight', 'bold');
        $('.lineInfo1 .p2').text('需安装周期：' + data.setupPeriod);
        $('.lineInfo1 .p3').text('安装每期所需费用：' + data.setupPeriodPrice);
        $('.lineInfo2 .p1').text('生产效率：' + data.producePeriod);
        $('.lineInfo2 .p2').text('残值数额：' + data.sellPrice);
        $('.lineInfo2 .p3').text('生产线开始使用后每期所需维护费：' + data.mainCost);
        $('.lineInfo2 .p4').text('生产线开始使用后每期所需折旧费：' + data.depreciation);
        $('.lineInfo2 .p5').text('出售生产线后资金到帐的账期：' + data.delayTime);
      } else if (status === 2 || status === 3 || status === 4) {
        $('.lineInfo1 .p1').text('离产品生产完成还差 ' + (data.producePeriod - data.productFinishPeriod) + '周期').css('font-weight', 'bold');
        $('.lineInfo2 .p1').text('生产效率：' + data.producePeriod);
        $('.lineInfo2 .p2').text('残值数额：' + data.sellPrice);
        $('.lineInfo2 .p3').text('生产线开始使用后每期所需维护费：' + data.mainCost);
        $('.lineInfo2 .p4').text('生产线开始使用后每期所需折旧费：' + data.depreciation);
        $('.lineInfo2 .p5').text('出售生产线后资金到帐的账期：' + data.delayTime);
      } else if (status === 5 || status === 6) {
        $('.lineInfo1 .p1').text('离转成生产 ' + data.productName + ' 产品生产线');
        $('.lineInfo1 .p2').text('还差' + (data.changePeriod - data.finishPeriod) + '周期');
        $('.lineInfo1 .p3').text('转产每期所需费：' + data.changeCost);
        $('.lineInfo2 .p1').text('生产效率：' + data.producePeriod);
        $('.lineInfo2 .p2').text('残值数额：' + data.sellPrice);
        $('.lineInfo2 .p3').text('生产线开始使用后每期所需维护费：' + data.mainCost);
        $('.lineInfo2 .p4').text('生产线开始使用后每期所需折旧费：' + data.depreciation);
        $('.lineInfo2 .p5').text('出售生产线后资金到帐的账期：' + data.delayTime);
      } else return;
    }, 'json');
    // 显示查看信息
    var w = $(this).offset().left - 60;
    var h = $(this).offset().top + 29;
    $('.examine').slideDown(500).css({
      'left': w + 'px',
      'top': h + 'px',
      'display': 'block'
    });
  });

  $(document).on('mouseleave', 'input[name=\'changePro\']', function () {
    var timer = setTimeout(function () {
      $('.changePro').hide(500);
      $('input[name=\'changePro\']').removeClass('bg4').addClass('bg1');
    }, 100);
    $('.changePro').mouseenter(function () {
      clearTimeout(timer);
    }).mouseleave(function () {
      if (window.event.toElement === null) { return; }
      $('.changePro').hide();
      $('input[name=\'changePro\']').removeClass('bg4').addClass('bg1');
    });
    $('.changePro').stop(true, true);
  });

  $(document).on('click', 'input[name="changePro"]', function () {
    _thisLine = $(this);

    // 点击传值：生产线编号并加载该组能够转产的产品
    var lineId = $(this).siblings('input[name="hidden"]').val();

    $.post('factoryAction!getDevelopedProduct.action', function (data) {
      $('select[name="choosePro"]').empty();

      for (var i = 0; i < data.length; i++) {
        $('select[name="choosePro"]').append('<option>' + data[i].productName + '</option>');
      }
    }, 'json');

    var w = $(this).offset().left - 77;
    var h = $(this).offset().top + 29;

    $('.changePro').slideDown(500).css({
      'left': w + 'px',
      'top': h + 'px',
      'display': 'block'
    });
  });

  // 点击确认转产按钮---传生产线ID、和要转产的产品
  $(document).on('click', 'input[name="confirmChange"]', function () {
    if (confirm('是否确认转产？确认后将无法撤销。')) {
      var product = $(this).prev().find('select[name="choosePro"] option:selected').text(); // 选择的产品
      var lineId = $(_thisLine).siblings('input[name="hidden"]').val();

      // 重新刷新该条生产线
      updateLine('productLineAction!startChangeProduct.action', {
        'productLineId': lineId,
        'productName': product
      }, _thisLine);
    }
  });

  // select延时
  $('select[name=\'choosePro\']').hover(function () {
    $('.changePro').css({'display': 'block'});
  }, function () {
    $('.changePro').css({'display': 'block'});
    var timer = setTimeout(function () {
      $('this').hide(500);
    }, 500);
    $('option').mouseenter(function () {
      clearTimeout(timer);
    });
    $('.configure').stop(true, true);
  });
	// 确认转产按钮样式
  $('.changePro input').hover(function () {
    $(this).css({'cursor': 'pointer', 'width': '135px', 'height': '35px'});
  }, function () {
    $(this).css({'width': '133px', 'height': '33px'});
  });


  $(document).on('mouseleave', 'input[name=\'configure\']', function () {
    var timer = setTimeout(function () {
	    $('.configure').hide();
	    $('input[name=\'configure\']').removeClass('bg4').addClass('bg1');
    }, 100);
    $('.configure').mouseenter(function () {
      clearTimeout(timer);
    }).mouseleave(function () {
      $('input[name=\'configure\']').removeClass('bg4').addClass('bg1');
      $('.configure').hide(500);
    });
    $('.configure').stop(true, true);
  });


  $(document).on('click', 'input[name=\'configure\']', function () {
	  _thisLine = $(this);
    $('.configure p').css('display', 'block');
		// 获得配置下可以点击的按钮
	  var status = $(_thisLine).siblings('input[name=\'hiddenStatus\']').val();   // 加载生产线时储存的status
    $('.configure p:lt(' + status + ')').hide();
    $('.configure p:gt(' + status + ')').hide();

    var w = $(this).offset().left - 77;
    var h = $(this).offset().top + 29;
    $('.configure').slideDown(500).css({
      'left': w + 'px',
      'top': h + 'px',
      'display': 'block'
    });
	  lineId = $(this).siblings('input[name=\'hidden\']').val();   // 点击配置得到该生产线的ID
  });


	// 配置下各按钮样式
  $('.configure input').hover(function () {
    $(this).css({'cursor': 'pointer', 'width': '135px', 'height': '35px'});
  }, function () {
    $(this).css({'width': '133px', 'height': '33px'});
  });


  // 点击配置下的按钮，传生产线ID、和要改变的状态
  $(document).on('click', '.configure input', function () {
    var str = $(this).val();
    updateLine('productLineAction!allConfigOperate.action', {
      'productLineId': lineId,
      'status': str
    }, _thisLine);
  });


	// 查看、转产、配置、出售生产线按钮样式
  $(document).on('mouseenter', 'input[name=\'sell\'],input[name=\'configure\'],input[name=\'changePro\'],input[name=\'examine\']', function () {
    $(this).removeClass('bg1').addClass('bg4');
  });
  $(document).on('mouseleave', 'input[name=\'sell\']', function () {
    $(this).removeClass('bg4').addClass('bg1');
  });


	// 出售生产线
  $(document).on('click', 'input[name=\'sell\']', function () {
    var lineId = $(this).siblings('input[name=\'hidden\']').val();
    var ok = confirm('是否确认出售该条生产线');
    if (ok) {
      $.post('productLineAction!sellProductLine.action', {'productLineId': lineId});
      $(this).parents('dd').hide(1000);
      currentLine = $(this).parents('dl').find('.currentLine');
      $(currentLine).text($(currentLine).text() - 1);
    } else { return false; }
  });

	// 出售、停止租用、停止修建、继续修建按钮样式
  $(document).on('mouseenter', '.operateFactory input', function () {
    $(this).removeClass('bg1').addClass('bg2');
    $(this).css({'font-size': '20px'});
  });
  $(document).on('mouseleave', '.operateFactory input', function () {
    $(this).removeClass('bg2').addClass('bg1');
    $(this).css({'font-size': '18px'});
  });

	// 出售、停止租用厂房
  $(document).on('click', '.sell', function () {
    var lineCount = +$(this).parents('dl').find('.currentLine').text();  // 厂房中现有的生产线数量
    var factoryId = $(this).parents('dl').find('.workshop_id span').text();  // 厂房编号
    if (!lineCount) {
      if (confirm('是否确认出售该厂房')) {
        $.post('factoryAction!sellUsingFactory.action', {'factoryId': factoryId});  // 成功出售传--厂房ID
        $(this).parents('.workshop_info').remove();
      }
      // else { return false; }
    } else {
      alert('有生产线，不能出售！');
    }
  });

  $(document).on('click', '.stopRent', function () {
    var lineCount = +$(this).parents('dl').find('.currentLine').text();  // 厂房中现有的生产线数量
    var factoryId = $(this).parents('dl').find('.workshop_id span').text();  // 厂房编号
    if (!lineCount) {
      if (confirm('是否停止租用该厂房')) {
        $.post('factoryAction!stopFactoryRent.action', {'factoryId': factoryId});  // 成功出售传--厂房ID
        $(this).parents('.workshop_info').remove();
      }
      // else { return false; }
    } else {
      alert('有生产线，不能停止租用！');
    }
  });

	// 停止修建、继续修建
  $(document).on('click', '.building, .stopping', function () {
    var factoryId = $(this).parents('dl').find('.workshop_id span').text();  // 厂房编号
    if ($(this).val().trim() === '暂停修建') {
      $(this).val('继续修建');
		  $(this).parents('dl').find('.status span').text('暂停中');
		  $.post('factoryAction!stopFactoryMaking.action', {'factoryId': factoryId});  // 成功暂停、继续传--厂房ID
    } else if ($(this).val().trim() === '继续修建') {
      $(this).val('暂停修建');
      $(this).parents('dl').find('.status span').text('修建中');
      $.post('factoryAction!startFactoryMaking.action', {'factoryId': factoryId});  // 成功暂停、继续传--厂房ID
    }
		// else return false;
  });


  update('factoryAction!getAllFactoryAndProductLine.action', null, backUp1, backUp3);
});

/**
 * 产品研发 & 认证
 */

$(function () {
  // 创建新的产品

  // 新的产品
  var newDiv = $('#hidden_ISO').clone(true).removeAttr('id');

  // 创建研发中的产品
  var createDiv = $('#hidden_ISOing').clone(true).removeAttr('id');
  $('#hidden_ISOing').remove();

  // 动态生成图片
  var createImgS1 = $('.img_s1').clone(true);
  $('.img_s1').remove();

  var createImgS2 = $('.img_s2').clone(true);
  $('.img_s2').remove();

  var createImgM1 = $('.img_m1').clone(true);
  $('.img_m1').remove();

  var createImgM2 = $('.img_m2').clone(true);
  $('.img_m2').remove();

  // 新的 ISO 开始
  function show() {
    $.getJSON('isoManageAction!showISO.action?rnd=' + Math.random(), function (data) {
      showISO(data);

      $('.img_s1, .img_m1').hover(function () {
        $('.suspension1').css('display', 'block');
      }, function () {
        $('.suspension1').css('display', 'none');
      });

      $('.img_s2, .img_m2').hover(function () {
        $('.suspension2').css('display', 'block');
      }, function () {
        $('.suspension2').css('display', 'none');
      });
    });
  }

  show();

  // 展示 ISO
  function showISO(data) {
    // 初始化
    $('.market-bar').remove();
    $('.img_s1,.img_s2,.img_m1,.img_m2').remove();
    $('.img_f1').css('display', 'block');
    $('.img_f2').css('display', 'block');

    // 遍历 isoUndevelopList
    $.each(data.isoUndevelopList, function (i) {
      // 创建外面的框
      $(newDiv).clone(true).appendTo('.undevelop_ISO');

      if (data.isoUndevelopList[i].isoName == 'PRODUCT9000质量认证') {
        // 设置class
        $('.img_ISO').removeClass().addClass('img_ISO1');
        $('.ISO').removeClass().addClass('market-bar ISO1');
        $('<img src="../../images/9000.gif">').appendTo('.img_ISO1');
        $('#un_state').removeAttr('id', 'un_state2').attr('id', 'un_state1');

        // 传值
        $('.ISO1').find('h2').eq(0).text(data.isoUndevelopList[i].isoName);
        $('.ISO1').find('h2').eq(1).text(data.isoUndevelopList[i].researchPeriod);
        $('.ISO1').find('h2').eq(2).text(data.isoUndevelopList[i].researchCost);
        $('.ISO1').find('h2').eq(3).text(data.isoUndevelopList[i].maintainCost);
      }

      if (data.isoUndevelopList[i].isoName == 'PRODUCT1400质量认证') {
        // 设置class
        $('.img_ISO').removeClass().addClass('img_ISO2');
        $('.ISO').removeClass().addClass('market-bar ISO2');
        $('<img src="../../images/1400.gif"/>').appendTo('.img_ISO2');
        $('#un_state').removeAttr('id', 'un_state1').attr('id', 'un_state2');

        // 传值
        $('.ISO2').find('h2').eq(0).text(data.isoUndevelopList[i].isoName);
        $('.ISO2').find('h2').eq(1).text(data.isoUndevelopList[i].researchPeriod);
        $('.ISO2').find('h2').eq(2).text(data.isoUndevelopList[i].researchCost);
        $('.ISO2').find('h2').eq(3).text(data.isoUndevelopList[i].maintainCost);
      }
    });

    // 认证中的 ISO 开始
    $.each(data.isoDevelopingList, function (i) {
      $(createDiv).clone(true).appendTo('.develop_ISO');

      if (data.isoDevelopingList[i].isoName == 'PRODUCT9000质量认证') {
        // 设置class
        $('.img_ISOing').removeClass().addClass('img_ISOing1');
        $('<img src="../../images/9000.gif">').appendTo('.img_ISOing1');
        $('.ISOing').removeClass().addClass('market-bar develop_ISO1 ');
        $('#state').removeAttr('id', 'state2').attr('id', 'state1'); // 控制按钮切换
        $('#state1').removeClass().addClass('state current_btn1'); // 控制按钮切换
        $('#current').removeAttr('id', 'current2').attr('id', 'current1'); // 控制按钮切换
        $('#current1').removeClass().addClass('current1'); // 控制按钮切换

        // 传值
        $('.develop_ISO1').find('h2').eq(0).text(data.isoDevelopingList[i].isoName);
        $('.develop_ISO1').find('h2').eq(1).text(data.isoDevelopingList[i].researchPeriod);
        $('.develop_ISO1').find('h2').eq(2).text(data.isoDevelopingList[i].researchCost);
        $('.develop_ISO1').find('h2').eq(3).text(data.isoDevelopingList[i].finishedPeriod);
        $('.develop_ISO1').find('h2').eq(4).text(data.isoDevelopingList[i].beginTime);

        if (data.isoDevelopingList[i].status == '1') {
          $('.develop_ISO1').find('h2').eq(5).text('正在开发');
          $('.develop_ISO1').find('h2').eq(6).text('暂停开发');

          $('#state1').click(function () {
            $.post('isoManageAction!updateISODevelopingStatusToZero.action?rnd=' + Math.random(), {
              'isoName': 'PRODUCT9000质量认证'
            }, function () {
              show();
            });
          });
        }

        if (data.isoDevelopingList[i].status == '0')	{
          $('.develop_ISO1').find('h2').eq(5).text('暂停开发');
          $('.develop_ISO1').find('h2').eq(6).text('开始开发');

          $('#state1').click(function () {
            $.post('isoManageAction!updateISODevelopingStatusToOne.action?rnd=' + Math.random(), {
              'isoName': 'PRODUCT9000质量认证'
            }, function () {
              show();
            });
          });
        }

        $('#state1').click(function () {
          // 按钮切换
          if (data.isoDevelopingList[i].status == '1') {
            change1('#state1', '.current_btn1', '#current1', '.begin1', 'current_btn1', 'begin1');
          }

          if (data.isoDevelopingList[i].status == '0') {
            change0('#state1', '.current_btn1', '#current1', '.begin1', 'current_btn1', 'begin1');
          }
        });
      }

      if (data.isoDevelopingList[i].isoName == 'PRODUCT1400质量认证') {
        // 设置class
        $('.img_ISOing').removeClass().addClass('img_ISOing2');
        $('<img src="../../images/1400.gif">').appendTo('.img_ISOing2');
        $('.ISOing').removeClass().addClass('market-bar develop_ISO2 ');
        $('#state').removeAttr('id', 'state1').attr('id', 'state2'); // 控制按钮切换
        $('#state2').removeClass().addClass('state current_btn2'); // 控制按钮切换
        $('#current').removeAttr('id', 'current1').attr('id', 'current2'); // 控制按钮切换
        $('#current2').removeClass().addClass('current2'); // 控制按钮切换

        // 传值
        $('.develop_ISO2').find('h2').eq(0).text(data.isoDevelopingList[i].isoName);
        $('.develop_ISO2').find('h2').eq(1).text(data.isoDevelopingList[i].researchPeriod);
        $('.develop_ISO2').find('h2').eq(2).text(data.isoDevelopingList[i].researchCost);
        $('.develop_ISO2').find('h2').eq(3).text(data.isoDevelopingList[i].finishedPeriod);
        $('.develop_ISO2').find('h2').eq(4).text(data.isoDevelopingList[i].beginTime);

        if (data.isoDevelopingList[i].status == '1') {
          $('.develop_ISO2').find('h2').eq(5).text('正在开发');
          $('.develop_ISO2').find('h2').eq(6).text('暂停开发');

          $('#state2').click(function () {
            $.post('isoManageAction!updateISODevelopingStatusToZero.action?rnd=' + Math.random(), {
              'isoName': 'PRODUCT1400质量认证'
            }, function () {
              show();
            });
          });
        }

        if (data.isoDevelopingList[i].status == '0') {
          $('.develop_ISO2').find('h2').eq(5).text('暂停开发');
          $('.develop_ISO2').find('h2').eq(6).text('开始开发');

          $('#state2').click(function () {
            $.post('isoManageAction!updateISODevelopingStatusToOne.action?rnd=' + Math.random(), {
              'isoName': 'PRODUCT1400质量认证'
            }, function () {
              show();
            });
          });
        }

        $('#state2').click(function () {
          // 按钮切换
          if (data.isoDevelopingList[i].status == '1') {
            change1('#state2', '.current_btn2', '#current2', '.begin2', 'current_btn2', 'begin2');
          }

          if (data.isoDevelopingList[i].status == '0') {
            change0('#state2', '.current_btn2', '#current2', '.begin2', 'current_btn2', 'begin2');
          }
        });
      }
    });

    // 已经完成的 ISO 认证
    $.each( data.isoDevelopedList, function (i) {
      if (data.isoDevelopedList[i].isoName == 'PRODUCT9000质量认证') {
        $('.img_f1').css('display', 'none');

        if (data.isoDevelopedList[i].status == 1) {
          $('.img_m1').remove();
          $(createImgS1).clone(true).appendTo('.small_div1');
        }

        if (data.isoDevelopedList[i].status == 0) {
          $('.img_s1').remove();
          $(createImgM1).clone(true).appendTo('.small_div1');
        }

        // 悬浮框内展示的内容
        $('.suspension1').find('span').eq(0)
          .text('ISO名称：' + data.isoDevelopedList[i].isoName)
          .css('font-weight', 'bold');

        $('.suspension1').find('span').eq(1).text('开始时间：' + data.isoDevelopedList[i].beginTime);
        $('.suspension1').find('span').eq(2).text('结束时间：' + data.isoDevelopedList[i].endTime);

        if (data.isoDevelopedList[i].lastStatus == 0) {
          $('.suspension1').find('span').eq(3).text('上一周维护状态：未维护');
        }

        if (data.isoDevelopedList[i].lastStatus == 1) {
          $('.suspension1').find('span').eq(3).text('上一周维护状态：已维护');
        }

        $('.suspension1').find('span').eq(4).text('维护费用：' + data.isoDevelopedList[i].maintainCost);
      }

      if (data.isoDevelopedList[i].isoName == 'PRODUCT1400质量认证') {
        $('.img_f2').css('display', 'none');

        if (data.isoDevelopedList[i].status == 1) {
          $('.img_m2').remove();
          $(createImgS2).clone(true).appendTo('.small_div2');
        }

        if (data.isoDevelopedList[i].status == 0) {
          $('.img_s2').remove();
          $(createImgM2).clone(true).appendTo('.small_div2');
        }

        // 悬浮框内展示的内容
        $('.suspension2').find('span').eq(0)
          .text('ISO名称：' + data.isoDevelopedList[i].isoName)
          .css('font-weight', 'bold');
        $('.suspension2').find('span').eq(1).text('开始时间：' + data.isoDevelopedList[i].beginTime);
        $('.suspension2').find('span').eq(2).text('结束时间：' + data.isoDevelopedList[i].endTime);

        if (data.isoDevelopedList[i].lastStatus == 0) {
          $('.suspension2').find('span').eq(3).text('上一周维护状态：未维护');
        }

        if (data.isoDevelopedList[i].lastStatus == 1) {
          $('.suspension2').find('span').eq(3).text('上一周维护状态：已维护');
        }

        $('.suspension2').find('span').eq(4).text('维护费用：' + data.isoDevelopedList[i].maintainCost);
      }
    });

    // 控制变色
    var oState = $('.state');

    for (var i = 0; i < oState.length; i++) {
      oState[i].onmouseover = function () {
        this.style.background = '#d1ba74';
      };

      oState[i].onmouseout = function () {
        this.style.background = '#dbdad6';
      };
    }

    // 控制按钮 1 切换
    var change1 = function (_id, _current_btn, _current, _begin, current_btn, begin) {
      if ($(_id).hasClass(current_btn)) {
        // 暂停研发
        $(_current).empty().append('<h2>暂停开发</h2>');
        $(_current_btn).empty().append('<h2>开始开发</h2>');
        $(_id).removeClass(current_btn).addClass(begin);
      }

      if ($(_id).hasClass(begin)) {
        // 继续研发
        $(_current).empty().append('<h2>正在开发</h2>');
        $(_begin).empty().append('<h2>暂停开发</h2>');
        $(_begin).removeClass(begin).addClass(current_btn);
      }
    };

    // 控制按钮 0 切换
    var change0 = function (_id, _current_btn, _current, _begin, current_btn, begin) {
      if ($(_id).hasClass(current_btn)) {
        // 暂停研发
        $(_current).empty().append('<h2>正在开发</h2>');
        $(_current_btn).empty().append('<h2>暂停开发</h2>');
        $(_id).removeClass(current_btn).addClass(begin);
      }

      if ($(_id).hasClass(begin)) {
        // 继续研发

        $(_current).empty().append('<h2>暂停开发</h2>');
        $(_begin).empty().append('<h2>开始开发</h2>');
        $(_begin).removeClass(begin).addClass(current_btn);
      }
    };

    // 各种按钮事件
    $('#un_state1').click(function () {
      $.post('isoManageAction!addISOToISODeveloping.action?rnd=' + Math.random(), {
        'isoName': 'PRODUCT9000质量认证'
      }, function () {
        show();
      });
    });

    $('#un_state2').click(function () {
      $.post('isoManageAction!addISOToISODeveloping.action?rnd=' + Math.random(), {
        'isoName': 'PRODUCT1400质量认证'
      }, function () {
        show();
      });
    });

    $('.img_s1').dblclick(function () {
      $.post('isoManageAction!updateISODevelopedStatusToZero.action?rnd=' + Math.random(), {
        'isoName': 'PRODUCT9000质量认证'
      }, function () {
        show();
      });
    });

    $('.img_s2 ').dblclick(function () {
      $.post('isoManageAction!updateISODevelopedStatusToZero.action?rnd=' + Math.random(), {
        'isoName': 'PRODUCT1400质量认证'
      }, function () {
        show();
      });
    });

    // 提交后台数据
    $('.img_m1').dblclick(function () {
      $('.img_m1').remove();
      $(createImgS1).clone(true).appendTo('.small_div1');

      $.post('isoManageAction!updateISODevelopedStatusToOne.action?rnd=' + Math.random(), {
        'isoName': 'PRODUCT9000质量认证'
      }, function () {
        show();
      });
    });

    // 提交后台数据——暂停维护
    $('.img_m2 ').dblclick(function () {
      $('.img_m2').remove();
      $(createImgS2).clone(true).appendTo('.small_div2');

      $.post('isoManageAction!updateISODevelopedStatusToOne.action?rnd=' + Math.random(), {
        'isoName': 'PRODUCT1400质量认证'
      }, function () {
        show();
      });
    });
  }
});

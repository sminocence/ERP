$(function () {
  // 实现窗口始终最大化
  var w = screen.width;
  var h = screen.height;
  var bw = $(document).width();
  var bh = $(document).height();

  window.moveTo(0, 0);
  window.resizeTo(w, h);

  // 设置最小宽度
  function minWidth() {
    var w = $(window).width();
    var h = $(window).height();
    var leftWidth = $('.content_left').width();
    var rightWidth = w - leftWidth;

    $('.header, .body_all').width(w); // 设置页面宽度
    // $('.content_right').width(rightWidth); // 设置主体内容宽度
    // $('#frame_content').width(rightWidth);
  }

  setTimeout(function () {
    minWidth();
  }, 25);

  // 使 iframe 的高度自适应
  function reinitIframe() {
    var iframe = document.getElementById('frame_content');
    var lHeight = $('.content_left').height();
    var rHeight = iframe.contentWindow.document.documentElement.scrollHeight;
    var height = Math.min(lHeight, rHeight);

    $(iframe).height(height);
  }

  $('.tab_td3 img').hover(function () {
    $(this).siblings().slideToggle('slow');
  });

  $('.content_left_dl a').on('click', function () {
    var currentIframeUrl = $(this).attr('href');
    $('#refresh').attr('href', currentIframeUrl);

    // 刷新当前的现金数目
    $.get('forward!yearAndPeriod.action?rnd=' + Math.random(), function (data) {
      var sum = 0;
      for (var i = 0; i < data.userId.length; i++) {
        sum = sum + data.userId.charCodeAt(i);
      }
      var j = sum % 7 + 1;
      var groupName = data.groupName.substr(0, 5) + '...';

      $('#userName').text(data.username);
      $('#currentTime').text(data.year + ' year , ' + data.period + ' phase');
      $('.tab_td3 img').attr('src', '../../images/pic_meb' + j + '.jpg');
      $('.profile p').eq(0).children().html(groupName);
      $('.profile p').eq(1).children().html(data.money);
      $('.profile p').eq(2).children().html(data.tax);
      $('.profile p').eq(3).children().html(data.numberOfFactories);
    }, 'json');
  });

  // 每次 iframe 加载新页面重新设置遮罩层宽高
  $('.btn-frame').on('click', function () {
    reinitIframe();

    setTimeout(function () {
      bw = $(document).width();
      bh = $(document).height();

      $('.fullbg').css({
        height: bh + 'px',
        width: bw + 'px',
        display: 'none'
      });
    }, 500);
  });

  // 实现最小宽度
  $(window).resize(function () {
    minWidth();

    // 对遮罩层宽高设置及显示
    $('.fullbg').css({
      height: bh + 'px',
      width: bw + 'px',
      display: 'none'
    });
  });

  $('.content_left_dl').height(h - 50);

  var left = parseInt($('.header').width() - $('.footerSpan').width()) / 2 - 179;
  $('.footerSpan').css('margin-left', left + 'px');
});

// 对左边菜单栏进行设置
$(function () {
  // header 对刷新及修改信息按钮进行点击设置
  // $('.tab_td1,.tab_td2').mouseover(function () {
  //   $(this).css('background', '#395988');
  // }).mouseout(function () {
  //   $(this).css('background', '#12385F');
  // });

  // 当鼠标移至菜单栏时都变成手形
  // $('.content_left dd,.content_left dt').hover(function () {
  //   $(this).css('cursor', 'pointer');
  // });

  // 对第一个选项进行设值
  $('.content_left dt:first').addClass('dl_first').find('div').css('display', 'none');

  var leftDl = $('.content_left dt:not(:last)');
  var leftDlAll = $('.content_left dt');

  // 切换选项卡时取消右下角弹框
  $('.content_left').click(function () {
    $('#popupBox').hide();
  });


  // 对其余一级菜单的点击进行设置
  leftDlAll.click(function () {
    $('.content_left div').css({'display': 'block', 'background': '#355A86'});
    // 对图标点亮进行设置
    $(this).find('div').css('display', 'none');
  });

  // 当鼠标移到一级菜单时背景加深，移除后恢复
  leftDl.hover(function () {
    if (!$(this).hasClass('dl_first') && !$(this).hasClass('dl_change')) {
      $(this).addClass('dl_change_2');
      $(this).find('div').css('background', '#20466D');
    }
  }, function () {
    if (!$(this).hasClass('dl_first') && !$(this).hasClass('dl_change')) {
      $(this).removeClass('dl_change_2');
      $(this).find('div').css('background', '#355A86');
    }
  });

  // 点击一级菜单
  leftDl.click(function () {
    // 点击其它项目，原来展开的列表收起
    $('.content_left').find('.dl_change').siblings('dd').slideUp(300);
    // 去除第一个的点击效果
    $('.content_left dt:first').removeClass('dl_first');
    // 控制别的dt的背景恢复原样，不可以放在下面
    $('.content_left').find('dt').removeClass('dl_change');

    // 变换背景图片同时去除鼠标移上去时的效果
    $(this).addClass('dl_change').removeClass('dl_change_2');

    // 对二级菜单的可见性进行设置
    var dds = $(this).siblings('dd');
    if (dds.is(':visible')) {
      dds.slideUp(300);
    } else {
      dds.slideDown(300);
    }
  });

  // 对二级菜单的鼠标移入移出进行设置
  $('dd').hover(function () {
    $(this).addClass('dd_bgcolor');
  }, function () {
    $(this).removeClass('dd_bgcolor');
  });
  // 当点击二级菜单时背景发生改变
  $('dd').click(function () {
    $('.content_left dl dd').removeClass('dd_bgcolor_2');
    $(this).addClass('dd_bgcolor_2');
  });

  // “结束经营”菜单
  var last = $('#exitLast');

  last.hover(function () {
    $(this).addClass('dl_last');
    $(this).find('div').css('background', '#732030');
  }, function () {
    $(this).removeClass('dl_last');
    $(this).find('div').css('background', '#355A86');
  });

  // 对遮罩层宽高设置及显示
  var bw = $(document).width();
  var bh = $(document).height();

  $('.fullbg').css({
    height: bh + 'px',
    width: bw + 'px',
    display: 'none'
  });

  // 结束经营的操作
  last.click(function () {
    leftDl.removeClass('dl_change');

    $('.content_left dt:first').removeClass('dl_first');

    // 对弹出遮罩层及对话框进行设置
    $(window).scrollTop(0);
    $('body').css('overflow', 'hidden');

    // 固定弹窗
    popup($('.dialog'));
    $('.fullbg,.dialog').show();
    $('.dialog').css('border', '1px solid #E32D3C');
    $('.center_title').css('background', '#E32D3C');
    $('.center_title').empty();
    $('.close input').css('background', '#F4606C');

    var html = [
      '<p class="common popupFont font_color">',
      'Is end of the operation?</p>',
      '<p class="enter_p2 common">',
      '<input type="button" value="confirm" id="exitAll" class="sureBtn common_1 exitBgcolor common_border common_color" /></p>'
    ].join('');
    $('.myDiv').empty().append(html);

    // 确认结束经营后跳转至登录界面
    $('#exitAll').on('click', function () {
      $.get('gameGroupMemberAction!exitGame.action?rnd=' + Math.random(), function (status) {
        if (status === '1') {
          window.location.href = '../../indexeg.html';
        } else {
          alert('Please be patient and all players finish advertising...');
          window.location.reload();
        }
      });
    });
  });

  // 点击弹窗右上角的退出
  $('.close').click(function () {
    $('.fullbg,.dialog').hide();
    $('body').css('overflow', 'scroll');
  });
});

// 主页面固定弹出窗函数
function popup(popupName) {
  _windowWidth = $(window.parent).width(); // 获取当前窗口宽度
  _windowHeight = $(window.parent).height(); // 获取当前窗口高度
  _popupHeight = popupName.height(); // 获取弹出层高度
  _popupWeight = popupName.width(); // 获取弹出层宽度

  if (_popupHeight > 450) {
    myDiv.css('overflow-y', 'scroll');
  }

  if (_popupWeight > 800) {
    myDiv.css('overflow-x', 'scroll');
  }

  _posiTop = (_windowHeight - _popupHeight) / 2;
  _posiLeft = (_windowWidth - _popupWeight) / 2;
  popupName.css({'left': _posiLeft + 'px', 'top': _posiTop + 'px'});
}

/**
 * 加载界面右上角个人和小组信息
 */
$(function () {
  $.get('forward!yearAndPeriod.action?rnd=' + Math.random(), function (data) {
    var sum = 0;
    for (var i = 0; i < data.userId.length; i++) {
      sum = sum + data.userId.charCodeAt(i);
    }
    var j = sum % 7 + 1;
    var groupName = data.groupName.substr(0, 5) + '...';

    $('#userName').text(data.username);
    $('#currentTime').text('No.' + data.year + 'year，No.' + data.period + 'phase');
    $('.tab_td3 img').attr('src', '../../images/pic_meb' + j + '.jpg');
    $('.profile p').eq(0).children().html(groupName);
    $('.profile p').eq(1).children().html(data.money);
    $('.profile p').eq(2).children().html(data.tax);
    $('.profile p').eq(3).children().html(data.numberOfFactories);
  }, 'json');
});

// 注销登录
function logout() {
  if (confirm('Do you want to cancel your account?')) {
    $.get('loginAction!signout.action', function (res) {
      var resp = JSON.parse(res);
      if (!resp.status) {
        alert(resp.message);
        location.assign('../../');
      }
    });
  }
}

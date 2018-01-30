$(function () {
  function minWidth() {
    var widnowWidth = $(window).width();
    // var h = $(window).height();
    if (widnowWidth < 1200) {
      widnowWidth = 1200;
    }
    $('.main,.header,body').width(widnowWidth);
  }

  minWidth();

  // 实现窗口始终最大化
  var w = screen.width;
  var h = screen.height;
  window.moveTo(0, 0);
  window.resizeTo(w, h);
  $('.main').css('width', w);
  // var x = $('.main').width();
  $('body').css('width', w);

  // 对after_register页面选项进行设置
  $('#left_ull li:eq(0)').addClass('first_li');
  $('#left_ull li:gt(0)').addClass('lli');

  // 点击选项卡背景变化
  $('#left_ull li').click(function () {
    $(this).removeClass('lli').addClass('first_li').siblings().removeClass('first_li').addClass('lli');
  });

  // 实现最小宽度
  $(window).resize(function () {
    minWidth();
  });
});

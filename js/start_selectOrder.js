$(function () {
  load('advertisementAction!getAdByMarket.action?rnd=' + Math.random(), null, adsCallBack);

	// 投放广告页面所有操作
  adsPage();

  // 点击进入第二步步骤
  $('#btn2').on('click', function () {
    var i = 1;

    changeMenu(i);

    loadPage('start_deliver_ads_affirm.html');
  });
});

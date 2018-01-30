$(function ($) {
	// 这个方法用来启动该页面的ReverseAjax功能
  dwr.engine.setActiveReverseAjax(true);

	// 设置在页面关闭时，通知服务端销毁会话
  dwr.engine.setNotifyServerOnPageUnload(true);

	// 不弹窗
  dwr.engine.setErrorHandler(function () {});

  load('chooseOrderAction!chooseOrderList.action?rnd=' + Math.random(), null, orderCallBack);

	// 隐藏聊天室
  hideChartRoom();

	// 选择订单页面所有操作
  orderSelect();
  orderPage();
});

function changeOrder() {
  load('chooseOrderAction!chooseOrderList.action?rnd=' + Math.random(), null, orderCallBack);
}


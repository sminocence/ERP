$(function($) {
	loginService.showMenuList();
	$.get("registerInfoAction!getRegister.action?rnd="+Math.random(),function(list){
		var data = jQuery.parseJSON(list);
		$('#name').html(data.user.name+" 用户");
		DWREngine.setMethod(DWREngine.ScriptTag);
		//这个方法用来启动该页面的ReverseAjax功能  
		dwr.engine.setActiveReverseAjax(true);
		//设置在页面关闭时，通知服务端销毁会话  
		dwr.engine.setNotifyServerOnPageUnload(true);
	});
});

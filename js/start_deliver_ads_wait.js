$(function(){
	load("advertisementAction!allUserAdvertisementStatus.action?rnd="+Math.random(),null,waitCallBack);
});

function personChange(){
	load("advertisementAction!allUserAdvertisementStatus.action?rnd="+Math.random(),null,waitCallBack);
}

//主要是通知所有人跳转到选单页面的,
function forwardToChooseOrder(){
	//这里要跳转到
	loadPage("start_choseOrder.html");
}
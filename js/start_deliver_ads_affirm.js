$(function(){
	load("advertisementAction!getAlreadAd.action?rnd="+Math.random(),null,adsAffirmCallBack);
	
	//点击返回第一步步骤
	$(".affirm_btn1").click(function(){
		changeMenu(1);
		loadPage("start_selectOrder.html");
	});
	
	//点击进入第三步步骤
	$(".affirm_btn2").click(function(){
		var ok=confirm("是否提交广告费，确认后将不能修改");
		if(ok){
		    i=2;
		    $.get("advertisementAction!finishAdvertisement.action?rnd="+Math.random(),function(data){
		    	if(data==1){
		    		alert("你投放的钱太多了同学!你投少点吧!");
		    	}else if(data==2){
		    		changeMenu(i);
		    		loadPage("start_deliver_ads_wait.html");
		    	}else if(data==3){
		    		alert("已经投放成功了.应该不是在这个页面.");
		    	}
		    },"json");
		}
		else{ return false; }
	});
});
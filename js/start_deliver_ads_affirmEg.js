

$(function(){
	load("advertisementAction!getAlreadAd.action?rnd="+Math.random(),null,adsAffirmCallBack);
	
	//点击返回第一步步骤
	$(".affirm_btn1").click(function(){
		changeMenu(1);
		loadPage("start_selectOrderEg.html");
	});
	
	//点击进入第三步步骤
	$(".affirm_btn2").click(function(){
		var ok=confirm("Whether to submit advertising costs, confirmed that can not be modified");
		if(ok){
		    i=2;
		    $.get("advertisementAction!finishAdvertisement.action?rnd="+Math.random(),function(data){
		    	if(data==1){
		    		alert("You put too much money on the students!!");
		    	}else if(data==2){
		    		changeMenu(i);
		    		loadPage("start_deliver_ads_waitEg.html");
		    	}else if(data==3){
		    		alert("Has been successful. Should not be on this page.");
		    	}
		    },"json");
		}
		else{ return false; }
	});


});
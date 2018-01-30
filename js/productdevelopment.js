$(document).ready(function(){
 //创建新的产品
/* $("#hidden_P").hide();*/  //新的产品
 var newDiv=$("#hidden_P").clone(true).removeAttr("id");
 $("#hidden_P").remove();
 
 //创建研发中的产品
 /*$("#hidden_Ping").hide();*/
 var createDiv=$("#hidden_Ping").clone(true).removeAttr("id");
 $("#hidden_Ping").remove();
 
function show(){
 //初始展现
 $.getJSON("productInventoryAction!showAllDevelopProduct.action?rnd="+Math.random(),function(data){
     showP(data);
   });   
}

show();
     function showP(data){
	    $(".market-bar").remove();
		$('.img_f1,.img_f2,.img_f3,.img_f4').css('display','block');
		$('.img_s1,.img_s2,.img_s3,.img_s4').css('display','none');
	 	$.each( data.undevelopProducts, function(i){
		//创建外面的框  	 
		$(newDiv).clone(true).appendTo('.undevelop_p');
		 //P1
		if(data.undevelopProducts[i].productName=="P1")
		{
		  $(".img_P").removeClass().addClass('img_p1');
		  $('.P').removeClass().addClass('market-bar P1');
		  $("<img src='../../images/P1.png' />").appendTo('.img_p1');
		  $("#un_state").removeAttr("id","un_state2 un_state3 un_state4").attr("id","un_state1");
		  $(".P1").find("h2").eq(0).text(data.undevelopProducts[i].productName);
		  $(".P1").find("h2").eq(1).text(data.undevelopProducts[i].researchPeriod);
		  $(".P1").find("h2").eq(2).text(data.undevelopProducts[i].researchCost); 
		  
		}
		 //P2
		if(data.undevelopProducts[i].productName=="P2")
		{
		  $(".img_P").removeClass().addClass('img_p2');
		  $('.P').removeClass().addClass('market-bar P2');
		  $("<img src='../../images/P2.png' />").appendTo('.img_p2');
		  $("#un_state").removeAttr("id","un_state1 un_state3 un_state4").attr("id","un_state2");
		  $(".P2").find("h2").eq(0).text(data.undevelopProducts[i].productName);
		  $(".P2").find("h2").eq(1).text(data.undevelopProducts[i].researchPeriod);
		  $(".P2").find("h2").eq(2).text(data.undevelopProducts[i].researchCost);
		
		}
		 //P3
		if(data.undevelopProducts[i].productName=="P3")
		{
		  $(".img_P").removeClass().addClass('img_p3');
		  $('.P').removeClass().addClass('market-bar P3');
		  $("<img src='../../images/P3.png' />").appendTo('.img_p3');
		  $("#un_state").removeAttr("id","un_state1 un_state2 un_state4").attr("id","un_state3");
		  $(".P3").find("h2").eq(0).text(data.undevelopProducts[i].productName);
		  $(".P3").find("h2").eq(1).text(data.undevelopProducts[i].researchPeriod);
		  $(".P3").find("h2").eq(2).text(data.undevelopProducts[i].researchCost);
		  
		}
		 //P4
		if(data.undevelopProducts[i].productName=="P4")
		{
		  $(".img_P").removeClass().addClass('img_p4');
		  $('.P').removeClass().addClass('market-bar P4');
		  $("<img src='../../images/P4.png' />").appendTo('.img_p4'); 
		  $("#un_state").removeAttr("id","un_state1 un_state2 un_state3").attr("id","un_state4");
		  $(".P4").find("h2").eq(0).text(data.undevelopProducts[i].productName);
		  $(".P4").find("h2").eq(1).text(data.undevelopProducts[i].researchPeriod);
		  $(".P4").find("h2").eq(2).text(data.undevelopProducts[i].researchCost);  
		}
		
//未研发的产品undevelopProducts结束
	  });



//研发中的产品developingProducts开始	 
 $.each( data.developingProducts, function(i){
	  $(createDiv).clone(true).appendTo('.develop_P');
   //P1 
   if(data.developingProducts[i].productName=="P1"){
	    //设置class
	    $(".img_Ping").removeClass().addClass('img_ping1');
		$("<img src='../../images/P1.png' />").appendTo('.img_ping1');
	    $('.Ping').removeClass().addClass('market-bar develop_P1 ');
		$("#state").removeAttr("id","state2 state3 state4").attr("id","state1");//控制按钮切换
		$("#state1").removeClass().addClass("state current_btn1");//控制按钮切换
		$("#current").removeAttr("id","current2 current3 current4").attr("id","current1");//控制按钮切换
		$("#current1").removeClass().addClass("current1");//控制按钮切换
		//传值
	    $(".develop_P1").find("h2").eq(0).text(data.developingProducts[i].productName);
		$(".develop_P1").find("h2").eq(1).text(data.developingProducts[i].researchPeriod);
		$(".develop_P1").find("h2").eq(2).text(data.developingProducts[i].researchCost);
		$(".develop_P1").find("h2").eq(3).text(data.developingProducts[i].finishedPeriod);
		$(".develop_P1").find("h2").eq(4).text(data.developingProducts[i].beginTime);
		if(data.developingProducts[i].status=='1')
		{
		$(".develop_P1").find("h2").eq(5).text("正在研发");
		$(".develop_P1").find("h2").eq(6).text("暂停研发");
		}
	   else if(data.developingProducts[i].status=='0')
		{
		$(".develop_P1").find("h2").eq(5).text("暂停研发");
		$(".develop_P1").find("h2").eq(6).text("开始研发");  
		}
		
		
		$("#state1").click(function(){
			//按钮切换
			//按钮切换
		if(data.developingProducts[i].status=='1'){
		change1("#state1",".current_btn1","#current1",".begin1","current_btn1","begin1");
		}
		else if(data.developingProducts[i].status=='0'){
		change0("#state1",".current_btn1","#current1",".begin1","current_btn1","begin1");
		}
			
			//传回前台数据
			  $.post("productInventoryAction!modifySearchStarus.action?rnd="+Math.random(),//url
			{
			 "productName" : "P1"
			},
			function(){
			  //alert("数据传回成功！");
			  show();
			});
			});

	  }
	   //P2
	    if(data.developingProducts[i].productName=="P2"){
		//设置class
	    $(".img_Ping").removeClass().addClass('img_ping2');
		$("<img src='../../images/P2.png' />").appendTo('.img_ping2');
	    $('.Ping').removeClass().addClass('market-bar develop_P2 ');
		$("#state").removeAttr("id","state1 state3 state4").attr("id","state2");//控制按钮切换
		$("#state2").removeClass().addClass("state current_btn2");//控制按钮切换
		$("#current").removeAttr("id","current1 current3 current4").attr("id","current2");//控制按钮切换
		$("#current2").removeClass().addClass("current2");//控制按钮切换
		//传值
	    $(".develop_P2").find("h2").eq(0).text(data.developingProducts[i].productName);
		$(".develop_P2").find("h2").eq(1).text(data.developingProducts[i].researchPeriod);
		$(".develop_P2").find("h2").eq(2).text(data.developingProducts[i].researchCost);
		$(".develop_P2").find("h2").eq(3).text(data.developingProducts[i].finishedPeriod);
		$(".develop_P2").find("h2").eq(4).text(data.developingProducts[i].beginTime);
		if(data.developingProducts[i].status=='1')
		{
		$(".develop_P2").find("h2").eq(5).text("正在研发");
		$(".develop_P2").find("h2").eq(6).text("暂停研发");	
		}
	   else if(data.developingProducts[i].status=='0')
		{
		$(".develop_P2").find("h2").eq(5).text("暂停研发");
		$(".develop_P2").find("h2").eq(6).text("开始研发");  
		}
		
		
		$("#state2").click(function(){
			//控制按钮切换
		  if(data.developingProducts[i].status=='1'){
		 change1("#state2",".current_btn2","#current2",".begin2","current_btn2","begin2");
		  }
		  if(data.developingProducts[i].status=='0'){
		 change0("#state2",".current_btn2","#current2",".begin2","current_btn2","begin2");
		  }
		  	//传回前台数据
			  $.post("productInventoryAction!modifySearchStarus.action?rnd="+Math.random(),//url
			{
			 "productName" : "P2"
			},
			function(){
			  //alert("数据传回成功！");
			  show();
			 });
			});
	  }
	  
	  //P3 
	  if(data.developingProducts[i].productName=="P3"){
		//设置class
	    $(".img_Ping").removeClass().addClass('img_ping3');
		$("<img src='../../images/P3.png' />").appendTo('.img_ping3');
	    $('.Ping').removeClass().addClass('market-bar develop_P3');
		$("#state").removeAttr("id","state1 state2 state4").attr("id","state3");
		$("#state3").removeClass().addClass("state current_btn3");//控制按钮切换
		$("#current").removeAttr("id","current1 current2 current4").attr("id","current3");//控制按钮切换
		$("#current3").removeClass().addClass("current3");//控制按钮切换
		//传值
												    $(".develop_P3").find("h2").eq(0).text(data.developingProducts[i].productName);
		$(".develop_P3").find("h2").eq(1).text(data.developingProducts[i].researchPeriod);
		$(".develop_P3").find("h2").eq(2).text(data.developingProducts[i].researchCost);
		$(".develop_P3").find("h2").eq(3).text(data.developingProducts[i].finishedPeriod);
		$(".develop_P3").find("h2").eq(4).text(data.developingProducts[i].beginTime);
		if(data.developingProducts[i].status=='1')
		{
		$(".develop_P3").find("h2").eq(5).text("正在研发");
		$(".develop_P3").find("h2").eq(6).text("暂停研发");	
		}
	   else if(data.developingProducts[i].status=='0')
		{
		$(".develop_P3").find("h2").eq(5).text("暂停研发");
		$(".develop_P3").find("h2").eq(6).text("开始研发");  
		}
		
		$("#state3").click(function(){
			//控制按钮切换
		 if(data.developingProducts[i].status=='1'){
		 change1("#state3",".current_btn3","#current3",".begin3","current_btn3","begin3");
		  }
		  if(data.developingProducts[i].status=='0'){
		 change0("#state3",".current_btn3","#current3",".begin3","current_btn3","begin3");
		  }
		  	//传回前台数据
			  $.post("productInventoryAction!modifySearchStarus.action?rnd="+Math.random(),//url
			{
			"productName" : "P3"
			},
			function(){
			  //alert("数据传回成功！");
			  show();
			});
			});
	  }

  //P4
   if(data.developingProducts[i].productName=="P4"){
	    //设置class
	    $(".img_Ping").removeClass().addClass('img_ping4');
		$("<img src='../../images/P4.png' />").appendTo('.img_ping4');
	    $('.Ping').removeClass().addClass('market-bar develop_P4');
		$("#state").removeAttr("id","state1 state2 state3").attr("id","state4");
		$("#state4").removeClass().addClass("state current_btn4");//控制按钮切换
		$("#current").removeAttr("id","current1 current2 current3").attr("id","current4");//控制按钮切换
		$("#current4").removeClass().addClass("current4");//控制按钮切换
		//传值
	    $(".develop_P4").find("h2").eq(0).text(data.developingProducts[i].productName);
		$(".develop_P4").find("h2").eq(1).text(data.developingProducts[i].researchPeriod);
		$(".develop_P4").find("h2").eq(2).text(data.developingProducts[i].researchCost);
		$(".develop_P4").find("h2").eq(3).text(data.developingProducts[i].finishedPeriod);
		$(".develop_P4").find("h2").eq(4).text(data.developingProducts[i].beginTime);
		if(data.developingProducts[i].status=='1')
		{
		$(".develop_P4").find("h2").eq(5).text("正在研发");
		$(".develop_P4").find("h2").eq(6).text("暂停研发");	
		}
	   else if(data.developingProducts[i].status=='0')
		{
		$(".develop_P4").find("h2").eq(5).text("暂停研发");
		$(".develop_P4").find("h2").eq(6).text("开始研发");  
		}
		$("#state4").click(function(){
			//控制按钮切换
		 if(data.developingProducts[i].status=='1'){
		 change1("#state4",".current_btn4","#current4",".begin4","current_btn4","begin4");
		  }
		  if(data.developingProducts[i].status=='0'){
		 change0("#state4",".current_btn4","#current4",".begin4","current_btn4","begin4");
		  }
		  	//传回前台数据
			  $.post("productInventoryAction!modifySearchStarus.action?rnd="+Math.random(),//url
			{
			 "productName" : "P4"
			},
			function(){
			  //alert("数据传回成功！");
			  show();
			});
			});
	  }
	
 //研发中的产品developingProducts结束			
	 });
		
		
 //研发完成的产品开始
	$.each( data.developedProducts, function(i){
		 //P1
		if(data.developedProducts[i].productName=="P1"){
			$('.img_f1').css('display','none');
			$('.img_s1').css('display','block');
			
			
	  }
		  
		  //P2
		if(data.developedProducts[i].productName=="P2"){
			$('.img_f2').css('display','none');
			$('.img_s2').css('display','block');
			
		  }
		  
		  //P3
		if(data.developedProducts[i].productName=="P3"){
			$('.img_f3').css('display','none');
			$('.img_s3').css('display','block');
			
		  }
		  
		  //P4
		if(data.developedProducts[i].productName=="P4"){
			$('.img_f4').css('display','none');
			$('.img_s4').css('display','block');
			
		  }
		 //研发完成的产品结束
		});	 
		
		
	//控制变色	 
	var oState=$(".state");
    for(var i=0;i<oState.length;i++){
	oState[i].onmouseover=function(){
		this.style.background="#d1ba74";
	};
	oState[i].onmouseout=function(){
		this.style.background="#dbdad6";
	};
	//控制变色结束
   }


//控制按钮1切换开始
	var change1=function(_id,_current_btn,_current,_begin,current_btn,begin){
	  if($(_id).hasClass(current_btn))//暂停研发
	  { 
		 $(_current).empty().append("<h2>暂停研发</h2>");
		 $(_current_btn).empty().append("<h2>开始研发</h2>");
		 $(_id).removeClass(current_btn).addClass(begin);
	  }
	  else if($(_id).hasClass(begin))//继续研发  
	  {
		 $(_current).empty().append("<h2>正在研发</h2>");
		 $(_begin).empty().append("<h2>暂停研发</h2>");
		 $(_begin).removeClass(begin).addClass(current_btn);
	  }
		  
	 //控制按1钮切换结束
	 }
	 
	//控制按钮0切换开始
	var change0=function(_id,_current_btn,_current,_begin,current_btn,begin){
		  if($(_id).hasClass(current_btn))//暂停研发
		  { 
			 $(_current).empty().append("<h2>正在研发</h2>");
			 $(_current_btn).empty().append("<h2>暂停研发</h2>");
			 $(_id).removeClass(current_btn).addClass(begin);
		  }
		  else if($(_id).hasClass(begin))//继续研发  
		  {
			 $(_current).empty().append("<h2>暂停研发</h2>");
			 $(_begin).empty().append("<h2>开始研发</h2>");
			 $(_begin).removeClass(begin).addClass(current_btn);
		  }
	 //控制按钮0切换结束
	  } 
	  
  $("#un_state1").click(function(){
   //传值到后台
   $.post("productInventoryAction!startSearch.action?rnd="+Math.random(),//url
    {
	 "productName" : "P1"
	},
	  function(){
	  $.getJSON("Product_Development_json.json",function(data){
      showP(data);
      }); 
	});
	//去掉P1
	$(".P1").remove();  
  });
  

   $("#un_state2").click(function(){
   //传值到后台
   $.post("productInventoryAction!startSearch.action?rnd="+Math.random(),//url
	{
	 "productName" : "P2"
	},
	  function(){
	   show();
	});
	//去掉P2
	$(".P2").remove();    
  }); 
  
   $("#un_state3").click(function(){
	
   //传值到后台
   $.post("productInventoryAction!startSearch.action?rnd="+Math.random(),//url
	{
	 "productName" : "P3"
	},
	  function(){
	   show();
	});
	 //去掉P3
	$(".P3").remove();   
  }); 
  
  $("#un_state4").click(function(){
   //传值到后台
   $.post("productInventoryAction!startSearch.action?rnd="+Math.random(),//url
	{
	"productName" : "P4"
	},
	  function(){
	  show();
	});
	  //去掉P4
	$(".P4").remove();  
  });    
		       
//showP结束	 
 }
 
});



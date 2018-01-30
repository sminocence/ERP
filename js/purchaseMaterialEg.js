// JavaScript Document
//购买材料对应JS
$(function(){
	//加载数据
	$.post("materialOrderAction!findMaterialBasicAndInventory.action",{},function(data){
		var houseInfor = $(".detail");//对应于不同仓库信息
		var material = data.materialbaisc;
		var materialInventory = data.materialInventory;
		var mNumber = materialInventory.mNumber;
		$(materialInventory).each(function(i,items){
			var materialName = items.materialName;
			var x = materialName.charAt(1);
			houseInfor.eq(x-1).find("span").eq(0).text(items.mNumber);
			});
		$(material).each(function(i,items){
		  var houseSpan = houseInfor.eq(i).find("span");
			  houseSpan.eq(1).text(items.price);
			  houseSpan.eq(2).text(items.delayTime);
			
			});
		},"json");//post数据加载结束
	$(".main-content form input[type='button']").on("click",function(){
		var ok = confirm("Would you like to order this material??\n Warm prompt: once the order is generated, it is not allowed to be revoked.");
		if (ok) {
		  var index=$("input[type='button']").index(this);
		  addMaterial($(this),index);
		  $(".content").find(":text").val("");
          //var x=/^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/;
		}else{
			return;
		}
	});//'click事件结束'
	$(".mt").hover(function(){
		$(this).css("background","#D1BA74").animate({"fontSize":"15px"},50);
		},function(){
		$(this).css("background","#355A86").animate({"fontSize":"14px"},50);	
		});
	//点击按钮后向后台提交数据
      function addMaterial(_this,index){
		  var thisParent = _this.parent();
		  var mNumber = thisParent.find(":text:eq(0)").val();
		  var x=/^[1-9]\d*$/;
		  var y = x.test(mNumber);
		 if(!y)
		 {
			 alert("Please enter a positive integer!");}
		 else
		 {
		  var wareHouseName = thisParent.find("select option:selected").val();
		  var materialName = thisParent.find(":text:eq(0)").attr('name');
		  $.post("materialOrderAction!addMaterial.action",
		    {
			   "materialName":materialName,
			   "materialNumber":mNumber,
			   "wareHouseName":wareHouseName
			 },function(data){
				var status = data.statusCode;
				var message= data.errorMessage;
				$.getScript("../../js/purchaseDialogEg.js",function()
				{
				    
					 if(status==1)
					{
					  bottomPopup(message,1,1);}
					else if(status==0)
					{
					   bottomPopup(message,0,1);}
					else {
					   bottomPopup(message,2,1);}
				 });//对应于getScript结束
			   },"json");//post结束
		 }//对应于else结束
	}//对应于函数结束	
	
});
//是写计算税金
$(function(){
	$.get("",{},function(data){
		$(".pay").text(data.taxPay);
		});
	
	});




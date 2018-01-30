$(document).ready(function(){
 $.getJSON("productInventoryAction!showProductBasic.action?rnd="+Math.random(),function(data){
	 
	 //遍历原料库存	
 	 $.each(data.materialInventory,function(i){
		 //P1
		  if(data.materialInventory[i].materialName=="R1"){
			  $(".R1").text(data.materialInventory[i].mNumber);
			  
		 } 
		 
		 //P1
		  if(data.materialInventory[i].materialName=="R2"){
			  $(".R2").text(data.materialInventory[i].mNumber);
			  
		 } 
		 
		 //P1
		  if(data.materialInventory[i].materialName=="R3"){
			  $(".R3").text(data.materialInventory[i].mNumber);
		
		 } 
		 
		 //P1
		  if(data.materialInventory[i].materialName=="R4"){
			  $(".R4").text(data.materialInventory[i].mNumber);
			  
		 } 
		
	  });
	  
	  
	 //遍历产品构成开始
	$.each(data.productDetailBasic,function(i){
	//P1	
	//P1&&R1	
  if(data.productDetailBasic[i].productName=="P1"&&data.productDetailBasic[i].materialName=="R1"){
		$(".P1").find("span").eq(0).text(data.productDetailBasic[i].mNumber);	  
	  }
	 //P1&&R2
  if(data.productDetailBasic[i].productName=="P1"&&data.productDetailBasic[i].materialName=="R2"){
		$(".P1").find("span").eq(1).text(data.productDetailBasic[i].mNumber);	  
	  }
	  //P1&&R3
  if(data.productDetailBasic[i].productName=="P1"&&data.productDetailBasic[i].materialName=="R3"){
		$(".P1").find("span").eq(2).text(data.productDetailBasic[i].mNumber);	  
	  }
	  //P1&&P4
  if(data.productDetailBasic[i].productName=="P1"&&data.productDetailBasic[i].materialName=="R4"){
		$(".P1").find("span").eq(3).text(data.productDetailBasic[i].mNumber);	  
	  }  
	  
	  //P2	
	//P2&&R1	
  if(data.productDetailBasic[i].productName=="P2"&&data.productDetailBasic[i].materialName=="R1"){
		$(".P2").find("span").eq(0).text(data.productDetailBasic[i].mNumber);	  
	  }
	 //P2&&R2
  if(data.productDetailBasic[i].productName=="P2"&&data.productDetailBasic[i].materialName=="R2"){
		$(".P2").find("span").eq(1).text(data.productDetailBasic[i].mNumber);	  
	  }
	  //P2&&R3
  if(data.productDetailBasic[i].productName=="P2"&&data.productDetailBasic[i].materialName=="R3"){
		$(".P2").find("span").eq(2).text(data.productDetailBasic[i].mNumber);	  
	  }
	  //P2&&P4
  if(data.productDetailBasic[i].productName=="P2"&&data.productDetailBasic[i].materialName=="R4"){
		$(".P2").find("span").eq(3).text(data.productDetailBasic[i].mNumber);	  
	  }  
	
	//P3	
	//P3&&R1	
  if(data.productDetailBasic[i].productName=="P3"&&data.productDetailBasic[i].materialName=="R1"){
		$(".P3").find("span").eq(0).text(data.productDetailBasic[i].mNumber);	  
	  }
	 //P3&&R2
  if(data.productDetailBasic[i].productName=="P3"&&data.productDetailBasic[i].materialName=="R2"){
		$(".P3").find("span").eq(1).text(data.productDetailBasic[i].mNumber);	  
	  }
	  //P3&&R3
  if(data.productDetailBasic[i].productName=="P3"&&data.productDetailBasic[i].materialName=="R3"){
		$(".P3").find("span").eq(2).text(data.productDetailBasic[i].mNumber);	  
	  }
	  //P3&&P4
  if(data.productDetailBasic[i].productName=="P3"&&data.productDetailBasic[i].materialName=="R4"){
		$(".P3").find("span").eq(3).text(data.productDetailBasic[i].mNumber);	  
	  }  
	  
	  //P4	
	//P4&&R1	
  if(data.productDetailBasic[i].productName=="P4"&&data.productDetailBasic[i].materialName=="R1"){
		$(".P4").find("span").eq(0).text(data.productDetailBasic[i].mNumber);	  
	  }
	 //P2&&R2
  if(data.productDetailBasic[i].productName=="P4"&&data.productDetailBasic[i].materialName=="R2"){
		$(".P4").find("span").eq(1).text(data.productDetailBasic[i].mNumber);	  
	  }
	  //P2&&R3
  if(data.productDetailBasic[i].productName=="P4"&&data.productDetailBasic[i].materialName=="R3"){
		$(".P4").find("span").eq(2).text(data.productDetailBasic[i].mNumber);	  
	  }
	  //P2&&P4
  if(data.productDetailBasic[i].productName=="P4"&&data.productDetailBasic[i].materialName=="R4"){
		$(".P4").find("span").eq(3).text(data.productDetailBasic[i].mNumber);	  
	  }  
	
	
  //成本价
  	$(".P1").find("span").eq(5).text(data.P1成本价);
	$(".P2").find("span").eq(5).text(data.P2成本价);
	$(".P3").find("span").eq(5).text(data.P3成本价);
	$(".P4").find("span").eq(5).text(data.P4成本价);
	
	  	     
	//遍历产品构成结束	  
   });

	 
 });
});


// JavaScript Document
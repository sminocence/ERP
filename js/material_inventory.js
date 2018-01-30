$(document).ready(function(){
 $.getJSON("materialInventoryAction!showMaterialInventory.action?rnd="+Math.random(),function(data){
	
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
});
});


// JavaScript Document
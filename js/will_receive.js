$(function(){
    
	$.get("willReceiveAction!findWillReceive.action?rnd="+Math.random(),null,function(data){
	    $(".balance_table tbody td").empty();
		var backUp=$(".balance_table tbody tr").eq(0).clone(true);
		var trLength=$(".balance_table tbody tr").length;

		if(data.willReceiveList.length+3 > trLength){
		    for(var i=0; i<(data.willReceiveList.length-trLength)+5; i++){
			    $(backUp).clone(true).appendTo(".balance_table tbody");
			}
		}
	    $(data.willReceiveList).each(function(index){
		    var tarTr=$("tbody tr").eq(index);
		    $(tarTr).find("td").eq(0).text(data.willReceiveList[index].willReceiveID);
			$(tarTr).find("td").eq(1).text(data.willReceiveList[index].money);
			$(tarTr).find("td").eq(2).text(data.willReceiveList[index].beginTime);
			$(tarTr).find("td").eq(3).text(data.willReceiveList[index].endTime);
			$(tarTr).find("td").eq(4).text(data.willReceiveList[index].willReceiveDescription);
			$(tarTr).find("td").eq(5).append("<a href='javascript:void(0)' class='return'>"+"贴现"+"</a>");
		});
		user=data.userUnique;
	},"json");
	
	$(document).on("click",".return",function(){
		var ok = confirm("是否要贴现?");
		if (ok) {
			var id=$(this).parents("tr").children("td").eq(0).text();  //应收账款编号
		    $.post("willReceiveAction!discount.action?rnd="+Math.random(),{"willReceiveID":id},function(){
		    	location.href="will_receive.html";
			    $(this).parents("tr").remove();
		    });  //传编号
		}else{
			return ;
		}
	});
	
})
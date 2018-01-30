//回调函数
function jsonCallBack(data){
	//先清空
	$(".profit_table tbody td").empty();
	$(data.profitSheetList).each(function(index){
			var cols=data.profitSheetList[index].cols-1;   //列
			var rows=data.profitSheetList[index].rows-1;   //行
			var content=data.profitSheetList[index].allValue;
			$("tr").eq(rows).find("td").eq(cols).text(content);
	});
	
	//先清空，后加载select选择框内容
    $("select[name='start_year']").empty();
    $("select[name='start_period']").empty();
	for(var i=1; i<=data.yearInGame; i++){  //从1记载到yearInGame
        $("select[name='start_year']").append("<option>"+i+"</option>");
    }
    
    for(var j=1; j<=data.periodOfYear; j++){  //从1记载到periodOfYear
        $("select[name='start_period']").append("<option>"+j+"</option>");
    }
    
    $("select[name='start_year'] option").each(function(i){
	    var tar=$("select[name='start_year'] option");
	    if($(tar).eq(i).text()==data.year) {$(tar).eq(i).attr("selected","true");}
	});
	
	$("select[name='start_period'] option").each(function(i){
	    var tar=$("select[name='start_period'] option");
	    if($(tar).eq(i).text()==data.season) {$(tar).eq(i).attr("selected","true");}
	});
}

//加载数据方法
function loading(url,oData,jsonCallBack){
	$.post(url,oData,jsonCallBack,"json");
}


$(function(){
	loading("profitSheetAction!findProfitSheet.action",{"year":1,"season":1},jsonCallBack);
	$(".search_btn").click(function(){
	    var year=$("select[name='start_year'] option:selected").val();
		var season=$("select[name='start_period'] option:selected").val();
	    loading("profitSheetAction!findProfitSheet.action",{"year":year,"season":season},jsonCallBack);
	});
});
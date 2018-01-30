// JavaScript Document
$(function(){
    // Set up the chart1
    var chart1 = new Highcharts.Chart({
			// 表格总属性
	        chart: {
				renderTo: 'container1',
	            type: 'column',
				height: 400,
			    width:500,
				
	        },
			// 版权信息
		    credits: {
               enabled: false
               },
			 // 图例
	 	    legend: {
			  borderWidth: 1,
			  borderColor: '#000',
			  y:15,
			  x:30
			 
			 },
			 // 标题
	        title: {
	            text: '',
				 style:{
                   color:"#000",
                   fontWeight:"bold"
                      }
	        },
			// x轴
	        xAxis: {
	            categories:['1', '2', '3','4','5','6','7','9','10'],
				title:{
					text: 'Period',
					style:{
                 fontWeight:"bold"
				 }
				}
	        },
			// y轴
	        yAxis: {
				// 最小从5开始
				// min: 2.5,
				// max:20,
				// 刻度单位
				// tickInterval: 2.5,
	            title: {
	                text: 'Demand',
					style:{
                  fontWeight:"bold"
				  }
	            },
				
	        },
			// 数据列
	        series: [{
				     name: 'P1',
					data: []
				},
				{   name: 'P2',
					data: []
				},
				{   name: 'P3',
					data: []
				},
				{   name: 'P4',
					data: []
        
	        }]
	    });
		
    // Set up the chart2
    var chart2= new Highcharts.Chart({
			// 表格总属性
	        chart: {
				renderTo: 'container2',
	            type: 'line',
				height: 400,
			    width:500
	        },
			// 版权信息
		    credits: {
               enabled: false
               },
			  // 图例
			  legend: {
			  borderWidth: 1,
			  borderColor: '#000',
			  y:15,
			  x:30
			 
			 },
			 // 标题
	        title: {
	            text: '',
				 style:{
                   color:"#000",
                   fontWeight:"bold"
                      }
	        },
			// x轴
	        xAxis: {
				gridLineWidth :1,// 默认是0，即在图上没有纵轴间隔线
	            categories:['1', '2', '3','4','5','6','7','9','10'],
				title:{
					text: 'Period',
					style:{
                 fontWeight:"bold"
				 }
				}
	        },
			// y轴
	        yAxis: {
				// min: 0.5,//最小从5开始
				// max:20,
				// tickInterval:2.5, //刻度单位
	            title: {
	                text: 'price',
					style:{
                  fontWeight:"bold"
				  }
	            }
				 
	        },
			// 数据点配置
		    plotOptions: {
            series: {
                marker: {
                    // radius: 0
                }
            }
          },
			// 数据列
	        series: [{
				    name: 'P1',
					data: []
				},
				{   name: 'P2',
					data: []
				},
				{   name: 'P3',
					data: []
				},
				{   name: 'P4',
					data: []
        
				}],
	  
    });		
	
		
     // 加载内容
	  function getContent(data){
	  // 为图表1设置值
            chart1.series[0].setData(data.mountMap.P1); 
			chart1.series[1].setData(data.mountMap.P2); 
			chart1.series[2].setData(data.mountMap.P3); 
			chart1.series[3].setData(data.mountMap.P4);
			switch(data.marketName)
			{
				case "本地市场":data.marketName="Local Market";break;
				case "国内市场":data.marketName="Domestic Market";break;
				case "区域市场":data.marketName="Regional Market";break;
				case "国际市场":data.marketName="International Market";break;
				case "亚洲市场":data.marketName="Asia Market";break;
			}
			// 设置最大最小值
			chart1.yAxis[0].setExtremes(data.mountMap.mountMin-1, data.mountMap.mountMax);
			// 动态设置刻度值
			chart1.yAxis[0].tickInterval=(data.mountMap.mountMax-data.mountMap.mountMin)/10;
			chart1.setTitle({

            text:data.marketName+' Demand forecast'
            });
			chart1.yAxis[0].update({
		    tickInterval:chart1.yAxis[0].tickInterval,
			});
	
			 // 为图2表设置值
            chart2.series[0].setData(data.priceMap.P1); 
			chart2.series[1].setData(data.priceMap.P2); 
			chart2.series[2].setData(data.priceMap.P3); 
			chart2.series[3].setData(data.priceMap.P4);
			// 设置最大最小值
			chart2.yAxis[0].setExtremes(data.priceMap.priceMin-1,data.priceMap.priceMax+1);
			// 动态设置刻度值
			chart2.yAxis[0].tickInterval=(data.priceMap.priceMax-data.priceMap.priceMin)/10;
			chart2.setTitle({
            text:data.marketName+'Sales price forecast'
            });
			chart2.yAxis[0].update({
		    tickInterval:chart2.yAxis[0].tickInterval
		  });
	  }
	  
	 // 默认本地市场
	  $.post("predictionAction!findPrediction.action",{"marketName":"本地市场"},function(data) {
		  getContent(data);
       },"json");
	  
	  
	  // 绑定点击事件
	$(document).on("click","input[id='marketSearch']",function(){
	  if($("select").val()=="local"){
		  // 外部加载json
		 $.post("predictionAction!findPrediction.action",{"marketName":"本地市场"},function(data) {
		  getContent(data);
       },"json");
	  }
	  else if($("select").val()=="region"){
		   // 外部加载json
		 $.post("predictionAction!findPrediction.action",{"marketName":"区域市场"},function(data) {
		  getContent(data);
       },"json");
	  }
	  else if($("select").val()=="domestic"){
		    // 外部加载json
		 $.post("predictionAction!findPrediction.action",{"marketName":"国内市场"},function(data) {
		  getContent(data);
       },"json");
	  }
	  else if($("select").val()=="Asia"){
		    // 外部加载json
		 $.post("predictionAction!findPrediction.action",{"marketName":"亚洲市场"},function(data) {
		  getContent(data);
       },"json");
	  }
	  else if($("select").val()=="international"){
		    // 外部加载json
		 $.post("predictionAction!findPrediction.action",{"marketName":"国际市场"},function(data) {
		  getContent(data);
       },"json");
	  }
	 // 绑定事件结束
	});	
	
	
});
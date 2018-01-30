// JavaScript Document
$(document).ready(function(){

//绑定点击事件
    $(document).on("click","input[name='search']",function(){
        if($("select").val()=="all"){
            //外部加载全部json
            $('table tr:gt(0) td').empty();
            $.getJSON("OrdersOfUserAction!findOrdersOfUserByUserUnique.action?rnd="+Math.random(),function(data){
                loadTable(data);
            });


        }
        else if($("select").val()=="Delivery"){
            //外部加载已交货json
            $('table tr:gt(0) td').empty();
            $.getJSON("OrdersOfUserAction!findDeliveredOrdersOfUser.action?rnd="+Math.random(),function(data){
                loadTable(data);
            });


        }
        else if($("select").val()=="noDelivery"){
            //外部加载未交货json
            $('table tr:gt(0) td').empty();
            $.getJSON("OrdersOfUserAction!findNotDeliverOrdersOfUser.action?rnd="+Math.random(),function(data){
                loadTable(data);
            });
        }
    });

    //外部加载全部json
    $.getJSON("OrdersOfUserAction!findOrdersOfUserByUserUnique.action?rnd="+Math.random(),function(data){
        loadTable(data);
    });


    //加载表格开始
    var loadTable=function(data){
        //奇数行变色
        $("tr:odd").css("background","#F4F4F4");
        //table里加入数据
        $(data).each(function(index){
            //判断超出表格行的范围就自动生成tr开始
            if(data.length>$("tr").length-1){
                for(var i=0;i<data.length-$("tr").length+2;i++){
                    var newTr=$("tr").eq(2).clone(true);
                    $(newTr).clone(true).appendTo("table");
                    //奇数行变色
                    $("tr:odd").css("background","#F4F4F4");
                }
                //判断超出表格行的范围就自动生成tr结束
            }
            //加载值
            var oTr=$("table tr").eq(index+1);
            var totalNumber=data[index].price*data[index].pNumber;
            data[index].marketName= transport(data[index].marketName);
            oTr.find("td").eq(0).text(data[index].orderID);
            oTr.find("td").eq(1).text(data[index].marketName);
            oTr.find("td").eq(2).text(data[index].needTime);
            oTr.find("td").eq(3).text(data[index].productName);
            oTr.find("td").eq(4).text(data[index].pNumber);
            oTr.find("td").eq(5).text(data[index].price);
            oTr.find("td").eq(6).text(totalNumber);
            oTr.find("td").eq(7).text(data[index].moneyTime);
            oTr.find("td").eq(8).text(data[index].penalPercent);
            if(data[index].endTime==null){
                oTr.find("td").eq(9).text("Undelivered");
            }
            else if(data[index].endTime!=null)
            {
                oTr.find("td").eq(9).text("Delivered");
            }

            //each结束
        });
        //加载表格结束
    }
    function transport(data){
        switch(data)
        {
            case "本地市场":data="Local Market";break;
            case "国内市场":data="Domestic Market";break;
            case "区域市场":data="Regional Market";break;
            case "国际市场":data="International Market";break;
            case "亚洲市场":data="Asia Market";break;
        }
        return data;
    }
});
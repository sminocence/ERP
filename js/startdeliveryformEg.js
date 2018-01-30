$(function () {
    /**
     * loadTable() 可以渲染订单数据
     *
     * @param data {Array} 订单数据
     */
    var loadTable = function loadTable(data) {
        $('tr:odd').css('background', '#F4F4F4');

        // 遍历数据并将其渲染到 table 中
        $(data).each(function (index) {
            // 若数组长度超出表格行的范围则自动生成 tr
            if (data.length > $('tr').length - 1) {
                for (var i = 0; i < data.length - $('tr').length + 2; i++) {
                    var newTr = $('tr').eq(2).clone(true);
                    $(newTr).clone(true).appendTo('table');

                    // 奇数行变色
                    $('tr:odd').css('background','#F4F4F4');
                }
            }

            // 渲染数据
            var $currentLine = $('table tr').eq(index + 1);
            var totalNumber = data[index].price * data[index].pNumber;
            var id = data[index].orderID;
            data[index].marketName = transport(data[index].marketName);
            $currentLine.find('td').eq(0).text(data[index].orderID);
            $currentLine.find('td').eq(1).text(data[index].marketName);
            $currentLine.find('td').eq(2).text(data[index].needTime);
            $currentLine.find('td').eq(3).text(data[index].productName);
            $currentLine.find('td').eq(4).text(data[index].pNumber);
            $currentLine.find('td').eq(5).text(data[index].price);
            $currentLine.find('td').eq(6).text(totalNumber);
            $currentLine.find('td').eq(7).text(data[index].moneyTime);
            $currentLine.find('td').eq(8).text(data[index].penalPercent);
            $currentLine.find('td').eq(9)
                .empty()
                .append('<input type="button" value="delivery">')
                .attr('id', index);

            // 点击“交货”按钮向后端提交数据
            $('#' + index).click(function (event) {
                // 阻止用户疯狂点击“交货”按钮
                event.preventDefault();

                $.getJSON('DeliverOrderAction!deliverCheck.action?rnd=' + Math.random(), {
                    'orderId': id
                }, function (data) {
                    if (data.statusCode === 1) {
                        // 交货成功的操作
                        $currentLine.find('td').parent('tr').remove();
                        $('tr:odd').css('background','#F4F4F4');
                        $('tr:even').css('background','#FFF');
                    } else {
                        // 交货失败的操作
                        alert(data.errorMessage);
                    }
                });
            });
        });
    };
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
    /**
     * test() 在页面载入后自动加载用户的订单数据
     */
    var test = function test() {
        $.getJSON('OrdersOfUserAction!findNotDeliverOrdersOfUser.action?rnd='+Math.random(),
            function (data) {
                loadTable(data);
            });
    };

    test();
});

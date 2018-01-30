function loading(url, oData, callBack) {
    $.post(url, oData, callBack, 'json');
}

// 当前的第一个页数
var thisFirst;
// 当前的最后一个页数
var thisLast;
// AccountAction!findAccount.action
function jsonCallBack(data) {
    // 先清空，后加载select选择框内容
    $("select[name='start_year']").empty();
    $("select[name='start_period']").empty();
    $("select[name='end_year']").empty();
    $("select[name='end_period']").empty();
    // 加载select选择框内容
    // wxy
    // 从minYear记载到yearInGame
    for (var i = 1; i <= data.yearInGame; i++) {
        $("select[name='start_year']").append('<option>' + i + '</option>');
        $("select[name='end_year']").append('<option>' + i + '</option>');
    }
    // Wxy
    // 从minPeriod记载到periodOfYear
    for (var j = 1; j <= data.periodOfYear; j++) {
        $('select[name=\'start_period\']').append('<option>' + j + '</option>');
        $('select[name=\'end_period\']').append('<option>' + j + '</option>');
    }
    $('select[name=\'start_year\'] option').each(function (index) {
        var tar = $('select[name=\'start_year\'] option');
        if (+$(tar).eq(index).text() === +data.minYear) {
            $(tar).eq(index).attr('selected', 'true');
        }
    });
    $("select[name='start_period'] option").each(function (index) {
        var tar = $("select[name='start_period'] option");
        if (+$(tar).eq(index).text() === +data.minPeriod) {
            $(tar).eq(index).attr('selected', 'true');
        }
    });
    $("select[name='end_year'] option").each(function (index) {
        var tar = $("select[name='end_year'] option");
        if (+$(tar).eq(index).text() === +data.maxYear) {
            $(tar).eq(index).attr('selected', 'true');
        }
    });
    $("select[name='end_period'] option").each(function (index) {
        var tar = $("select[name='end_period'] option");
        if (+$(tar).eq(index).text() === +data.maxPeriod) {
            $(tar).eq(index).attr('selected', 'true');
        }
    });

    // 加载表格数据,完全动态
    // 每一条记录的第一行的位置
    // var m = 0;
    // 表格主体内容清空
    $('tbody').empty();

    var list = data.accountList;

    $(data.accountList).each(function (index) {
        var listDetail = data.accountList[index].accountDetailList;
        list[index].accountIdDescription = translate1(list[index].accountIdDescription);
        listDetail[0].itemType = translate3(listDetail[0].itemType);
        listDetail[0].item = translate2(listDetail[0].item);
        listDetail[1].itemType = translate3(listDetail[1].itemType);
        listDetail[1].item = translate2(listDetail[1].item);
        var newAccount = '<tr>' +
            '<td rowspan="2">' + list[index].accountID + '</td>' +
            '<td rowspan="2">' + list[index].happenTime + '</td>' +
            '<td rowspan="2">' + list[index].accountIdDescription + '</td>' +
            '<td>' + listDetail[0].item + '</td>' +
            '<td>' + listDetail[0].itemType + '</td>' +
            '<td>' + listDetail[0].money + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>' + listDetail[1].item + '</td>' +
            '<td>' + listDetail[1].itemType + '</td>' +
            '<td>' + listDetail[1].money + '</td>' +
            '</tr>';

        //  根据每一条记录的借贷数生成tr数
        // for (var tr = 0; tr < listDetail.length; tr++) {
        //   newAccount += '<tr></tr>';
        // }
        $('.accounting_table tbody').append(newAccount);

        // 对刚生成的记录遍历，第一个tr加进6个<td>并设置rowspan，其余tr加进3个<td>
        // $(newAccount).each(function (idx) {
        //   var td = 0;
        //   if (!idx) {
        //     for (; td < 6; td++) {
        //       $('tbody tr').eq(m).append('<td></td>');
        //     }
        //     for (; td < 3; td++) {
        //       $('tbody tr').eq(m).find('td').eq(j).attr('rowspan', listDetail.length);
        //     }
        //   } else {
        //     for (; td < 3; td++) {
        //       $('tbody tr').eq(m + i).append('<td></td>');
        //     }
        //   }
        // });

        //加进每条记录的内容
        //编号
        // $('tr').eq(index + 1).find('td').eq(0).text(list[index].accountID);
        // // 交易时间
        // $('tr').eq(index + 1).find('td').eq(1).text(list[index].happenTime);
        // // 描述
        // $('tr').eq(index + 1).find('td').eq(2).text(list[index].accountIdDescription);
        //
        // $('tr').eq(index + 1).find('td').eq(3).text(listDetail[0].item);
        // // 类型
        //   $('tr').eq(index + 1).find('td').eq(4).text(listDetail[0].itemType);
        //   // 金额
        //   $('tr').eq(index + 1).find('td').eq(5).text(listDetail[0].money);
        //   $('tr').eq(index + 2).find('td').eq(0).text(listDetail[1].item);
        //   // 类型
        //   $('tr').eq(index + 2).find('td').eq(1).text(listDetail[1].itemType);
        //   // 金额
        //   $('tr').eq(index + 2).find('td').eq(2).text(listDetail[1].money);

        // $(listDetail).each(function (key) {
        //   if (!key) {
        //     $('tr').eq(1 + m).find('td').eq(3).text(listDetail[key].item);
        //     // 类型
        //     $('tr').eq(1 + m).find('td').eq(4).text(listDetail[key].itemType);
        //     // 金额
        //     $('tr').eq(1 + m).find('td').eq(5).text(listDetail[key].money);
        //   } else {
        //     $('tr').eq(1 + m + key).find('td').eq(0).text(listDetail[key].item);
        //     // 类型
        //     $('tr').eq(1 + m + key).find('td').eq(1).text(listDetail[key].itemType);
        //     // 金额
        //     $('tr').eq(1 + m + key).find('td').eq(2).text(listDetail[key].money);
        //   }
        // });

        // m += listDetail.length;
    });

    thisFirst = +$('.pageBody').find('a:first()').text();
    thisLast = +$('.pageBody').find('a:last()').text();
    // thisFirst === 1 ? $('.pageTop a').hide() : $('.pageTop a').show();
    if (thisFirst === 1) {
        $('.pageTop a').hide();
    } else {
        $('.pageTop a').show();
    }
    if (thisLast === +data.pageCount) {
        $('.pageBottom a').hide();
    } else {
        $('.pageBottom a').show();
    }

    // 总记录数
    $('#totalRecord').text(data.recordCount);
    // 总页数
    $('#totalPage').text(data.pageCount);
    // 当前页数
    $('#currentPage').text(data.pageIndex);

    $('.pageBody a').removeClass('current_page');
    // 设置进入页面与pageInde相等的当前页的页码样式
    $('.pageBody a').each(function (aNum) {
        if (+$('.pageBody a').eq(aNum).text() === +data.pageIndex) {
            $(this).addClass('current_page');
        }
    });
}

function page(data) {
    var pNum;
    if (data.pageCount < 10) {
        $('.pageBody').empty();
        for (pNum = 1; pNum <= data.pageCount; pNum++) {
            $('.pageBody').append('<a href="#">' + pNum + '</a>');
        }
    } else {
        $('.pageBody').empty();
        for (pNum = 0; pNum < 10; pNum++) {
            $('.pageBody').append('<a href="#">' + (data.pageIndex + pNum) + '</a>');
        }
    }
    jsonCallBack(data);
}

$(function () {
    // 起始年
    var startYear;
    // 起始周期
    var startPeriod;
    // 结束年
    var endYear;
    // 结束周期
    var endPeriod;

    $.ajax({
        type: 'post',
        url: 'accountAction!findAccount.action',
        dataType: 'json',
        data: {
            'minYear': 1,
            'minPeriod': 1,
            'maxYear': 1,
            'maxPeriod': 1,
            'pageIndex': 1
        },
        success: page,
        complete: function () {
            startYear = $("select[name='start_year'] option:selected").text();
            startPeriod = $("select[name='start_period'] option:selected").text();
            endYear = $("select[name='end_year'] option:selected").text();
            endPeriod = $("select[name='end_period'] option:selected").text();
        }
    });

    // 查询
    // 点击过查询情况下，点击页码是传这个值
    $(document).on('click', '.search_btn', function () {
        startYear = $("select[name='start_year'] option:selected").text();
        startPeriod = $("select[name='start_period'] option:selected").text();
        endYear = $("select[name='end_year'] option:selected").text();
        endPeriod = $("select[name='end_period'] option:selected").text();

        if (+startYear === +endYear) {
            if (startPeriod <= endPeriod) {
                $('.accounting_table tbody td').empty();
                loading('accountAction!findAccount.action', {
                    'minYear': startYear,
                    'minPeriod': startPeriod,
                    'maxYear': endYear,
                    'maxPeriod': endPeriod,
                    'pageIndex': 1
                }, page);
            } else {
                alert('Please choose the correct starting and ending time!');
            }
        } else if (startYear < endYear) {
            $('.accounting_table tbody td').empty();
            loading('accountAction!findAccount.action', {
                'minYear': startYear,
                'minPeriod': startPeriod,
                'maxYear': endYear,
                'maxPeriod': endPeriod,
                'pageIndex': 1
            }, page);
        } else {
            alert('Please choose the correct starting and ending time!');
        }
    });

    // 记录总页数
    var totalPage;
    var pNum;
    var clickPage;

    $('.pageTop a').click(function () {
        totalPage = $(this).parents('.pages').find('#totalPage').text();
        $('.pageBody').empty();
        if (thisFirst > 10) {
            // 点击向前翻时，之前的页数大于10
            for (pNum = 0; pNum < 10; pNum++) {
                $('.pageBody').append('<a href="#">' + (thisFirst - 10 + pNum) + '</a>');
            }
        } else {
            // 点击向前翻时，之前的页数小于10
            for (pNum = 1; pNum <= 10; pNum++) {
                $('.pageBody').append('<a href="#">' + pNum + '</a>');
            }
        }
        clickPage = $('.pageBody a:first()').text();
        loading('accountAction!findAccount.action', {
            'minYear': startYear,
            'minPeriod': startPeriod,
            'maxYear': endYear,
            'maxPeriod': endPeriod,
            'pageIndex': clickPage
        }, jsonCallBack);
    });

    $('.pageBottom a').click(function () {
        totalPage = $(this).parents('.pages').find('#totalPage').text();
        $('.pageBody').empty();
        if (totalPage - thisLast > 10) {
            // 点击向后翻，后面的页数大于10
            for (pNum = 1; pNum <= 10; pNum++) {
                $('.pageBody').append('<a href="#">' + (thisLast + pNum) + '</a>');
            }
        } else {
            // 点击向后翻，后面的页数小于10
            for (pNum = thisLast + 1; pNum <= totalPage; pNum++) {
                $('.pageBody').append('<a href="#">' + pNum + '</a>');
            }
        }
        clickPage = $('.pageBody a:first()').text();
        loading('accountAction!findAccount.action', {
            'minYear': startYear,
            'minPeriod': startPeriod,
            'maxYear': endYear,
            'maxPeriod': endPeriod,
            'pageIndex': clickPage
        }, jsonCallBack);
    });

    $(document).on('click', '.pageBody a', function () {
        clickPage = $(this).text();
        loading('accountAction!findAccount.action', {
            'minYear': startYear,
            'minPeriod': startPeriod,
            'maxYear': endYear,
            'maxPeriod': endPeriod,
            'pageIndex': clickPage
        }, jsonCallBack);
    });
});
function translate2(type){
    switch(type)
    {
        case "现金":type="cash";break;
        case "营业费用":type="Operating expenses";break;
        case "累计折旧":type="Deprection Accumulated";break;
        case "管理费用":type="manage expenses";break;
        case "在制品":type="Producing product";break;
        case "成品":type="producted product";break;
        case "原材料":type="resource";break;
        case "财务费用":type="financial expenses";break;
        case "应收账款":type="Accounts receivable";break;
        case "应交税金":type="tax receivable";break;
        case "主营业务税金":type="Main business tax";break;
        case "主营业务收入":type="Main business income";break;
        case "产品":type="product";break;
        case "主营业务成本":type="Main business cost";break;
        case "在建工程":type="building project";break;
        case "生产线":type="product line";break;
    }
    return type;
};
function translate1(type){
    if(type.indexOf("归还")>=0)
    {
        var str = type.split("息");
        if(str[0].indexOf("归还长期贷款利")>=0)
        str[0] = "return longterm loan interest";
        if (str[0].indexOf("归还长期贷款利")>=0)
            str[0] = "return shortterm loan interest";
        return str[0]+str[1];
    }
    switch(type)
    {
        case "投广告费":type="Advertising expense";break;
        case "维护市场":type="Maintain the market";break;
        case "开拓市场":type="Expand the market";break;
        case "厂房维护":type="Plant maintenance";break;
        case "厂房折旧":type="Depreciation of building";break;
        case "生产线维护费":type="Maintenance cost of production line";break;
        case "生产线折旧":type="Depreciation of product line";break;
        case "产品生产完成":type="product finish";break;
        case "采购原料入库":type="material bought into repository";break;
        case "PRODUCT认证":type="PRODUCT Authentication";break;
        case "产品研发":type="Product Develop";break;
        case "安装生产线":type="set product line";break;
        case "出售产品":type = "sell product";break;
        case "应收账款到期":type ="Maturity of accounts receivable";break;
        case "年末交纳主营业务税金":type="Pay tax at the end of the year";break;
        case "年末交纳所得税":type="Pay the income tax at the end of the year";break;
        case "申请长期贷款生效":type="apply longterm loan";break;
        case "销售产品的营业税":type="sell product tax";break;
        case "出售产品的成本核算":type="sell product cost caculate";break;
        case "维护PRODUCT认证":type="maintain product authentication";break;
        case "申请高利贷生效":type="apply high loan";break;
        case "交纳厂房租赁费":type="submit factory renting cost";break;
        case "生产产品":type="produce product";break;
        case "生产线安装完工":type="product line finish";break;
    }
    return type;
}

function translate3(type){

    switch(type)
    {
        case '借':type="lend";break;
        case '贷':type="loan";break;
    }
    console.log(type);
    return type;
}
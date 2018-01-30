/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 14-12-9
 * Time: 上午9:14
 */
/**
 * 使用说明：
 * 1.new 一个Tabel对象，传入一个对象设置属性，table\tableArea是必须传入的，具体见代码
 *   如：var Jtable = new Table({
        table: $("#table"),
        tableArea: $("#table-area"),
        showIndex:true,
        pageSize:10,
        showIndexContent:'编号'
    });
 * 2.加载表格数据，调用loadData函数，如：Jtable.loadData('../js/table.json','table')
 *   第一个参数是请求地址，第二个参数是返回数据的数组名字，通过res[arr]获得所有的表格数据
 * 3.如传入的格式和table.json的格式不同需要重新写setTableData函数,如果请求方法或者需要新的加载方法也可以通过以下方法扩展新的加载方法
 *   或者重写loadData
 *   如：$.extend(true,Table.prototype,{setTableData:function(){}});
 * 4.可以通过修改tableStyle()方法修改表格样式，如果不需要支持IE6或不需要使用伪类，可以直接通过css设置
 * 5.可以通过修改currPageStyle()方法修改当前页面的样式，如果不需要支持IE6或不需要使用伪类，可以直接通过css设置
 * 6.可以通过修改提供的样式模版table.less修改表格样式，可以直接修改
 *   页面ul的ID是 page-ul   *   上一页ID是 prev   *   下一页ID是 next  *  当前页码信息的li的class是 page-info 页码class是 page
 *   切换每页显示的记录上的id 是 pageSelect
 * 7.表格没有数据的td的class是 has-not-data
 * 8.如果一个页面有多个表格，setTableData函数可以通过loadData传递过来 loadData: function(url,arr,fun)
 * 9.如果一个页面有多个表格，ul需要传递一个ID在创建对象的时候
 * */
var Table = null;
(function(){
    Table = function JTable(options){
        this.option = $.extend(true,{
            table: null,//传入表格如$("#table")  必传项
            tableArea: null,//包装表格的div  必传项
            pageCount:null,//总页数
            pageSize:10,//每页显示的记录数
            totalSize:null,//总共的记录数
            pageUl:null,//分页的UL  $("#page-ul") true or false
            pageID:'page-ul',
            currPage:0,//当前页
            res:null,//表格所有的数据
            showIndex:false,//是否显示序号
            showIndexContent:'序号',//序号列的标题
            togglePage:true,//切换每页显示的记录数
            search:true,//
            searchVal:null//
        },options);

        this.init();//初始化表格
    }

    Table.prototype = {
        init:function(){//初始化表格函数
            var _this = this;
            _this.bindEvent();

        },
        createTogglePage:function(){//创建切换每页显示的记录数按钮
            if(this.iscreate){
                return;
            }
            var _this = this;
            var option = this.option;

            var select = $('<span style="float: left;line-height: 53px">本页显示&nbsp;</span><select id = "pageSelect" class="form-control">' +
                '<option value="10">10</option>'+
                '<option value="20">20</option>'+
                '<option value="40">40</option>'+
                '<option value="50">50</option>'+
                '<option value="100">100</option>'+
                '</select><span style="float: left;line-height: 53px">&nbsp;条记录数</span>');

            option.table.after(select);

            $(document).on('change','#pageSelect',function(){
                //console.log("ss");
                _this.togglePage($(this));
            });
            this.iscreate = true
        },
        togglePage:function(the){//切换每页显示的记录数
            var _this = this;
            var option = this.option;
            option.pageSize = Number(the.val());
            option.currPage = 0;
            _this.setPage();
            _this.setTableData();
        },
        loadData: function(url,arr,fun){//加载数据
            var _this = this;
            $.get(url,function(res){
                _this.successCallBack(res,arr,fun);
            },'json').error(function(){
                    _this.errorCallBack();
                });;
        },
        successCallBack:function(res,arr,fun){
            var _this = this;
            var option = this.option;
            //console.log(res);
            var res = res[arr];
            option.res = res;
            option.totalSize = res.length;
            if(res.length>0){
                if(option.togglePage){
                    _this.createTogglePage();
                }
                if(!fun){
                    _this.setTableData();
                }else{
                    fun();
                }
            }else{
                option.table.find("tr:has(td)").remove();
                var len = option.table.find("th").length;
                var tr = $('<tr>' +
                    '<td colspan="'+len+'" class="has-not-data">暂无数据</td>'+
                    '</tr>');
                option.table.append(tr);
            }
        },
        errorCallBack:function(){
            var option = this.option;
            option.table.find("tr:has(td)").remove();
            var len = option.table.find("th").length;
            var tr = $('<tr>' +
                '<td colspan="'+len+'" class="has-not-data">加载失败</td>'+
                '</tr>');
            option.table.append(tr);
        },
        setTableData:function(boo){//设置表格数据
            var _this = this;
            var option = this.option;
            var res = option.res;
            var curr = option.currPage;
            option.table.find("tr:has(td)").remove();
            for(var i = curr*option.pageSize; i<res.length && i<option.pageSize + curr*option.pageSize ; i++){
                var trdata = res[i];
                var tr = $("<tr></tr>");
                $(trdata).each(function(index){
                    if(index == 0 && option.showIndex){
                        tr.append('<td>'+(i+1)+'</td>');
                    }
                    tr.append('<td>'+trdata[index]+'</td>');
                });
                option.table.append(tr);
            }
            _this.setPage();
        },
        bindEvent:function(){//注册触发事件
            var _this = this;
            var option = this.option;
            $(option.tableArea).on('click',"#prev",function(){
                option.search = false;
                _this.prevPage(option.search);
            });
            $(option.tableArea).on('click',"#next",function(){
                option.search = false;
                _this.nextPage(option.search);
            });
            $(option.tableArea).on('click',".page",function(){
                option.search = false;
                _this.skipPage(this,option.search);
            });
        },
        setPage:function(){//设置分页
            var _this = this;
            var option = this.option;
            option.pageCount = Math.ceil(option.totalSize / option.pageSize);
            if(!option.pageUl && option.pageCount >1){
                _this.createPage();
            }
            if(option.pageCount >1){
                _this.showPageIndex();
                _this.currPageStyle();
                if(option.currPage == 0){
                    $("#prev").hide();
                }
            }else{
                if(option.pageUl){
                    option.pageUl.remove();
                    option.pageUl= null;
                }
            }
        },
        showPageIndex:function(){//分页页码显示
            var option = this.option;
            option.pageUl.html('<li class="page-info">当前第' + Number(Number(option.currPage)+1) +'页，共'+option.pageCount+'页</li>' +
                '<li id="prev"><a href="#" class="prev">上一页</a></li>'+
                '<li id="next"><a href="#" class="next">下一页</a></li>');
            if(option.pageCount<8){
                for(var i = 1 ;i <= option.pageCount;i++){
                    var li = $('<li class="page" data-page="'+(i-1)+'"><a href="#">'+i+'</a></li>');
                    option.pageUl.find("li:last").before(li);
                }
            }else{
                if(option.currPage < 4){
                    for(var i = 1 ;i <= 5;i++){
                        var li = $('<li class="page" data-page="'+(i-1)+'"><a href="#">'+i+'</a></li>');
                        option.pageUl.find("li:last").before(li);
                    }
                    var lis = $('<li>...</li>');
                    option.pageUl.find("li:last").before(lis);
                    var lastLi = $('<li class="page" data-page="'+( option.pageCount-1)+'"><a href="#">'+ option.pageCount+'</a></li>');
                    option.pageUl.find("li:last").before(lastLi);


                }else if(option.currPage > option.pageCount - 4){
                    var firstLi = $('<li class="page" data-page="0"><a href="#">'+1+'</a></li>');
                    option.pageUl.find("li:last").before(firstLi);

                    var lis = $('<li>...</li>');
                    option.pageUl.find("li:last").before(lis);

                    for(var i = option.pageCount -4 ;i <= option.pageCount;i++){
                        var li = $('<li class="page" data-page="'+(i-1)+'"><a href="#">'+i+'</a></li>');
                        option.pageUl.find("li:last").before(li);
                    }

                }else{
                    var firstLi = $('<li class="page" data-page="0"><a href="#">'+1+'</a></li>');
                    option.pageUl.find("li:last").before(firstLi);
                    var lis = $('<li>...</li>');
                    option.pageUl.find("li:last").before(lis);
                    for(var i = option.currPage -1 ;i <= Number(option.currPage) + 2;i++){
                        var li = $('<li class="page" data-page="'+(i-1)+'"><a href="#">'+i+'</a></li>');
                        option.pageUl.find("li:last").before(li);
                    }
                    var lis = $('<li>...</li>');
                    option.pageUl.find("li:last").before(lis);
                    var lastLi = $('<li class="page" data-page="'+( option.pageCount-1)+'"><a href="#">'+ option.pageCount+'</a></li>');
                    option.pageUl.find("li:last").before(lastLi);
                }

            }
        },
        currPageStyle:function(){//当前页码样式
            var option = this.option;
            $(".page").each(function(){
                var the = $(this);
                if(the.attr("data-page") == option.currPage){
                    the.addClass('active');
                }else{
                    the.removeClass('active');
                }
            });
        },
        createPage:function(){//创建页码UL
            var option = this.option;
            var  ul = $('<ul class="page-ul" id="'+option.pageID+'"></ul>');
            option.table.after(ul);
            option.pageUl = $("#"+option.pageID);
        },
        prevPage:function(){//上一页
            var _this = this;
            var option = this.option;
            if(option.currPage >0){
                option.currPage --;
                _this.setTableData();
                if(option.currPage == 0){
                    $("#prev").hide();
                }
            }
            _this.currPageStyle();
        },
        nextPage:function(){//下一页
            var _this = this;
            var option = this.option;
            if(option.currPage < option.pageCount -1){
                option.currPage ++;
                _this.setTableData();
                if(option.currPage == option.pageCount -1){
                    $("#next").hide();
                }
            }
            _this.currPageStyle();
        },
        skipPage:function(the){//点击进入某一页
            var _this = this;
            var option = this.option;
            option.currPage = $(the).attr("data-page");
            _this.setTableData();
            _this.currPageStyle();
            if(option.currPage == 0){
                $("#prev").hide();
            }
            if(option.currPage == option.pageCount -1){
                $("#next").hide();
            }
        }
    };

})();

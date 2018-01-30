/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-3-17
 * Time: 下午3:49
 */
(function(){
    var user = {
        $table:$('.tableStyle'),
        $tableArea:$('#table-area'),
        $btnWrapper:$('.page-wrapper'),
        init:function(){
            this.renderPage();
            this.bindEvent();
        },
        bindEvent:function(){
            var _this = this;
            //全选
            this.$table.on('change',':checkbox',function(){
                _this.checkAll($(this));
            });


            //修改
            this.$table.on('click','.edit',function(e){
                e.preventDefault();
                _this.editItem($(this));
            });

            //批量删除
            this.$tableArea.on('click','.deletes',function(e){
                e.preventDefault();
                _this.deteteItems();
            });

            //删除
            this.$table.on('click','.delete',function(e){
                e.preventDefault();
                _this.deleteItem($(this));
            });
        },
        renderPage:function(){
            this.table = new Table({
                table: $("#table"),
                tableArea: $("#table-area"),
                showIndex:true,
                pageSize:10,
                showIndexContent:'编号'
            });
            this.extendFun();
            this.table.loadData('historyAction!showGroupMembers.action','allGroupMembers');
            //this.table.loadData('js/table.json','user');
            this.$btnWrapper.append('<a href="#" class="form-control btn deletes">批量删除</a>');
        },
        extendFun:function(){
            var _this = this;
            $.extend(true,Table.prototype,{
                setTableData:function(){
                    var _this = this;
                    var option = this.option;
                    var res = option.res;
                    var curr = option.currPage;
                    option.table.find("tr:has(td)").remove();
                    for(var i = curr*option.pageSize; i<res.length && i<option.pageSize + curr*option.pageSize ; i++){
                        var trdata = res[i];
                        var tr = "<tr id=''>";
                        tr += '<td>'+
                            '<input type="checkbox"/>'+
                            '</td>' +
                            '<td class="id">'+trdata.groupNames+'</td>' +
                            '<td class="name">'+trdata.year+'</td>' +
                            '<td class="major">'+trdata.periodOfYears+'</td>'+
                            '<td class="name">'+trdata.members.length+'</td>' ;

                        tr += '<td>'+
                            '<a href="#" class="delete"><span class="icon-trash-empty"></span>删除</a>'+
                            '</td></tr>';
                        option.table.append(tr);
                    }
                    _this.setPage();
                }
            });
        },
        checkAll:function(the){
            if(the.hasClass('check-all')){
                if(the.prop('checked')){
                    this.$table.find(':checkbox').prop('checked',true);
                }else{
                    this.$table.find(':checkbox').prop('checked',false);
                }
            }else{
                if(the.prop('checked')){
                    var mark = 0;
                    this.$table.find('td :checkbox').each(function(){
                        if(!$(this).prop('checked')){
                            mark = 1;
                        }
                    });
                    if(mark == 0){
                        this.$table.find('.check-all').prop('checked',true);
                    }
                }else{
                    this.$table.find('.check-all').prop('checked',false);
                }
            }

        },
        deleteItem:function(the){
            var _this = this;
            var tr = the.closest('tr');
            var id = tr.attr('id');
            var name = tr.find('.name').text();
            var data = {
                userIds:[id]
            }
            DIALOG.confirm('是否删除 ID为'+id+'、用户名为'+name+' 的用户？',function(){
                _this.deleteFun(data)
            });

        },
        deteteItems:function(){
            var _this = this;
            var arr=new Array();
            var checked = this.$table.find('td :checked');
            if(checked.length<=0){
                TIP('请选择用户！','warning',2000);
                return;
            }
            checked.each(function(index){
                arr[index] = $(this).closest('tr').attr('id');
            });
            var data = {
                userIds:arr
            }
            DIALOG.confirm('是否删除所有选中用户？',function(){
                _this.deleteFun(data)
            });
        },
        deleteFun:function(data){
            var _this = this;
            $.post('historyAction!deleteBatchroupName.action',data,function(res){
                if(res.code == 0){
                    TIP('删除成功','success',2000);
                    _this.table.loadData('historyAction!showGroupMembers.action','allGroupMembers');
                    _this.$table.find('th :checkbox').prop('checked',false);
                }else{
                    TIP('出现错误','error',2000);
                }
            },'json');
        }
    }
    user.init();

})();
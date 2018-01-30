/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-3-18
 * Time: 上午8:50
 */
(function(){
    var user = {
        $tab:$('.tab'),
        $table1:$("#table1"),
        $tableArea1:$("#table-area1"),
        init:function(){
            this.renderPage();
            this.bindEvent();
        },
        renderPage:function(){//初始化第一页
            this.$table1.attr('data-load',true);
            this.waitTable = new Table({//table1
                table:this.$table1 ,
                tableArea:this.$tableArea1 ,
                showIndex:true,
                pageSize:10,
                showIndexContent:'numberId'
            });
            this.extendFun();
            this.waitTable.loadData('userManagerAction!findAllRegister.action?rnd='+Math.random(),'user');
            //this.waitTable.loadData('js/table1.json','user');
        },
        extendFun:function(){
            $.extend(true,Table.prototype,{
                setTableData:function(){
                    var _this = this;
                    var option = this.option;
                    var res = option.res;
                    var curr = option.currPage;
                    option.table.find("tr:has(td)").remove();
                    for(var i = curr*option.pageSize; i<res.length && i<option.pageSize + curr*option.pageSize ; i++){
                        var trdata = res[i];
                        var tr = "<tr id='"+trdata.userID+"'>";
                        tr += '<td>'+
                            '<input type="checkbox"/>'+
                            '</td>' +
                            '<td class="id">'+trdata.userID+'</td>' +
                            '<td class="name">'+trdata.name+'</td>' +
                            '<td class="major">'+trdata.major+'</td>' +
                            '<td class="grade">'+trdata.className+'</td>' +
                            '<td class="stuid">'+trdata.studentID+'</td>';

                        tr += '<td>'+
                            '<a href="#" class="agree"><span class="icon-ok-circled"></span>agree</a>'+
                            '<a href="#" class="refuse"><span class="icon-cancel-circled"></span>refuse</a>'+
                            '</td></tr>';
                        option.table.append(tr);
                    }
                    _this.setPage();
                }
            });
        },
        bindEvent:function(){
            var _this = this;
            //全选
            $('.tableStyle').on('change',':checkbox',function(){
                _this.checkAll($(this));
            });

            //第一页
            //同意
            this.$table1.on('click','.agree',function(e){
                e.preventDefault();
                _this.oprateItem($(this),'agree','1');
            });

            //拒绝
            this.$table1.on('click','.refuse',function(e){
                e.preventDefault();
                _this.oprateItem($(this),'refuse');
            });

            //批量同意
            this.$tableArea1.on('click','.agree-btn',function(e){
                e.preventDefault();
                _this.agreeItems('1');
            });

            //批量拒绝
            this.$tableArea1.on('click','.refuse-btn',function(e){
                e.preventDefault();
                _this.refuseItems();
            });

        },
        checkAll:function(the){
            var table = the.closest('table');//找到当前点击的多选框的table
            if(the.hasClass('check-all')){
                if(the.prop('checked')){
                    table.find(':checkbox').prop('checked',true);
                }else{
                    table.find(':checkbox').prop('checked',false);
                }
            }else{
                if(the.prop('checked')){
                    var mark = 0;
                    table.find('td :checkbox').each(function(){
                        if(!$(this).prop('checked')){
                            mark = 1;
                        }
                    });
                    if(mark == 0){
                        table.find('.check-all').prop('checked',true);
                    }
                }else{
                    table.find('.check-all').prop('checked',false);
                }
            }
        },
        getChecked:function(mark){
            var table;
            var arr = new Array();
            switch (mark){
                case '1':
                    table = this.$table1;
                    break;
                case '2':
                    table = this.$table2;
                    break;
            }
            var checked = table.find('td :checkbox:checked');
            if(checked.length>0){
                checked.each(function(index){
                    arr[index] = $(this).closest('tr').attr('id');
                });
                var data = {
                    userIds:arr
                }
                return data;
            }else{
                return false;
            }
        },
        oprateItem:function(the,oprate,mark){
            var _this = this;
            var tr = the.closest('tr');
            var id = tr.attr('id');
            var data = {
                userIds:[id]
            };
            switch (oprate){
                case 'agree':
                    this.agreeFun(data,mark);
                    break;
                case 'delete':
                    var name = tr.find('.name').text();
                    DIALOG.confirm('Do you delete ID'+id+'、username is'+name+' User registration?',function(){
                        _this.deleteFun(data);
                    });
                    break;
                case 'refuse':
                    var name = tr.find('.name').text();
                    DIALOG.confirm('Whether to reject the user ID'+id+'、username'+name+'  User registration？',function(){
                        _this.refuseFun(data);
                    });
                    break;
            }

        },
        agreeItems:function(mark){//批量同意
            var _this = this;
            var data = this.getChecked(mark);
            if(!data){
                TIP('Please select the user you want to agree to！','warning',2000);
                return;
            }
            this.agreeFun(data,mark);
        },
        agreeFun:function(data,mark){
            var _this = this;
            switch (mark){
                case '1'://第一页同意
                    $.post('userManagerAction!passBatchRegisterUsers.action?rnd='+Math.random(),data,function(res){
                        if(res.code == 0){
                            TIP('Successful operation！','success',2000);
                            _this.waitTable.loadData('userManagerAction!findAllRegister.action?rnd='+Math.random(),'user');
                            _this.$table1.find('th :checkbox').prop('checked',false);
                        }else{
                            TIP('operation failed！','error',2000);
                        }
                    },'json');
                    break;
                case '2'://第二页同意
                    $.post('userManagerAction!passBatchRegisterUsers.action?rnd='+Math.random(),data,function(res){
                        if(res.code == 0){
                            TIP('Successful operation！','success',2000);
                            _this.refuseTable.loadData('js/table1.json','user',function(){
                                _this.setTableTwo();
                                _this.$table2.find('th :checkbox').prop('checked',false);
                            });
                            _this.$table1.find('th :checkbox').prop('checked',false);
                        }else{
                            TIP('operation failed！','error',2000);
                        }
                    },'json');
                    break;
                default:
                    window.location.reload();
            }

        },
        refuseFun:function(data){
            var _this = this;
            $.post('userManagerAction!deleteBatchRegiUsers.action?rnd='+Math.random(),data,function(res){
                if(res.code == 0){
                    TIP('Successful operation！','success',2000);
                    _this.waitTable.loadData('userManagerAction!findAllRegister.action?rnd='+Math.random(),'user');
                    _this.refuseTable.loadData('js/table1.json','user',function(){
                        _this.setTableTwo();
                    });
                    $('th :checkbox').prop('checked',false);
                }else{
                    TIP('operation failed！','error',2000);
                }
            },'json');
        },
        refuseItems:function(){//批量拒绝
            var _this = this;
            var arr = new Array();
            var checked = this.$table1.find('td :checkbox:checked');
            if(checked.length>0){
                DIALOG.confirm('Do you want to deny selected users?？',function(){
                    checked.each(function(index){
                        arr[index] = $(this).closest('tr').attr('id');
                    });
                    var data = {
                        userIds:arr
                    }
                    _this.refuseFun(data);
                });
            }else{
                TIP('Please select the user you want to reject！','warning',2000);
            }

        }
    }
    user.init();



})();
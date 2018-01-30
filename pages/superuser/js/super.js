/**
 * Author: fanqing
 * Date: 16-12-2
 * Time: 2:32
 */
(function () {
  var user = {
      $table: $('.tableStyle'),
      $tableArea: $('#table-area'),
      $btnWrapper: $('.page-wrapper'),
      init: function () {
          this.renderPage();
          this.bindEvent();
          this.search();
        },
      bindEvent: function () {
          var _this = this;

            // 删除
          this.$table.on('click', '.delete', function (e) {
              e.preventDefault();
              _this.deleteItem($(this));
            });

            // 重置密码
          this.$table.on('click', '.reset', function (e) {
              e.preventDefault();
              _this.resetPassword(this);
            });
        },

      renderPage: function () {
          var _this = this;
          this.table = new Table({
              table: $('#table'),
              tableArea: $('#table-area'),
              showIndex: true,
              pageSize: 10,
              showIndexContent: '编号'
            });
          this.extendFun();
          this.table.loadData('superAdminAction!getAllAdminUsers.action?rnd='+Math.random(), 'data');
        },

      extendFun: function () {
          var _this = this;
          $.extend(true, Table.prototype, {
              setTableData: function () {
                  var _this = this;
                  var option = this.option;
                  var res = option.res;
                  var curr = option.currPage;
                  option.table.find('tr:has(td)').remove();
                  for (var i = curr * option.pageSize; i < res.length && i < option.pageSize + curr * option.pageSize; i++) {
                      var trdata = res[i];
                      var tr = '<tr id=\'' + trdata.adminId + '\'>';
                      tr += '<td class="id">' + trdata.adminId + '</td>' +
                              '<td class="name">' + trdata.adminName + '</td>';

                      tr += '<td>' +
                            '<a href="#" class="delete"><span class="icon-trash-empty"></span>删除</a>' +
                            '<a href="#" class="reset">重置密码</a>' +
                            '</td></tr>';
                      option.table.append(tr);
                    }
                  _this.setPage();
                }
            });
        },

      extendFunSearch: function (txt, boo) {
          var filterArr = [];
          $.extend(true, Table.prototype, {
              setTableData: function () {
                  var _this = this;
                  var option = this.option;
                  var curr = option.currPage;
                  option.search = boo || null;
                  if (option.search) {
                      for (var i = 0, item ; item = option.res[i++];) {
                          if (item.adminId.indexOf(txt) != -1  ) {
                              filterArr.push(item);
                            }
                        }
                      this.option.searchVal = filterArr;
                      curr = 0;//
                    }
                  console.log(this.option.searchVal);
                  var res = this.option.searchVal;
                  this.option.totalSize = res.length;

                  option.table.find('tr:has(td)').remove();
                  for (var i = curr * option.pageSize; i < res.length && i < option.pageSize + curr * option.pageSize; i++) {
                      var trdata = res[i];
                      var tr = '<tr id=\'' + trdata.adminId + '\'>';
                      tr += '<td class="id">' + trdata.adminId + '</td>' +
                              '<td class="name">' + trdata.adminName + '</td>';

                      tr += '<td>' +
                            '<a href="#" class="delete"><span class="icon-trash-empty"></span>删除</a>' +
                            '<a href="#" class="reset">重置密码</a>' +
                            '</td></tr>';
                      option.table.append(tr);
                    }
                  _this.setPage();
                }
            });
        },

      search: function (res) {
          var _this = this;
          $('#search_user').change(function () {
              var txt = $.trim($(this).val());
              if ( txt != '') {
                  var boo = true;
                  _this.extendFunSearch(txt, boo);
                  _this.table.loadData('superAdminAction!getAllAdminUsers.action?rnd='+Math.random(), 'data');
                } else{
                  _this.extendFun();
                  _this.table.loadData('superAdminAction!getAllAdminUsers.action?rnd='+Math.random(), 'data');
                }
            }).keyup(function () {
              $(this).change();
            });
        },

      deleteItem: function (the) {
          var _this = this;
          var tr = the.closest('tr');
          var id = tr.attr('id');
          var name = tr.find('.name').text();
          var data = {'adminId': '' + id};
          DIALOG.confirm('是否删除 ID为' + id + '、用户名为' + name + ' 的用户？', function () {
              _this.deleteFun(data);
            });
        },

      deleteFun: function (data) {
          var _this = this;
          $.post('superAdminAction!deleteAdminUser.action?rnd='+Math.random(), data, function (res) {
              if (res.code == 1) {
                  TIP('删除成功', 'success', 2000);
                  _this.table.loadData('superAdminAction!getAllAdminUsers.action?rnd='+Math.random(), 'data');
                  _this.$table.find('th :checkbox').prop('checked', false);
                }else {
                  TIP('不能被删除', 'error', 2000);
                }
            }, 'json');
        },

      resetPassword: function (target) {
          var _this = this;
          console.log($(target));
          var id = $(target).parent().parent().attr('id'); // 选中用户的 ID
          var username = $(target).parent().siblings().eq(1).html(); // 选中用户的用户名
          this.dialog = new DIALOG({
            title: '确定要将 <b>' + username + '</b> 的密码重置为 <b>admin </b>吗？',
            content: '<div class="dialog-footer">' +
                     '<a type="button" class="btn yes">确定</a>' +
                     '</div>',
            beforeClose: null,
            closeBtn: true,
            className: 'reset-area',
            cache: false,
            width: '400px'
          });

          this.dialog.open();

          $('.yes').on('click', function () {
            $.post('superAdminAction!resetAdminPassword.action?rnd='+Math.random(), {
              'adminId': id
            }, function (res) {
              if (res.code == 1) {
                _this.dialog.close();
                var timer = setTimeout(function(){
                  clearTimeout(timer);
                  window.location.reload();
                }, 1000);
                TIP('重置密码成功','success',2000);
              }else{
                TIP('重置密码失败','error',2000);
              }
            }, 'json');
          });
        }

    };
  user.init();
})();

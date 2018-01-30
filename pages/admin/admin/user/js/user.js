/**
 * Author: chenjiajun
 * Date: 15-3-17
 * Time: 下午3:49
 */
(function () {
  var user = {
    $table: $('.tableStyle'),
    $tableArea: $('#table-area'),
    $btnWrapper: $('.page-wrapper'),
    init: function () {
        this.renderPage();
        this.bindEvent();
        this.clickAdds();
        this.search();
      },
    bindEvent: function () {
        var _this = this;
            // 全选
        this.$table.on('change', ':checkbox', function () {
            _this.checkAll($(this));
          });


            // 修改
        this.$table.on('click', '.edit', function (e) {
            e.preventDefault();
            _this.editItem($(this));
          });

            // 批量删除
        this.$tableArea.on('click', '.deletes', function (e) {
            e.preventDefault();
            _this.deteteItems();
          });

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
        this.table.loadData('userManagerAction!findAllApprovedUser.action?rnd=' + Math.random(), 'user');

            // this.table.loadData('js/table.json','user');
        this.$btnWrapper.append('<div class=" btns"></div>');


        $('.btns').append('<a href="#" class="input_form_icon"></a>');
        $('.btns').append('<a href="DownloadModel.action" class="btn_a downmodel">下载模板</a>');
        $('.btns').append('<a href="DownloadIntroduction.action" class="btn_a downintrodu">下载说明书</a>');
        $('.btns').append('<a href="#" class="btn_a deletes downintrodu">批量删除</a>');
        $('.input_form_icon').append('<form action="" method="post" id="form1" enctype="multipart/form-data"><input type="file" id="csva_input" accept=".csv" name="CsvFile"></form>');
        $('.input_form_icon form').append('<input type="submit" value="批量导入" id="inputF" class="btn_a adds">');
        $('.input_form_icon ').append('<span id="disFN"><span>');
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
                    var tr = '<tr id=\'' + trdata.userID + '\'>';
                    tr += '<td>' +
                            '<input type="checkbox"/>' +
                            '</td>' +
                            '<td class="id">' + trdata.userID + '</td>' +
                            '<td class="name">' + trdata.name + '</td>' +
                            '<td class="major">' + trdata.major + '</td>' +
                            '<td class="grade">' + trdata.className + '</td>' +
                            '<td class="stuid">' + trdata.studentID + '</td>';

                    tr += '<td>' +
                            '<a href="#" class="edit"><span class="icon-edit"></span>修改</a>' +
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
        var _this = this;
        var filterArr = [];
        $.extend(true, Table.prototype, {
            setTableData: function () {
                var _this = this;
                var option = this.option;
                var curr = option.currPage;
                option.search = false || boo;
                if (option.search) {
                    for (var i = 0, item; item = option.res[i++];) {
                        if (item.userID.toLowerCase().indexOf(txt) != -1  ) {
                            filterArr.push(item);
                          }
                      }
                    this.option.searchVal = filterArr;
                    curr = 0;// 使每次搜索出来的数据都从第一页开始渲染
                    boo = false;// 使搜索数据发生改变时才重新搜索数据
                  }
                var res = this.option.searchVal;
                this.option.totalSize = res.length;
                option.table.find('tr:has(td)').remove();
                for (var i = curr * option.pageSize; i < res.length && i < option.pageSize + curr * option.pageSize; i++) {
                    var trdata = res[i];
                    var tr = '<tr id=\'' + trdata.userID + '\'>';
                    tr += '<td>' +
                            '<input type="checkbox"/>' +
                            '</td>' +
                            '<td class="id">' + trdata.userID + '</td>' +
                            '<td class="name">' + trdata.name + '</td>' +
                            '<td class="major">' + trdata.major + '</td>' +
                            '<td class="grade">' + trdata.className + '</td>' +
                            '<td class="stuid">' + trdata.studentID + '</td>';

                    tr += '<td>' +
                            '<a href="#" class="edit"><span class="icon-edit"></span>修改</a>' +
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
            var txt = $.trim($(this).val().toLowerCase());
            if ( txt != '') {
                var boo = true;
                _this.extendFunSearch(txt, boo);
                _this.table.loadData('userManagerAction!findAllApprovedUser.action?rnd=' + Math.random(), 'user');
              } else {
                _this.extendFun();
                _this.table.loadData('userManagerAction!findAllApprovedUser.action?rnd=' + Math.random(), 'user');
              }
          }).keyup(function () {
              $(this).change();
            });
      },
    checkAll: function (the) {
        if (the.hasClass('check-all')) {
            if (the.prop('checked')) {
                this.$table.find(':checkbox').prop('checked', true);
              } else {
                this.$table.find(':checkbox').prop('checked', false);
              }
          } else if (the.prop('checked')) {
              var mark = 0;
              this.$table.find('td :checkbox').each(function () {
                      if (!$(this).prop('checked')) {
                          mark = 1;
                        }
                    });
              if (mark == 0) {
                      this.$table.find('.check-all').prop('checked', true);
                    }
            } else{
              this.$table.find('.check-all').prop('checked', false);
            }
      },
    editItem: function (the) {
        var _this = this;
        var tr = the.closest('tr');
        var id = tr.attr('id');
           //  alert(id);
        var name = tr.find('.name');
        var major = tr.find('.major');
        var grade = tr.find('.grade');
        var stuid = tr.find('.grade');
        this.dialog = new DIALOG({
            title: '修改用户信息',
            content: '<div class="dialog-body" id="modifyItem-wrapper">' +
                    '<form class="wrapper" id="modifyItem">' +
                    '<div class="input-div clear-fix">' +
                    '<label class="label-div"><span class="start">*</span>用户名ID</label>' +
                    '<div class="label-input">' +
                    '<input type="text" class="form-control" name="id" readonly="readonly" style="cursor: not-allowed"' +
                    'value="' + id + '"/>' +
                    '</div>' +
                    '</div>' +
                    '<div class="input-div clear-fix">' +
                    '<label class="label-div"><span class="start">*</span>姓名</label>' +
                    '<div class="label-input">' +
                    '<input type="text" class="form-control modify-elem name" name="name"' +
                    'data-validation-error-msg="姓名不能为空" data-validation="required" value="' + name.text() + '"/>' +
                    '</div>' +
                    '</div>' +
                    '<div class="input-div clear-fix">' +
                    '<label class="label-div"><span class="start">*</span>专业</label>' +
                    '<div class="label-input">' +
                    '<input type="text" class="form-control modify-elem major" name="major"' +
                    'data-validation-error-msg="专业不能为空" data-validation="required" value= "' + major.text() + '"/>' +
                    '</div>' +
                    '</div>' +
                    '<div class="input-div clear-fix">' +
                    '<label class="label-div"><span class="start">*</span>班级</label>' +
                    '<div class="label-input">' +
                    '<input type="text" class="form-control modify-elem grade" name="garde"' +
                    'data-validation-error-msg="班级不能为空" data-validation="required" value = "' + grade.text() + '"/>' +
                    '</div>' +
                    '</div>' +
                    '<div class="input-div clear-fix">' +
                    '<label class="label-div"><span class="start">*</span>学号</label>' +
                    '<div class="label-input">' +
                    '<input type="text" class="form-control modify-elem stuid" name="stuid"' +
                    'data-validation-error-msg="学号不能为空" data-validation="required" value="' + stuid.text() + '"/>' +
                    '</div>' +
                    '</div>' +
                    '</form>' +
                    '<div class="dialog-footer">' +
                    '<a type="button" class="btn save">保存</a>' +
                    '<a type="button" class="btn cancel">取消</a>' +
                    '</div>' +
                    '</div>',
            beforeClose: null,
            closeBtn: true,
            className: '',
            cache: false, // 是否缓存。若为false则close的时候会remove掉对话框对应的dom元素
            width: '500px' // 窗口宽度，默认为40%
          });
        $.validate();
        this.dialog.open();

        var form = $('#modifyItem');
        var wrapper = $('#modifyItem-wrapper');
            // 标记信息是否改变
        var index = 0;
        form.find('.modify-elem').change(function () {
            index++;
          });

            // 保存信息
        wrapper.find('.save').click(function (e) {
            e.preventDefault();
            if (index > 0) {
                   // var id = tr.attr('id');
                       // alert(id);
                var newName = form.find('.name').val();
                var newMajor = form.find('.major').val();
                var newGrade = form.find('.grade').val();
                var newStuid = form.find('.stuid').val();
                var data = {
                    userID: id, // 用户的ID
                    name: newName, // 用户的姓名
                    major: newMajor, // 专业
                    className: newGrade, // 班级
                    studentID: newStuid// 学号
                  };
                if (!BTN.isLoading($('.save')) && form.isValid()) {
                    BTN.addLoading($('.save'), '保存中', 'loading');
                    $.post('userManagerAction!updateApprovedUserInfo.action?rnd=' + Math.random(), data, function (res) {
                        BTN.removeLoading($('.save'), '保存');
                        if (res.code == 0) {
                            TIP('保存成功', 'success', 2000);
                            name.text(newName);
                            major.text(newMajor);
                            grade.text(newGrade);
                            stuid.text(newStuid);
                            _this.dialog.close();
                          } else {
                            TIP('保存失败！', 'error', 2000);
                          }
                      }, 'json');
                  }
              } else {
                TIP('没有任何修改任何内容', 'warning', 2000);
              }
          });

            // 取消保存
        wrapper.find('.cancel').click(function (e) {
            e.preventDefault();
            _this.dialog.close();
          });
      },
        // 批量导入
    clickAdds: function () {
        $('#form1').on('change', '#csva_input', function (event) {
            var t = event.target;
            var browser = navigator.appName;
            var b_version = navigator.appVersion;
            var name;
            if (b_version.indexOf('MSIE') != -1) {
                name = t.form.firstChild.name;
              } else {
                name = t.files[0].name;
              }
            $('#disFN').text(name);
            $('#inputF').on('click', function () {
            var options = {
              url: 'cSVAction!batchInsertApprovedUser.action?rnd=' + Math.random(),
              success: function (res) {
                if ($.parseJSON(res).code == 1) {
                  TIP('批量导入数据成功 ！', 'success', 0);
                    var timer = setTimeout(function () {
                      window.location.reload();
                      clearTimeout(timer);
                    }, 1000);
                } else if ($.parseJSON(res).code == 0) {
                  TIP('批量导入数据失败 ！', 'error', 0);
                }
              }
            };

            $('#form1').ajaxForm(options);
          });
          $('#inputF').trigger('click');
        });
      },
    deleteItem: function (the) {
        var _this = this;
        var tr = the.closest('tr');
        var id = tr.attr('id');
        var name = tr.find('.name').text();
        var data = {
            userIds: [id]
          };
        DIALOG.confirm('是否删除 ID为' + id + '、用户名为' + name + ' 的用户？', function () {
            _this.deleteFun(data);
          });
      },
    deteteItems: function () {
        var _this = this;
        var arr = new Array();
        var checked = this.$table.find('td :checked');
        if (checked.length <= 0) {
            TIP('请选择用户！', 'warning', 2000);
            return;
          }
        checked.each(function (index) {
            arr[index] = $(this).closest('tr').attr('id');
          });
        var data = {
            userIds: arr
          };
        DIALOG.confirm('是否删除所有选中用户？', function () {
            _this.deleteFun(data);
          });
      },
    deleteFun: function (data) {
        var _this = this;
        $.post('userManagerAction!deleteBatchApprUsers.action?rnd=' + Math.random(), data, function (res) {
            if (res.code == 0) {
                TIP('删除成功', 'success', 2000);
                _this.table.loadData('userManagerAction!findAllApprovedUser.action?rnd=' + Math.random(), 'user');
                _this.$table.find('th :checkbox').prop('checked', false);
              } else {
                TIP('该用户正在游戏中，不能被删除', 'error', 2000);
              }
          }, 'json');
      },
    resetPassword: function (target) {
        var _this = this;
        var id = $(target).parent().parent().attr('id'); // 选中用户的 ID
        var username = $(target).parent().siblings().eq(2).html(); // 选中用户的用户名

        this.dialog = new DIALOG({
            title: '确定要将 <b>' + username + '</b> 的密码重置为 <b>123456 </b>吗？',
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
            $.post('userManagerAction!resetPassword.action?rnd=' + Math.random(), {
              userID: id
            }, function (res) {
              if (res.code === 0) {
                TIP('重置密码成功','success',2000);
                _this.dialog.close();
              } else {
                TIP('重置密码失败','error',2000);
              }
            }, 'json');
          });
      }

  };
  user.init();
})();

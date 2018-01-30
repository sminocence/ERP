$(function () {
  $.loginCheck();
  $.createGroup();
});

$.extend({
  loginCheck: function () {
    // 实现index页面复选框变为单选
    $('#page_index :input[type=checkbox]').click(function () {
      $('#page_index :input[type=checkbox]').prop('checked', false);
      $(this).prop('checked', true);
    });

    var _this1;
    var _this2;
    var _this3;
    var _this4;
    var _this5;
    var _this6;
    var ok1 = false;
    var ok2 = false;
    var ok3 = false;
    var ok4 = false;
    var htmlType;

    var userCheck = function userCheck(_this1) {
      if ($(_this1).val().search(/\s+/) === 0 || $(_this1).val() === '') {
        $('.errorInfo').empty().append('用户名不能为空').css('color', 'orange');
        ok1 = false;
      } else {
        ok1 = true;
      }
    };

    var pswCheck = function pswCheck(_this2) {
      if ($(_this2).val().search(/\s+/) === 0 || $(_this2).val() === '') {
        $('.errorInfo').empty().append('密码不能为空').css('color', 'orange');
        ok2 = false;
      } else {
        $('.errorInfo').empty();
        ok2 = true;
      }
    };

    var identifyCheck = function identifyCheck(_this3) {
      if ($(_this3).is(':checked')) {
        ok3 = true;
      } else {
        ok3 = false;
      }
    };

    var codeCheck = function codeCheck(_this4) {
      if ($(_this4).val().search(/\s+/) === 0 || $(_this4).val() === '') {
        $('.errorInfo').empty().append('验证码不能为空').css('color', 'orange');
        ok4 = false;
      } else {
        $('.errorInfo').empty();
        ok4 = true;
      }
    };

    var checkAll1 = function checkAll1() {
      userCheck($('input[name="username"]'));
      pswCheck($('input[name="password"]'));
      identifyCheck($('input[name="identify"]'));
      codeCheck($('input[name="checkcode"]'));
    };

    var checkAll2 = function checkAll2() {
      userCheck($('input[name="superAdminid"]'));
      pswCheck($('input[name="superAdminPassword"]'));
    };
    $('input[name="username"]').blur(function () {
      _this1 = $(this);
      htmlType = false;
      userCheck(_this1);
    });

    $('input[name="password"]').blur(function () {
      _this2 = $(this);
      htmlType = false;
      checkAll1();
      pswCheck(_this2);
    });

    $('input[name="identify"]').click(function () {
      _this3 = $(this);
      htmlType = false;
      identifyCheck(_this3);
    });

    $('input[name="checkcode"]').blur(function () {
      _this4 = $(this);
      htmlType = false;
      codeCheck(_this4);
    });

    $('input[name="superAdminid"]').blur(function () {
      _this5 = $(this);
      htmlType = true;
      userCheck(_this5);
    });

    $('input[name="superAdminPassword"]').blur(function () {
      _this6 = $(this);
      htmlType = true;
      pswCheck(_this6);
    });

    // 普通用户登录——点击
    $('input[name="login"]').on('click', function () {
      $('.errorInfo').empty();

      if (!htmlType) {
        checkAll1();
      } else {
        checkAll2();
      }

      if (ok1 && ok2 && ok3 && ok4) {
        var username = $('input[name="username"]').val();
        var password = $('input[name="password"]').val();
        var checkcode = $('input[name="checkcode"]').val();
        var status = $('input[type="checkbox"]:checked').val();

        $.post('loginAction!login.action', {
          'username': username,
          'password': password,
          'status': status,
          'checkcode': checkcode
        }, function (data) {
          if (typeof (data.resultMessage) !== 'undefined') {
            alert(data.resultMessage);
          }
          if (eval(data.number) > eval(2)) {
            alert('你的密码错误超过3次,请重新登录页面');
          }
          if (typeof (data.location) !== 'undefined' && data.location !== 'index.html') {
            location.href = data.location;
          }
        }, 'json');
      }
    });

    // 普通用户登录——按键
    $(window).on('keydown', function (event) {
      if (event.keyCode === 13) {
        $('.errorInfo').empty();

        if (!htmlType) {
          checkAll1();
        } else {
          checkAll2();
        }

        if (ok1 && ok2 && ok3 && ok4) {
          var username = $('input[name="username"]').val();
          var password = $('input[name="password"]').val();
          var checkcode = $('input[name="checkcode"]').val();
          var status = $('input[type="checkbox"]:checked').val();

          $.post('loginAction!login.action', {
            'username': username,
            'password': password,
            'status': status,
            'checkcode': checkcode
          }, function (data) {
            if (typeof (data.resultMessage) !== 'undefined') {
              alert(data.resultMessage);
            }
            if (eval(data.number) > eval(2)) {
              alert('你的密码错误超过3次,请重新登录页面');
            }
            if (typeof (data.location) !== 'undefined' && data.location !== 'index.html') {
              location.href = data.location;
            }
          }, 'json');
        }
      }
    });

    // 超级管理员登录——点击
    $('.btn-admin').on('click', function () {
      $('.errorInfo').empty();
      if (!htmlType) {
        checkAll1();
      } else {
        checkAll2();
      }
      if (ok1 && ok2) {
        var username = $('input[name="superAdminid"]').val();
        var password = $('input[name="superAdminPassword"]').val();
        if (username && password) {
          $.post('superAdminAction!superAdminLogin.action', {
            'superAdminid': username,
            'superAdminPassword': password
          }, function (res) {
            if (res.code === 1) {
              location.assign('pages/superuser/super.html');
            } else {
              alert('用户名或密码输入有误!');
            }
          }, 'json');
        }
      }
    });

    // 超级管理员登录——按键
    $(window).on('keydown', function (event) {
      if (event.keyCode === 13) {
        $('.errorInfo').empty();

        if (!htmlType) {
          checkAll1();
        } else {
          checkAll2();
        }

        if (ok1 && ok2) {
          var username = $('input[name="superAdminid"]').val();
          var password = $('input[name="superAdminPassword"]').val();
          if (username && password) {
            $.post('superAdminAction!superAdminLogin.action', {
              'superAdminid': username,
              'superAdminPassword': password
            }, function (res) {
              if (res.code === 1) {
                location.assign('pages/superuser/super.html');
              } else {
                alert('用户名或密码输入有误!');
              }
            }, 'json');
          }
        }
      }
    });
  },
  createGroup: function () {
    var _this;
    var ok1 = false;
    var ok2 = false;

    var groupname = function groupname(_this) {
      $(_this).next().empty();
      $('.error').empty();

      if ($(_this).val().search(/\s+/) === 0 || $(_this).val() === '') {
        var str = $(_this).parents('tr').find('.td1').text();
        str = str.replace(/\s+/g, '');

        $('.error').empty().append(str + '不能为空').css('color', 'orange');
        ok1 = false;
      } else {
        // 不为空时，取得输入组名和已存在组名判断
        $.get('gameGroupAction!isGameGroupExist.action?rnd=' + Math.random(), {
          'groupName': $(_this).val()
        }, function (data) {
          if (data === true) {
            // 不存在，可以使用
            $(_this).next()
              .empty()
              .append('<img src="../../images/checked.gif">')
              .css('margin-left', '3px');

            ok2 = true;
          } else {
            $('.error').empty().append('该组名已存在');
            ok2 = false;
            return false;
          }
        }, 'json');
      }
    };

    var creategroupCheck = function creategroupCheck(_this) {
      $(_this).next().empty();
      $('.error').empty();

      if ($(_this).val().search(/\s+/) === 0 || $(_this).val() === '') {
        var str = $(_this).parents('tr').find('.td1').text();
        str = str.replace(/\s+/g, '');
        $('.error').empty().append(str + '不能为空').css('color', 'orange');
        ok1 = false;
      } else if ($(_this).not('input[name="groupName"]').val() <= 0 || $(_this).not('input[name="groupName"]').val() > 50) {
        $('.error').empty().append('规定范围为(0-50)').css('color', 'orange');
        ok1 = false;
      } else if ($(_this).val().match(/^[0-9]*[1-9][0-9]*$/) === null) {
        $('.error').empty().append('请输入正确格式').css('color', 'orange');
        ok1 = false;
      } else {
        $(_this).next()
          .empty()
          .append('<img src="../../images/checked.gif">')
          .css('margin-left', '3px');
        ok1 = true;
      }
    };

    $('input[type="text"]').not('input[name="groupName"]').blur(function () {
      _this = $(this);
      creategroupCheck(_this);
    });

    $('input[name="groupName"]').blur(function () {
      _this = $(this);
      groupname(_this);
    });

    $('input[name="create"]').click(function () {
      groupname($('input[name="groupName"]'));
      creategroupCheck($('input[name="userNumbers"]'));
      /*creategroupCheck($('input[name="years"]'));
      creategroupCheck($('input[name="periodsOfOneYear"]'));*/
      if (ok1 && ok2) {
        var groupName = $('input[name="groupName"]').val();
        var userNumbers = $('input[name="userNumbers"]').val();
        /*var years = $('input[name="years"]').val();
        var periodsOfOneYear = $('input[name="periodsOfOneYear"]').val();*/
        $.post('gameGroupAction!addGameGroup.action?rnd=' + Math.random(), {
          'groupName': groupName,
          'userNumbers': userNumbers,
          'years': 6,
          'periodsOfOneYear': 4
        }, function () {
          window.parent.location.assign('useroperate.html');
        });
      } else if (!ok2) {
        alert('请重新输入分组名称');
      } else {
        alert('请输入正确信息');
      }
    });
  }
});

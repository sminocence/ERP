/**
 * 分组界面聊天室功能
 */

// 查询聊天室对话内容
function loadDialog(_div) {
  $.get('chatAction!findAll.action?rnd=' + Math.random(), function (data) {
    var username = data.username;

    $(data.records).each(function (index) {
      var user = data.records[index].userName;
      var record = data.records[index].record;

      if (username === user) {
        var addContent = '<p><span class="ads_color1">' + user + '</span>&nbsp;说：' + record + '</p>';
        $(_div).append(addContent);
      } else {
        var addContent = '<p><span class="ads_color2">' + user + '</span>&nbsp;说：' + record + '</p>';
        $(_div).append(addContent);
      }
    });

		// 控制滚动条始终在最底部
    var scrollTop = $(_div)[0].scrollHeight;
    $(_div).scrollTop(scrollTop);
  }, 'json');
}

// 聊天室对话——发送的消息
function addDialog(_div, list) {
  var data = jQuery.parseJSON(list);
  var username = data.userName;
  var record = data.record;
  var addContent = '<p><span class="ads_color2">' + username + '</span>：' + record + '</p>';

  $(_div).append(addContent);

  // 控制滚动条始终在最底部
  var scrollTop = $(_div)[0].scrollHeight;
  $(_div).scrollTop(scrollTop);
}

// 发送聊天消息
function sendMessage() {
  var $input = $('input[name="send"]').prev();
  var content = $input.val();

  if (content === '') {
    $input.val('发送消息不能为空');

    $input.on('click', function () {
      if ($(this).val() === '发送消息不能为空') $(this).val('');
    });
  } else if (content.length > 25) {
    alert('发送消息不得超过 25 个字符');
  } else if (content !== '发送消息不能为空') {
    $.post('chatAction!addChat.action?rnd=' + Math.random(), {
      'record': content
    }, function () {
      $input.val('');
    });
  }
}

// 绑定发送事件
function sendDialog() {
  $('input[name="send"]').on('click', sendMessage);

  $(window).on('keydown', function (event) {
    if (event.keyCode === 13) sendMessage();
  });
}



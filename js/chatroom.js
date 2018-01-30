function insert() {
  var username = document.getElementById('username').value;
  if (!username) {
    alert('请输入用户名!');
    return false;
  }
  SendPushService.addUsers(username, function (data) {
    // data 为 addUser 方法返回值
    // 注册成功，把 userid 放到当前页面
    document.getElementById('userid').value = data.id;
    document.getElementById('add').disabled = true;
    document.getElementById('username').disabled = true;
  });
}

// 退出
function exit() {
  var userid = document.getElementById('userid').value;
  SendPushService.exit(userid, false);
}

// 发送
function send() {
  var name = document.getElementById('username').value;
  var message = document.getElementById('message');
  if (!message.value) {
    return false;
  }
  SendPushService.send(name, message.value);
  // 滚动条最下面
  msg_end.scrollIntoView();
  message.value = '';
  message.focus();
}

// 窗体加载
function init() {
  // 激活反转 重要
  dwr.engine.setActiveReverseAjax(true);
  // 当你打开界面的时候,先获得在线用户列表.
  SendPushService.init();
}
// 浏览器关闭或者刷新
window.onunload = exit;

window.onload = init;

// 监听回车事件
document.onkeydown = function KeyPress() {
  var key;
  var ie;
  var firefox;
  if (document.all) {
    // 判断是否IE
    ie = true;
  } else {
    ie = false;
  }
  if (ie) {
    // Ie使用event.keyCode获取键盘码
    key = event.keyCode;
  } else {
    // FireFox使用我们定义的键盘函数的arguments[0].keyCode来获取键盘码
    key = KeyPress.arguments[0].keyCode;
  }
  if (+key === 13) {
    // 调用发送方法
    send();
  }
};

(function () {
  var common = {
  $add: $('.s_create'),
  $exit: $('.s_exit'),
  $refresh: $('.s_refresh'),
  $siderbarBg: $('.siderbar-ul'),
  $li: $('.has-more'),
  $username: $('.username'),
  init: function () {
  this.bindEvent();
  this.initPage();
},
  initPage: function () {// 静态初始化页面
  var _this = this;
  this.$siderbarBg.height(screen.height);

			// 获取当前用户信息
  $.post('superAdminAction!getSuperAdmin.action', function (res) {
  if (res.code == 1) {
  _this.username = res.adminUserName;
  _this.$username.html('你好,' + _this.username + '!');
}
}, 'json');
},
  bindEvent: function () {
  var _this = this;
			// 刷新
  this.$refresh.click(function () {
  window.location.reload();
});

			// 退出
  this.$exit.click(function () {
  _this.exitSystem();
});

			// 新建管理员
  this.$add.click(function () {
  _this.createAdmin();
});
},
  exitSystem: function () {
  var _this = this;
  DIALOG.confirm('确定退出？', function () {
				// 注销管理员的session
  $.post('superAdminAction!superAdminSignout.action',
					function (res) {
  window.location.replace('../../../erpm/index.html');
});
});
},
  createAdmin: function () {
  if (!this.dialog) {
  this.createDialog();
}
  this.dialog.open();
},

  createDialog: function () {
  var _this = this;
  this.dialog = new DIALOG(
  {
    title: '新建管理员用户',
    content: '<div class="dialog-body" id="modifyPass-wrapper">'
								+ '<form class="wrapper" id = "modifyPass">'
								+ '<div class="input-div clear-fix">'
								+ '<label class="label-div"><span class="start">*</span>用户ID</label>'
								+ '<div class="label-input">'
								+ '<input type="text" id = "adminId" class="form-control" name = "adminId" data-validation="required"'
								+ ' data-validation-error-msg="请输入用户ID" />'
								+ '</div>'
								+ '</div>'
								+ '<div class="input-div clear-fix">'
								+ '<label class="label-div"><span class="start">*</span>姓名</label>'
								+ '<div class="label-input">'
								+ '<input type="text" name="adminName" class="form-control"'
								+ ' data-validation="required" data-validation-error-msg="请输入用户名"/>'
								+ '</div>'
								+ '</div>'
								+ '<div class="input-div clear-fix">'
								+ '<label class="label-div"><span class="start">*</span>密码</label>'
								+ '<div class="label-input">'
								+ '<input type="password" name="password" class="form-control"'
								+ 'data-validation-error-msg="请输入密码" data-validation="required"/>'
								+ '</div>'
								+ '</div>'
								+ '</form>'
								+ '<div class="dialog-footer">'
								+ '<button type="button" class="btn create">创建</button>'
								+ '<button type="button" class="btn cancel">取消</button>'
								+ '</div>' + '</div>',
    beforeClose: null,
    closeBtn: true,
    className: '',
    cache: true, // 是否缓存。若为false则close的时候会remove掉对话框对应的dom元素
    width: '500px' // 窗口宽度，默认为40%
  });
  $.validate();

  var form = $('#modifyPass');


  var wrapper = $('#modifyPass-wrapper');
  wrapper.find('.create').click(
					function () {
  var AdIdText = $('#adminId').val();
  var AdId = $('#adminId');
  var self = $(this);
  if (!BTN.isLoading(self) && form.isValid()) {
  BTN.addLoading(self, '创建中', 'loading');
  $.post('superAdminAction!isAdminIdExist.action',
								{'adminId': AdIdText}, function (res) {
  if (res.isAdminIdExist == false) {
  $.post('superAdminAction!addAdminUser.action', form
												.serialize(), function (res) {
  BTN.removeLoading(self, '创建');
  if (res.code == 1) {
  TIP('创建成功', 'success', 2000);
  _this.dialog.close();
  window.location.reload();
} else if (res.code == 0) {
  TIP('创建失败', 'error', 2000);
}
}, 'json');
} else{
  TIP('用户ID已存在', 'error', 2000);
  BTN.removeLoading(self, '重新创建');
  AdId.val('');
}
}, 'json');
}
});

			// 取消保存
  wrapper.find('.cancel').click(function (e) {
  e.preventDefault();
  _this.dialog.close();
});
}

};
  common.init();
})();

/** ***************************************自定义组件*********************************************** */
// 对话框
var DIALOG = null;

(function () {
	/**
	 * @Class Dialog
	 * @Desc 对话框模块 可以用j_dlg_close来标记关闭按钮 ui-dialog-bd代表容器主体，具有20px的margin
	 *       ui-dialog-btn代表btn的容器，具有20px的padding和灰色背景。这个容器里的所有.button类都有右边距15px
	 */
  function Dialog(options) {
  this._options = $.extend(true, {
  title: '',
  content: '',
  beforeClose: null,
  closeBtn: true,
  className: '',
  cache: true, // 是否缓存。若为false则close的时候会remove掉对话框对应的dom元素
  width: '40%' // 窗口宽度，默认为40%
}, options);

  this._init();
}

  $.extend(Dialog.prototype, {
  _init: function () {
  this._build();
  this._bindEvent();
},
		/**
		 * 创建对话框html
		 */
  _build: function () {
  var options = this._options;
  var style = 'width: ' + options.width;
  var html = '<div class="reveal-modal ui-dialog '
					+ options.className
					+ '" style="'
					+ style
					+ '">'
					+ (options.title ? '<div class="ui-dialog-tit yahei">'
							+ options.title + '</div>' : '');
  if (options.closeBtn) {
  html += '<a class="reveal-modal-close j_dlg_close">&#215;</a>'
						+ '</div>';
}
  this.$root = $(html).appendTo(document.body);
  this.$root.append($(options.content || ''));
  this.mask = $('<div class="reveal-modal-bg"></div>').appendTo(
					document.body);
},
  _bindEvent: function () {
  var _this = this;
  var options = this._options;
  this.$root.on(
					'click',
					'.j_dlg_close',
					function (e) {
  e.preventDefault();
						// beforeClose执行结果为false,说明关闭时间被阻止了
  if (options.beforeClose
								&& options.beforeClose.apply(_this) === false) {
  return false;
}
  _this.close();
  if (options.onclose) {
  options.onclose.apply(this);
}
}).on('click', '.j_dlg_ok', function () {

});
},
		/**
		 * 打开对话框
		 */
  open: function () {
  this.$root.css({
  'margin-left': -(this.$root.width() / 2)
});
  this.$root.animate({
  top: '100px'
}, 500);
  this.mask.show();
},
		/**
		 * 关闭对话框
		 */
  close: function () {
  this.$root.animate({
  top: '-1000px'
}, 500);
  if (this._options.cache === false) { // 设置不缓存
  this.$root.remove();
  this.mask.remove();
} else {
  this.mask.hide();
}
},
		/**
		 * 设置标题
		 */
  setTitle: function (title) {
  this.$root.find('.ui-dialog-tit').html(title);
},
		/**
		 * 设置内容
		 */
  setContent: function (content) {
  this.$root.find('.ui-dialog-bd').html(content);
}
});

  Dialog.confirm = function (message, ok, cancel) {
  var content = '<div class="ui-dialog-bd">' + message + '</div>';
  content += '<div class="dialog-footer"><button class="btn j_ok" href="#">确定</button><button class="btn j_cancel" href="#">取消</button></div>';
  var confirmDialog = new DIALOG({
  className: 'ui-dialog-confirm',
  width: '450px',
  content: content,
  cache: false,
  closeBtn: false
});
  confirmDialog.$root.on('click', '.btn', function (e) {
  e.preventDefault();
  var $target = $(this);
  if ($target.hasClass('j_ok')) {
  ok && ok.call(this);
} else {
  cancel && cancel.call(this);
}
  confirmDialog.close();
});
  confirmDialog.open();
};

  DIALOG = Dialog;
})();

// tip
/**
 * Created with JetBrains PhpStorm. Desc: tips提示 Author: limengjun Date: 14-8-19
 * Time: 上午11:01
 */
var TIP = null;
(function () {
  function Tips(options) {
  this.content = options.content;
  this.type = options.type;
  this.width = options.width;
  this._config = {
  iconFont: {
  'info': 'icon-info-circled',
  'error': 'icon-cancel-circled',
  'warning': 'icon-attention-circled',
  'success': 'icon-ok-circled'
},
  className: {
  'info': 'info',
  'error': 'error',
  'warning': 'warning',
  'success': 'success'
}
};
}
  Tips.prototype = {
  create: function () {
  var ctml = [];
  ctml = [ '<div class="alert-box alert-box-pop '
					+ this._config.className[this.type] + '">' ];
  ctml.push('<i class="' + this._config.iconFont[this.type]
					+ '"></i>');
  ctml.push(this.content);
  ctml.push('</div>');

  var objHtml = $(ctml.join(''));
  objHtml.appendTo(document.body);
  return objHtml;
},
  resetPosition: function (obj) {
  var width = obj.width();
  var height = obj.height();
  var scroll = $(window).height() / 2;
  obj.css({
  'margin-left': -width / 2 - 45 / 2,
  'top': -height / 2 + scroll + 15,
  position: 'fixed',
  left: '50%'
});
  obj.animate({
  top: -height / 2 + scroll
}, 400);
},
  hideClose: function (obj) {
  obj.remove();
}
};
	// 创建弹窗主体
	// 外部可以扩展
  TIP = function (content, type, timeout) {
  timeout = timeout || 2000;
  if (/^\s*$/.test(content) || !content)
  {return false;}
  var tip = new Tips({
  content: content,
  type: type || 'success',
  timeout: timeout
});
  tip.hideClose($('.tisp-' + type));
  var html = tip.create();
  tip.resetPosition(html);
  setTimeout(function () {
  tip.hideClose(html);
}, timeout);
};
})();
var BTN = null;
(function () {
  BTN = {
		/**
		 * addLoading form提交的时候给按钮加上laoding图标，更改按钮文字为提交状态，给$button打上正在提交的标签
		 *
		 * @param $button
		 *            提交按钮
		 * @param buttonContent
		 *            提交按钮的innerHTML（不包含图标）
		 * @param buttonIcon
		 *            提交按钮图标 如果不传此参数则没有提交按钮。 loading：菊花按钮(目前就只有菊花按钮)
		 */
  addLoading: function ($button, buttonContent, buttonIcon) {
  $button.data('isloading', true);

  buttonContent && ($button.html(buttonContent));

  if (buttonIcon) {
  var iconHtml = {
  'loading': '<i class="icon-spin5 animate-spin"></i>'
};
  if (iconHtml[buttonIcon]) {
  $(iconHtml[buttonIcon]).prependTo($button);
}
}
},

		/**
		 * removeLoading form提交后取消laoding图标，更改按钮文字为默认状态，取消$button正在提交的标签
		 *
		 * @param $button
		 *            提交按钮
		 * @param buttonContent
		 *            提交按钮的innerHTML（不包含图标）
		 * @param buttonIcon
		 *            提交按钮图标 如果不传此参数则没有提交按钮。 loading：菊花按钮(目前就只有菊花按钮)
		 */
  removeLoading: function ($button, buttonContent, buttonIcon) {
  $button.data('isloading', false);

  buttonContent && ($button.html(buttonContent));

  if (buttonIcon) {
  var iconHtml = {
  'loading': '<i class="icon-spin5 animate-spin"></i>'
};
  if (iconHtml[buttonIcon]) {
  $(iconHtml[buttonIcon]).prependTo($button);
}
}
},
		/**
		 * isLoading 是否正在提交中
		 *
		 * @param $button
		 *            提交的button
		 */
  isLoading: function ($button) {
  return $button.data('isloading');
}
};
})();

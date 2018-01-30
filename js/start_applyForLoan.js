function load(data) {
  $('.thirdTd:eq(0)').text(data.loanType); // 贷款类型
  $('.thirdTd:eq(1)').text(data.rate); // 年利率
  $('.loanP1').html(data.warning); // 红色警告信息
  $('#loanMoney').val(''); // 清空贷款金额的内容

  // 蓝色说明信息
  if (data.loanType === '长期贷款') {
    $('.loanP3').html('说明：企业每期偿还利息，在贷款到期后归还本金');
  } else if (data.loanType === '短期贷款') {
    $('.loanP3').html('说明：企业不需要每期支付利息，在贷款到期后一次性还本付息');
  } else {
    $('.loanP3').html('说明：企业每期偿还利息，在贷款到期后归还本金');
  }

  // 修改单位
  if (data.loanType == '长期贷款') {
    $('.unit').text('年');
  } else {
    $('.unit').text('期');
  }

  // 添加 option 选项，从 1 到 maxYear 或者 maxPeriod
  if (data.maxYear) {
    $('#selectPeriod').empty();
    for (var i = 2; i <= data.maxYear; i++) {
      $('#selectPeriod').append('<option>' + i + '</option>');
    }
  } else {
    $('#selectPeriod').empty();
    for (var i = 1; i <= data.maxPeriod; i++) {
      $('#selectPeriod').append('<option>' + i + '</option>');
    }
  }

	// 申请按钮是否可操作
  if (data.isAllow === false) {
    $('#applyBtn').attr('disabled', 'true').css('cursor', 'auto');
  } else {
    $('#applyBtn').removeAttr('disabled');
    $('#applyBtn').hover(function () {
      $(this).removeClass('btn').addClass('click');
    }, function () {
      $(this).removeClass('click').addClass('btn');
    });
  }

  window.maxMoney = data.maxMoney;
}

$(function () {
	// 进入页面初始化长期贷款信息
  $.post('loanAction!isAllowLoan.action?rnd=' + Math.random(), {
    'loanType': '长期贷款'
  }, load, 'json');

  $('#loanBtn').hover(function () {
    $(this).removeClass('btn').addClass('click');
  }, function () {
    $(this).removeClass('click').addClass('btn');
  });

	// 点击查询，加载信息
  $('#loanType').on('click', function () {
    var selected = $(this).val();

    $.post('loanAction!isAllowLoan.action?rnd=' + Math.random(), {
      'loanType': selected
    }, load, 'json');
  });

  $('#applyBtn').on('click', function () {
    var loanMoney = $('#loanMoney').val(); // 贷款金额
    var loanTime = $('#selectPeriod option:selected').text(); // 贷款期数
    var loanType = $('.thirdTd').eq(0).text(); // 贷款类型

    // 判断贷款金额是否合理，如果不合理就是 warning 处显示错误消息，如果合理就alert申请成功。
    if (maxMoney) {
      if (loanMoney <= 0 || loanMoney > maxMoney) {
        $('.loanP1').text('贷款金额不符合条件!');
      } else if (!(/^(\d)+$/.test(loanMoney))) {
        $('.loanP1').text('请输入整数!');
      } else {
        $.post('loanAction!applyLoan.action?rnd=' + Math.random(), {
          'loanType': loanType,
          'loanMoney': loanMoney,
          'loanTime': loanTime
        }, load, 'json');

        alert('贷款成功！\n申请到' + loanType + loanMoney + '万元，请在' + loanTime + '期之内还清');
      }
    } else if (loanMoney <= 0) {
      $('.loanP1').text('贷款金额不符合条件!');
    }	else if (isNaN(loanMoney)) {
      $('.loanP1').text('请输入数字!');
    } else {
      $.post('loanAction!applyLoan.action?rnd=' + Math.random(), {
        'loanType': loanType,
        'loanMoney': loanMoney,
        'loanTime': loanTime
      }, load, 'json');
      alert('贷款成功！\n申请到' + loanType + loanMoney + '万元，请在' + loanTime + '期之内还清');
    }
  });
});

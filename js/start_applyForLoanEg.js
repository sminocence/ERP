function load(data) {
  switch (data.loanType){
      case '长期贷款':
        data.loanType = 'Long term loan';break;
      case '短期贷款':
        data.loanType = 'Short-term loans';break;
      case '高利贷':
        data.loanType = 'usury';break;
  }

  var warning;
  switch (data.warning){
      case '贷款金额必须在0.0万 - 64.0万之间！\n贷款期限必须为5年之内！':
        warning = 'The loan amount must be between 0.0 million and 60.10 million ! \nThe loan term must less then 5 years'
          break;
      case '贷款金额必须在0.0万 - 104.0万之间！ \n贷款期限必须在4期之内！':
        warning = 'The loan amount must be between 0.0 million and 100.30 million ! \nThe loan term must less then 4 years'
        break;
      case '贷款金额必须大于0.0万！贷款期限必须在4期之内！':
        warning = 'The loan amount must be greater than 0.0 million ! The loan term must less then 4 years'
        break;
  }

  $('.thirdTd:eq(0)').text(data.loanType); // Type of loan
  $('.thirdTd:eq(1)').text(data.rate); // Annual interest rate
  $('.loanP1').html(warning); // Red warning message
  $('#loanMoney').val(''); // Clear the amount of the loan amount

  // Blue description information
  if (data.loanType === 'Long term loan') {
    $('.loanP3').html('Explanation: The enterprise repays the interest on an annual basis and repays the principal after the loan expires');
  } else if (data.loanType === 'Short-term loans') {
    $('.loanP3').html('Note: companies do not need to pay interest on each issue, after the loan expires one after another debt service');
  } else {
    $('.loanP3').html('Explanation: The enterprise repays the interest on an annual basis and repays the principal after the loan expires');
  }

  // Modify the unit
  if (data.loanType == 'Long term loan') {
    $('.unit').text('year');
  } else {
    $('.unit').text('period');
  }

  // add option，from 1 to maxYear or maxPeriod
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

	// Whether the application button is operational
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
	// Enter the page to initialize the long term loan information
  $.post('loanAction!isAllowLoan.action?rnd=' + Math.random(), {
    'loanType': '长期贷款'
  }, load, 'json');

  $('#loanBtn').hover(function () {
    $(this).removeClass('btn').addClass('click');
  }, function () {
    $(this).removeClass('click').addClass('btn');
  });

	// Click the query to load the message
  $('#loanType').on('click', function () {
    var selected = $(this).val();
    //把参数转化成中文请求参数
    var selected_java;
    switch (selected){
        case 'Long term loan':
          selected_java = '长期贷款';break;
        case 'Short-term loans':
          selected_java = '短期贷款';break;
        case 'usury':
          selected_java = '高利贷';break;
    }

    $.post('loanAction!isAllowLoan.action?rnd=' + Math.random(), {
      'loanType': selected_java
    }, load, 'json');
  });

  $('#applyBtn').on('click', function () {
    var loanMoney = $('#loanMoney').val(); // loan amount
    var loanTime = $('#selectPeriod option:selected').text(); // Number of loans
    var loanType = $('.thirdTd').eq(0).text(); // Type of loan

    var loanType_java;
    switch (loanType){
        case 'Long term loan':
            loanType_java = '长期贷款';break;
        case 'Short-term loans':
            loanType_java = '短期贷款';break;
        case 'usury':
            loanType_java = '高利贷';break;
    }

    // To determine whether the amount of the loan is reasonable, 
    // if it is unreasonable is the warning at the warning message, 
    // if a reasonable application for the success of the alert.
    if (maxMoney) {
      if (loanMoney <= 0 || loanMoney > maxMoney) {
        $('.loanP1').text('The loan amount does not meet the conditions!');
      } else if (!(/^(\d)+$/.test(loanMoney))) {
        $('.loanP1').text('Please enter an integer!');
      } else {
        $.post('loanAction!applyLoan.action?rnd=' + Math.random(), {
          'loanType': loanType_java,
          'loanMoney': loanMoney,
          'loanTime': loanTime
        }, load, 'json');

        alert('Loan success！\nApply to ' + loanType + ' '+ loanMoney + ' million, please ' + loanTime + ' period to pay off');
      }
    } else if (loanMoney <= 0) {
      $('.loanP1').text('The loan amount does not meet the conditions!');
    }	else if (isNaN(loanMoney)) {
      $('.loanP1').text('Please enter the number!');
    } else {
      $.post('loanAction!applyLoan.action?rnd=' + Math.random(), {
        'loanType': loanType_java,
        'loanMoney': loanMoney,
        'loanTime': loanTime
      }, load, 'json');
      alert('Loan success！\nApply to ' + loanType + ' '+  loanMoney + ' million, please ' + loanTime + ' period to pay off');
    }
  });
});

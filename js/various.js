/**
 * 各类市场管理
 */

$(function () {
  // 动态添加市场
  function addMarket(state, _market, Copy) {
    $(_market).empty();

    for (var i = 0; i < state.length; i++) {
      Copy.clone('true').appendTo(_market);
    }
  }

  // 加载已开拓市场的数据
  function ReadyMarket(data) {
    var _firstMarket = data.developedMarket;

    addMarket(_firstMarket, '.marketContent1', copy);
    readyOpenMarket.find('.market-bar').css('background', '#f2f2f1');

    readyOpenMarket.find('.market-bar').children('a').remove(); // 已开拓市场禁止再操作

    $(_firstMarket).each(function (i, items) {
      var ready = readyOpenMarket.find('.market-bar').eq(i);

      readyH2 = ready.find('ul h2');
      GetImg(items, i, readyOpenMarket);
      readyH2.eq(0).text(items.marketName);
      readyH2.eq(1).text(items.maintainCost);

      if (items.status === 1) {
        readyH2.eq(2).text('正在维护');
      } else if (items.status === 0) {
        readyH2.eq(2).text('暂停维护');
      } else {
        return false;
      }

      if (items.lastStatus === 1) {
        readyH2.eq(3).text('上期已维护');
      }	else if (items.lastStatus === 0) {
        readyH2.eq(3).text('尚未维护');
      }	else {
        return false;
      }
    });
  }

  // 开拓中市场用于加载数据的函数
  function OpenMarket(data) {
    var _secondMarket = data.developingMarket;

    addMarket(_secondMarket, '.marketContent2', copy1);

    $(_secondMarket).each(function (i, items) {
      var Open = openMarket.find('.market-bar').eq(i);
      GetImg(items, i, openMarket);
      Update(Open, items);
    });
  }

  // 加载未开拓市场的数据
  function NotOpenMarket(data) {
    var _thirdMarket = data.unDevelopMarket;

    addMarket(_thirdMarket, '.marketContent3', copy2);

    $(_thirdMarket).each(function (i, items) {
      var notOpenH2 = notOpenMarket.find('.market-bar').eq(i).find('ul h2');
      GetImg(items, i, notOpenMarket);
      notOpenH2.eq(0).text(items.marketName);
      notOpenH2.eq(1).text(items.researchPeriod);
      notOpenH2.eq(2).text(items.researchCost);
      notOpenH2.eq(3).text(items.maintainCost);
    });
  }

  // 根据市场类型插入不同的图片
  function GetImg(items, i, whichMarket) {
    var getImg = whichMarket.find('.market-bar').eq(i).find('img');

    if (items.marketName === '本地市场') {
      getImg.attr('src', '../../images/native_icon.gif');
    } else if (items.marketName === '区域市场') {
      getImg.attr('src', '../../images/region_icon.gif');
    }	else if (items.marketName === '国内市场') {
      getImg.attr('src', '../../images/china_icon.gif');
    }	else if (items.marketName === '国际市场') {
      getImg.attr('src', '../../images/internation_icon.gif');
    } else if (items.marketName === '亚洲市场') {
      getImg.attr('src', '../../images/asian_icon.gif');
    }	else {
      return false;
    }
  }

  // 开拓/暂停开拓
  function Submit(url, Data) {
    var marketName = Data.eq(0).text();

    $.post(url, {
      'marketName': marketName
    }, 'json');
  }

  // 更新未开拓市场数据
  function Update(Open, items) {
    var openHh2 = Open.find('ul h2');

    openHh2.eq(0).text(items.marketName);
    openHh2.eq(1).text(items.researchPeriod);
    openHh2.eq(2).text(items.researchCost);
    openHh2.eq(3).text(items.finishedPeriod);
    openHh2.eq(4).text(items.beginTime);

    if (items.status === 1) {
      openHh2.eq(5).text('正在开拓');
      Open.find('h2:last').text('暂停开拓');
    }	else if (items.status === 0) {
      openHh2.eq(5).text('暂停开拓');
      Open.find('h2:last').text('继续开拓');
    } else {
      return false;
    }
  }

  var readyOpenBtn = $('.readyOpenBtn'); // 已开拓市场下面的按钮
  var notOpenBtn = $('.notOpen'); // 未开拓市场下面的按钮
  var openBtn = $('.openBtn'); // 开拓中的市场的按钮
  var notOpenMarket = $('#notOpenMarket'); // 未开拓市场
  var openMarket = $('#openMarket'); // 开拓中市场
  var readyOpenMarket = $('#readyOpenMarket'); // 已开拓市场
  var copy1 = openMarket.find('.market-bar:eq(0)');
  var copy2 = notOpenMarket.find('.market-bar:eq(0)');
  var copy = readyOpenMarket.find('.market-bar:eq(0)');

  $.get('marketAction!getAnyMarket.action?rnd=' + Math.random(), function (data) {
    ReadyMarket(data);
    OpenMarket(data);
    NotOpenMarket(data);
  }, 'json');

  // 开拓按钮变色
  $(document).on({
    'mouseenter': function () {
      $(this).css('background', '#d1ba74');
      $(this).find('h2').animate({'fontSize': '20px'}, 50);
    },
    'mouseleave': function () {
      $(this).css('background', '#dbdad6');
      $(this).find('h2').animate({'fontSize': '18px'}, 50);
    }
  }, '.state');

  // 将未开拓市场变为开拓中的市场
  $(document).on('click', '.notOpen', function () {
    var _hhh2 = $(this).find('h2');
    var prevHhh2 = $(this).parent().parent().find('h2');
    var marketName = prevHhh2.eq(0).text();
    var removeMarket = $(this).parent().parent();
    var addMarket = copy1.clone('true');

    // 将未开拓市场加入到开拓中市场
    $.post('marketAction!startUndevelopMarketToDeveloping.action', {
      'marketName': marketName
    }, function (data) {
      removeMarket.remove();
      $('.marketContent2').append(addMarket);

      var reMarket = $('#openMarket .market-bar');
      var newNum = reMarket.length - 1;
      var newH2 = reMarket.eq(newNum);

      GetImg(data, newNum, openMarket);
      Update(newH2, data);
    }, 'json');
  });

  $(document).on('click', '.readyOpenBtn', function () {
    var _h2 = $(this).find('h2');
    var prevH2 = $(this).parent().parent().find('h2');

    if (_h2.text() === '暂停维护') {
      _h2.text('开始维护');
      prevH2.eq(2).text('暂停维护');
      Submit('marketAction!stopDevelopedMarket.action', prevH2);
    } else {
      _h2.text('暂停维护');
      prevH2.eq(2).text('正在维护');
      Submit('marketAction!startDevelopedMarket.action', prevH2);
    }
  });

  $(document).on('click', '.openBtn', function () {
    var _hh2 = $(this).find('h2');
    var prevHh2 = $(this).parent().parent().find('h2');

    if (_hh2.text() === '暂停开拓') {
      _hh2.text('继续开拓');
      prevHh2.eq(5).text('暂停开拓');
      Submit('marketAction!stopDevelopingMarket.action', prevHh2);
    } else {
      _hh2.text('暂停开拓');
      prevHh2.eq(5).text('继续开拓');
      Submit('marketAction!startDevelopingMarket.action', prevHh2);
    }
  });
});

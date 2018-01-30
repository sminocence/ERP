/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-3-18
 * Time: 下午3:06
 */

(function () {
  require.config({
    paths: {
      echarts: '../common/js'
    }
  });

  var assess = {
    $form: $('#chooseItem'),
    $form1: $('#chooseItem1'),
    $groupSelete: $('.selete-group'),
    $groupSelete1: $('.selete-group1'),
    $yearSelete1: $('.selete-year1'),
    $periodSelete1: $('.selete-period1'),
    $itemSelete: $('.selete-item'),
    $yearSelete: $('.selete-year'),
    $btn: $('.search1'),
    $btn1: $('.search2'),
    $chart: $('#chart'),
    $chart1: $('#chart1'),
    $tab: $('.tab'),
    $tabWrapper: $('.toggle-wrapper'),
    init: function () {
      this.renderPage();
      this.bindEvent();
    },
    bindEvent: function () {
      var _this = this;

            // 切换tab页面
      this.$tab.on('click', 'li', function () {
        _this.toggleTab($(this));
      });

      $(window).resize(function () {
        if (_this.chart) {
          _this.chart.resize();
        }
      });

      this.$groupSelete.change(function () {// 选择游戏组后，显示对应的年份
        _this.groupChange();
      });

      this.$groupSelete1.change(function () {// 选择游戏组后，显示对应的年份
        _this.groupChange1();
      });

      this.$btn.click(function () {
        _this.submitForm();
      });

      this.$btn1.click(function () {
        _this.submitForm1();
      });
    },
    renderPage: function () {
      var _this = this;
      $.get('enterpriseEvaluateAction!showGroupMembers.action', function (res) {// /EnterpriseEvaluateAction!showGroupMembers.action
        _this.groupmap = {};
        _this.analysismap = {};
        if (res.code == 0) {
          var groupOpt;
          $(res.allGroupMembers).each(function (index, item) {
            groupOpt += '<option value="' + item.groupNames + '">' + item.groupNames + '</option>';
            _this.groupmap[item.groupNames] = {
              name: item.groupNames,
              num: item.year
            };
            if (item.members.length > 0) {
              _this.groupmap[item.groupNames].members = new Array();
              $(item.members).each(function (index) {
                _this.groupmap[item.groupNames].members.push({
                    userunique: item.members[index].userunique,
                    userID: item.members[index].userID
                  });
              });
            }else {
              _this.groupmap[item.groupNames].members = [];
            }
          });
          _this.$groupSelete.append(groupOpt);
        }
      }, 'json');

      $.get('gameGroupManagerAction!showGameGroups.action', function (res) {// /GameGroupManagerAction!showGameGroups.action
        _this.groupmap1 = {};
        if (res.code == 0) {
          var groupOpt;
          $(res.GameGroups).each(function (index, item) {
            groupOpt += '<option value="' + item.groupName + '">' + item.groupName + '</option>';
            _this.groupmap1[item.groupName] = {
              name: item.groupName,
              num: item.years,
              period: item.periodsOfOneYear
            };
          });
          _this.$groupSelete1.append(groupOpt);
        }
      }, 'json');
    },
    toggleTab: function (the) {
      var index = the.index();
      this.$tab.find('li').removeClass('active');
      the.addClass('active');
      var w = $('.toggle-div').width();
      var mleft = -(w * index);
      this.$tabWrapper.animate({
        marginLeft: mleft
      }, 500);
    },
    groupChange: function () {
      var _this = this;
      var selete = this.$groupSelete;
      var value = selete.val();
      if (value == 'null') {
        return;
      }
      var sum = this.groupmap[value].num;
      var yearOpt = ' <option value="null">请选择年份</option>';
      var itemOpt = '<option value="null">请选择小组</option>';
      for (var i = 1; i <= sum; i++) {
        yearOpt += '<option value="' + i + '">第' + i + '年</option>';
      }
      for (var i = 0; i < _this.groupmap[value].members.length; i++) {
        itemOpt += '<option value="' + this.groupmap[value].members[i].userunique + '">' + this.groupmap[value].members[i].userID + '</option>';
      }
      this.$yearSelete.html(yearOpt);
      this.$itemSelete.html(itemOpt);
    },
    groupChange1: function () {
      var selete = this.$groupSelete1;
      var value = selete.val();
      if (value == 'null') {
        return;
      }
      var sum = this.groupmap1[value].num;
      var yearOpt = ' <option value="null">请选择年份</option>';
      for (var i = 1; i <= sum; i++) {
        yearOpt += '<option value="' + i + '">第' + i + '年</option>';
      }
      this.$yearSelete1.html(yearOpt);

      var peroid = Number(this.groupmap1[value].period);
      var peroidOpt = '<option value="null">请选择周期</option>';
      for (var i = 1; i <= peroid; i++) {
        peroidOpt += '<option value="' + i + '">第' + i + '周期</option>';
      }
      this.$periodSelete1.html(peroidOpt);
    },
    submitForm: function () {
      var _this = this;
      var group = this.$groupSelete.val();
      var year = this.$yearSelete.val();
      var userunique = this.$itemSelete.val();

      if (group != 'null' && year != 'null' && userunique != 'null') {
        var data = {
          groupName: group,
          year: year,
          userunique: userunique
        };
        if (!_this.chart) {
          _this.createChart();
        }else {
          _this.chart.clear();
        }
        $.post('enterpriseEvaluateAction!showEndValue.action', data, function (res) {// /EnterpriseEvaluateAction!showEndValue.action
          if (res.code == 0) {
            var data = res.endValues;
            if (data.length > 0) {
              _this.renderChart(data);
            } else{
              _this.$chart.height('auto');
              _this.$chart.html('<p style="text-align: center;margin-top: 40px">暂无数据</p>');
            }
          }
        }, 'json');
      }else {
        var info = '';
        if (group == 'null') {
          info += '游戏组、';
        }
        if (userunique == 'null') {
          info += '查询的小组、';
        }
        if (year == 'null') {
          info += '查询的年份、';
        }

        info = info.substring(0, info.length - 1);
        TIP('请选择' + info + '!', 'warning', 2000);
      }
    },
    submitForm1: function () {
      var _this = this;
      var group = this.$groupSelete1.val();
      var year = this.$yearSelete1.val();
      var period = this.$periodSelete1.val();
      if (group != 'null' && year != 'null' && period != 'null') {
        var data = {
          groupName: group,
          year: year,
          period: period
        };
        if (!_this.chart1) {
          _this.createChart();
        } else{
          _this.chart1.clear();
        }
        $.post('enterpriseEvaluateAction!showEndValues.action', data, function (res) {// /enterpriseEvaluateAction!showEndValues.action
          if (res.code == 0) {
            var data = res.endValues;
            if (data.length > 0) {
              _this.renderChart1(data);
            }else {
              _this.$chart.height('auto');
              _this.$chart.html('<p style="text-align: center;margin-top: 40px">暂无数据</p>');
            }
          }
        }, 'json');
      } else{
        var info = '';
        if (group == 'null') {
          info += '游戏组、';
        }
        if (year == 'null') {
          info += '查询的年份、';
        }
        if (period == 'null') {
          info += '查询周期、';
        }
        info = info.substring(0, info.length - 1);
        TIP('请选择' + info + '!', 'warning', 2000);
      }
    },
    createChart: function () {
      var _this = this;
      require(
        [
          'echarts',
          'echarts/chart/line',   // 按需加载所需图表，如需动态类型切换功能，别忘了同时加载相应图表
          'echarts/chart/bar'
        ],
                function (ec) {
                  _this.$chart.height(500);
                  _this.$chart1.height(500);
                  _this.chart = ec.init(document.getElementById('chart'));
                  _this.chart1 = ec.init(document.getElementById('chart1'));
                  _this.option = {
                    title: {
                      text: '所有者权益',
                      subtext: ''
                    },
                    tooltip: {
                      trigger: 'axis'
                    },
                    toolbox: {
                      show: true,
                      feature: {
                        mark: {show: true},
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                      }
                    },
                    calculable: false,
                    xAxis: [
                      {
                        type: 'category',
                        data: []
                      }
                    ],
                    yAxis: [
                      {
                        type: 'value',
                        axisLabel: {
                          formatter: '{value}'
                        }
                      }
                    ],
                    series: [{
                      name: '',
                      type: 'bar',
                      data: []
                    }]
                  };
                }
            );
    },
    renderChart: function (data) {
      var _this = this;
      _this.$chart.height(500);
      var group = this.$groupSelete.val();
      var year = this.$yearSelete.val();
      this.option.subtext = '游戏组：' + _this.groupmap[group].name + ' 第' + year + '年';
      var xAxis =  new Array();
      var series =  new Array();
      $(data).each(function (index, item) {
        xAxis.push('第' + item.currentPeriod + '期');
        series.push(item.ownerBenifit);
      });
      this.option.xAxis[0].data = xAxis;
      this.option.series[0].data = series;
      this.chart.setOption(this.option);
    },
    renderChart1: function (data) {
      var _this = this;
      _this.$chart1.height(500);
      var group = this.$groupSelete1.val();
      var year = this.$yearSelete1.val();
      this.option.subtext = '游戏组：' + _this.groupmap1[group].name + ' 第' + year + '年';
      var xAxis =  new Array();
      var series =  new Array();
      $(data).each(function (index, item) {
        xAxis.push(item.userId);
        series.push(item.ownerBenifit);
      });
      this.option.xAxis[0].data = xAxis;
      this.option.series[0].data = series;
      this.chart1.setOption(this.option);
    }
  };

  assess.init();
})();

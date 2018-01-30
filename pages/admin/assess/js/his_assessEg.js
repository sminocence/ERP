/**
 * 查看历史数据模块
 * Author: chenjiajun, Mars Wong
 * Date: 15-3-18, 16-11-27
 * Time: 下午3:06
 */
$(function () {
  require.config({
    paths: {
      echarts: '../common/js'
    }
  });

  var assess = {
    $form: $('#chooseItem'),
    $typeSelected: $('.search-type'), // 选中的查看方式
    $groupSelected: $('.selete-group'), // 选中的分组
    $yearSelected: $('.selete-year'), // 选中的年份
    $itemSelected: $('.selete-item'), // 选中的分析模块
    $groupItemSelected: $('.selete-groupitem'), // 选中的企业
    $periodSelected: $('.search-period'), // 选中的周期
    $btn: $('.search'),
    $chart: $('#chart'),
    init: function () {
      this.renderPage();
      this.bindEvent();

      this.$typeSelected.addClass('hide').parent().hide();
      this.$periodSelected.addClass('hide').parent().hide();

      this.analysismap = {
        1: 'Advertising input - output analysis',
        2: 'Analysis of Comprehensive Market Share',
        3: 'Product market share analysis',
        4: 'Costs Proportion of Sales',
        5: 'Cost Analysis of Sales Cost Proportion',
        6: 'Product Contribution Profit Analysis',
        7: 'Production capacity analysis',
        8: 'Owners‘ equity'
      };
    },
    bindEvent: function () {
      var _this = this;

      $(window).resize(function () {
        if (_this.chart) {
          _this.chart.resize();
        }
      });

      this.$typeSelected.change(function () {
        _this.typeChange();
      });

      this.$groupSelected.change(function () {
        _this.groupChange();
      });

      this.$yearSelected.change(function () {
        _this.yearChange();
      });

      this.$itemSelected.change(function () {
        _this.itemChange();
      });

      this.$btn.click(function () {
        _this.submitForm();
      });
    },
    renderPage: function () {
      var _this = this;

      $.ajax({
        url: 'historyAction!showGroupMembers.action',
        method: 'get',
        dataType: 'json' 
      }).done(function (res) {
        _this.groupmap = {};

        if (res.code === 0) {
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
            } else {
              _this.groupmap[item.groupNames].members = [];
            }
          });

          _this.$groupSelected.append(groupOpt);
        }
      });

      // $.get('historyAction!showGroupMembers.action', function (res) {
      //   _this.groupmap = {};

      //   if (res.code === 0) {
      //     var groupOpt;

      //     $(res.allGroupMembers).each(function (index, item) {
      //       groupOpt += '<option value="' + item.groupNames + '">' + item.groupNames + '</option>';

      //       _this.groupmap[item.groupNames] = {
      //         name: item.groupNames,
      //         num: item.year
      //       };

      //       if (item.members.length > 0) {
      //         _this.groupmap[item.groupNames].members = new Array();
      //         $(item.members).each(function (index) {
      //           _this.groupmap[item.groupNames].members.push({
      //             userunique: item.members[index].userunique,
      //             userID: item.members[index].userID
      //           });
      //         });
      //       } else {
      //         _this.groupmap[item.groupNames].members = [];
      //       }
      //     });

      //     _this.$groupSelected.append(groupOpt);
      //   }
      // }, 'json');
    },
    typeChange: function () {
      var select = this.$typeSelected;
      var value = select.val();

      if (value === 'null') {
        return;
      } else if (value === 'View by business') {
        this.$periodSelected.addClass('hide').parent().hide();
        this.$groupItemSelected.removeClass('hide').parent().show();
      } else {
        this.$groupItemSelected.addClass('hide').parent().hide();
        this.$periodSelected.removeClass('hide').parent().show();
      }
    },
    groupChange: function () {
      var select = this.$groupSelected;
      var value = select.val();

      if (value === 'null') {
        return;
      }

      var sum = this.groupmap[value].num;
      var items = this.groupmap[value].members;

      if (sum >= 1) {
        var yearOpt = '<option value="null">Please select the year</option>';

        for (var i = 1; i <= sum; i++) {
          yearOpt += '<option value="' + i + '">number' + i + 'year</option>';
        }

        this.$yearSelected.html(yearOpt);
      } else {
        this.$yearSelected.html('<option value="hasnot">no data available</option>');
      }

      if (items.length > 0) {
        var itemOpt = '<option value="null">Please choose your business</option>';

        for (var i = 0; i < items.length; i++) {
          itemOpt += '<option value="' + items[i].userunique + '">' + items[i].userID + '</option>';
        }

        this.$groupItemSelected.html(itemOpt);
      } else {
        this.$groupItemSelected.html('<option value="hasnot">no data available</option>');
      }
    },
    yearChange: function () {
      var select = this.$typeSelected;
      var value = select.val();

      if (value === 'View by group') {
        var groupSelected = this.$groupSelected.val();

        $.get('historyAction!showGroupMembers.action', function (res) {
          // 获取周期数
          if (res.code === 0) {
            $(res.allGroupMembers).each(function (index, item) {
              if (item.groupNames === groupSelected) {
                var period = item.periodOfYears;
                var periodOpt;

                for (var i = 1; i <= period; i++) {
                  periodOpt += '<option value="' + i + '">num' + i + 'period</option>';
                }

                $('.search-period').append(periodOpt);
              }
            });
          }
        }, 'json');
      }
    },
    itemChange: function () {
      var select = this.$itemSelected;
      var value = Number(select.val());

      if (value === 'null') {
        return;
      }

      switch (value) {
      case 5: {
        this.$yearSelected.addClass('hide').parent().hide();
        this.$groupItemSelected.removeClass('hide').parent().show();
        break;
      }
      case 6: {
        this.$yearSelected.removeClass('hide').parent().show();
        this.$groupItemSelected.removeClass('hide').parent().show();
        break;
      }
      case 7: {
        this.$yearSelected.addClass('hide').parent().hide();
        this.$groupItemSelected.addClass('hide').parent().hide();
        break;
      }
      case 8: {
        this.$typeSelected.removeClass('hide').parent().show();
        this.$yearSelected.removeClass('hide').parent().show();
        this.$periodSelected.removeClass('hide').parent().show();
        break;
      }
      default:
        this.$yearSelected.removeClass('hide').parent().show();
        this.$groupItemSelected.addClass('hide').parent().hide();
        this.$typeSelected.addClass('hide').parent().hide();
        this.$periodSelected.addClass('hide').parent().hide();
        break;
      }
    },
    submitForm: function () {
      var _this = this;
      var selects = $('.select-wrapper').find('select');
      var mark = 0;

      for (var i = 0; i < selects.length; i++) {
        if (selects[i].value === 'null' && !$(selects[i]).hasClass('hide')) {
          mark = 1;
        }
      }

      if (mark === 0) {
        var item = Number(this.$itemSelected.val());
        var type = this.$typeSelected.val();

        if (!_this.chart) {
          (type !== 'null') ? _this.createChart1() : _this.createChart();
        } else {
          _this.chart.clear();
        }

        switch (item) {
        case 1: {
          _this.renderORatesOfAd();// 广告投入产出分析
          break;
        }
        case 2: {
          _this.renderMarketShare();// 综合市场占有率分析
          break;
        }
        case 3: {
          _this.renderProductMarketShare();// 产品市场占有率分析
          break;
        }
        case 4: {
          _this.renderCostStructure();// 成本费用占销售比例分析
          break;
        }
        case 5: {
          _this.renderStructureChanges();// 成本费用占销售比例变化分析
          break;
        }
        case 6: {
          _this.renderProductsProfit();// 产品贡献利润分析
          break;
        }
        case 7: {
          _this.renderMembersCapacity();// 生产能力分析
          break;
        }
        case 8: {
          _this.renderOwnerEquities(); // 所有者权益
          break;
        }
        default:
          break;
        }
      } else {
        TIP('Please select the necessary conditions for the inquiry!', 'warning', 2000);
      }
    },
    renderOwnerEquities: function () {
      if (this.$typeSelected.val() === 'View by business') {
        var _this = this;
        var group = this.$groupSelected.val();
        var year = this.$yearSelected.val();
        var userunique = this.$groupItemSelected.val();

        if (group !== 'null' && year !== 'null' && userunique !== 'null') {
          var data = {
            groupName: group,
            year: year,
            userunique: userunique
          };

          if (!_this.chart) {
            _this.createChart1();
          } else {
            _this.chart.clear();
          }

          $.post('historyAction!showEndValue.action', data, function (res) {
            if (res.code === 0) {
              var data = res.endValues;

              if (data.length > 0) {
                _this.renderChartOfEquity(data);
              } else {
                _this.$chart.height('auto');
                _this.$chart.html('<p style="text-align: center;margin-top: 40px">no data available</p>');
              }
            }
          }, 'json');
        } else {
          var info = '';

          if (group === 'null') {
            info += 'Grouping、';
          }

          if (userunique === 'null') {
            info += 'Query the business、';
          }

          if (year === 'null') {
            info += 'The year of the query、';
          }

          info = info.substring(0, info.length - 1);

          TIP('Please select' + info + '!', 'warning', 2000);
        }
      } else {
        var _this = this;
        var group = this.$groupSelected.val();
        var year = this.$yearSelected.val();
        var period = this.$periodSelected.val();

        if (group !== 'null' && year !== 'null' && period !== 'null') {
          var data = {
            groupName: group,
            year: year,
            period: period
          };

          if (!_this.chart) {
            _this.createChart1();
          } else {
            _this.chart.clear();
          }

          $.post('historyAction!showEndValues.action', data, function (res) {
            if (res.code === 0) {
              var data = res.endValues;

              if (data.length > 0) {
                _this.renderChartOfEquity1(data);
              } else {
                _this.$chart.height('auto');
                _this.$chart.html('<p style="text-align: center;margin-top: 40px">no data available</p>');
              }
            }
          }, 'json');
        } else {
          var info = '';

          if (group === 'null') {
            info += 'grouping、';
          }

          if (year === 'null') {
            info += 'The year of the query、';
          }

          if (period === 'null') {
            info += 'The cycler of the query、';
          }

          info = info.substring(0, info.length - 1);
          TIP('Please select' + info + '!', 'warning', 2000);
        }
      }
    },
    renderORatesOfAd: function () {// 广告投入产出分析
      var _this = this;
      var group = this.$groupSelected.val();
      var year = this.$yearSelected.val();
      var data = {
        groupName: group,
        year: year
      };
      $.post('historyAction!getUserIORatesOfAd.action', data, function (res) {// /EnterpriseEvaluateAction!getUserIORatesOfAd.action
        if (res.code == 0) {
          var data = res.userIORates;
          if (data.length > 0) {
            var x = new Array(), xdata = new Array();
            $(data).each(function (index, item) {
              x[index] = item.username;
              xdata[index] = item.rate;
            });
            _this.option.xAxis[0].data = x;
            _this.option.legend.data = [];// 清空上一次图例数据
            _this.option.series = [{
              name: '',
              type: 'line',
              data: xdata
            }];
            _this.renderChart();
          } else {
            _this.$chart.height('auto');
            _this.$chart.html('<p style="text-align: center;margin-top: 40px">no data available</p>');
          }
        }
      }, 'json');
    },
    renderMarketShare: function () {// 综合市场占有率分析
      var _this = this;
      var group = this.$groupSelected.val();
      var year = this.$yearSelected.val();
      var data = {
        groupName: group,
        year: year
      };
      $.post('historyAction!getGeneralMarketShare.action', data, function (res) {// /EnterpriseEvaluateAction!getGeneralMarketShare.action
        if (res.code == 0) {
          var data = res.memberSaleOfMarkets;
          var members = {};
          var markets = {};
          var marketsName = new Array();
          var membersName = new Array();
          if (data.length > 0) {
            $(data).each(function (index, item) {
              if (!markets[item.marketname]) {
                markets[item.marketname] = new Array();
                marketsName.push(item.marketname);
              }
              markets[item.marketname].push({
                username: item.member.userName,
                sale: item.sale
              });

              if (!members[item.member.userName]) {
                members[item.member.userName] = new Array();
                membersName.push(item.member.userName);
              }
              members[item.member.userName].push({
                marketname: item.marketname,
                sale: item.sale
              });
            });
            _this.option.xAxis[0].data = membersName;
            _this.option.legend.data = marketsName;// 清空上一次图例数据
            var series = new Array();
            for (var i in markets) {
              var sales = new Array();
              for (var j in markets[i])                            {
                sales.push(markets[i][j].sale);
              }
              series.push({
                name: i,
                type: 'line',
                data: sales
              });
            }
            _this.option.series = series;
            _this.renderChart();
          } else {
            _this.$chart.height('auto');
            _this.$chart.html('<p style="text-align: center;margin-top: 40px">no data available</p>');
          }
        }
      }, 'json');
    },
    renderProductMarketShare: function () {// 产品市场占有率分析
      var _this = this;
      var group = this.$groupSelected.val();
      var year = this.$yearSelected.val();
      var data = {
        groupName: group,
        year: year
      };
      $.post('historyAction!getProductMarketShare.action', data, function (res) {// /EnterpriseEvaluateAction!getProductMarketShare.action
        if (res.code == 0) {
          var data = res.memberSaleOfProducts;
          if (data.length > 0) {
            var members = {};
            var products = {};
            var productsName = new Array();
            var membersName = new Array();
            $(data).each(function (index, item) {
              if (!products[item.productName]) {
                products[item.productName] = new Array();
                productsName.push(item.productName);
              }
              products[item.productName].push({
                username: item.member.userName,
                sale: item.sale
              });

              if (!members[item.member.userName]) {
                members[item.member.userName] = new Array();
                membersName.push(item.member.userName);
              }
              members[item.member.userName].push({
                marketname: item.productName,
                sale: item.sale
              });
            });
            _this.option.xAxis[0].data = membersName;
            _this.option.legend.data = productsName;// 清空上一次图例数据
            var series = new Array();
            for (var i in products) {
              var sales = new Array();
              for (var j in products[i])                            {
                sales.push(products[i][j].sale);
              }
              series.push({
                name: i,
                type: 'line',
                data: sales
              });
            }
            _this.option.series = series;
            _this.renderChart();
          } else {
            _this.$chart.height('auto');
            _this.$chart.html('<p style="text-align: center;margin-top: 40px">no data available</p>');
          }
        }
      }, 'json');
    },
    renderCostStructure: function () {// 成本费用占销售比例分析
      var _this = this;
      var group = this.$groupSelected.val();
      var year = this.$yearSelected.val();
      var data = {
        groupName: group,
        year: year
      };
      $.post('historyAction!getCostStructure.action', data, function (res) {// /
        if (res.code == 0) {
          var data = res.memberCosts;
          if (data.length > 0) {
            var adCost = new Array();// 广告费
            var depCost = new Array();// 折旧成本
            var interestCost = new Array();// 利息
            var managementCost = new Array();// 管理费用
            var operationCost = new Array();// 经营费
            var productCost = new Array();// 直接成本
            var member = new Array();
            $(data).each(function (index, item) {
              if (item.totalSale != 0) {
                adCost.push((item.adCost / item.totalSale).toFixed(4));
                depCost.push((item.depreciationCost / item.totalSale).toFixed(4));
                interestCost.push((item.interestCost / item.totalSale).toFixed(4));
                managementCost.push((item.managementCost / item.totalSale).toFixed(4));
                operationCost.push((item.operationCost / item.totalSale).toFixed(4));
                productCost.push((item.productCost / item.totalSale).toFixed(4));
                member.push(item.member.userName);
              } else {
                adCost.push(0);
                depCost.push(0);
                interestCost.push(0);
                managementCost.push(0);
                operationCost.push(0);
                productCost.push(0);
                member.push(item.member.userName);
              }
            });
            _this.option.xAxis[0].data = member;
            _this.option.legend.data = ['direct cost', 'ad', 'Operating expenses', 'management fee', 'depreciation', 'interest'];
            _this.option.series = [{
              name: 'direct cost',
              type: 'bar',
              stack: 'cost',
              data: productCost
            }, {
              name: 'ad',
              type: 'bar',
              stack: 'cost',
              data: adCost
            }, {
              name: 'Operating expenses',
              type: 'bar',
              stack: 'cost',
              data: operationCost
            }, {
              name: 'management fee',
              type: 'bar',
              stack: 'cost',
              data: managementCost
            }, {
              name: 'depreciation',
              type: 'bar',
              stack: 'cost',
              data: depCost
            }, {
              name: 'interest',
              type: 'bar',
              stack: 'cost',
              data: interestCost
            }];
            _this.renderChart();
          } else {
            _this.$chart.height('auto');
            _this.$chart.html('<p style="text-align: center;margin-top: 40px">no data available</p>');
          }
        }
      }, 'json');
    },
    renderStructureChanges: function () {// 成本费用占销售比例变化分析
      var _this = this;
      var group = this.$groupSelected.val();
      var userunique = this.$groupItemSelected.val();
      var data = {
        groupName: group,
        userunique: userunique
      };
      $.post('historyAction!getCostStructureChanges.action', data, function (res) {// /EnterpriseEvaluateAction!getCostStructureChanges.action
        if (res.code == 0) {
          var data = res.memberCosts;
          if (data.length > 0) {
            var adCost = new Array();// 广告费
            var depCost = new Array();// 折旧成本
            var interestCost = new Array();// 利息
            var managementCost = new Array();// 管理费用
            var operationCost = new Array();// 经营费
            var productCost = new Array();// 直接成本
            var year = new Array();
            $(data).each(function (index, item) {
              if (item.totalSale != 0) {
                adCost.push((item.adCost / item.totalSale).toFixed(4));
                depCost.push((item.depreciationCost / item.totalSale).toFixed(4));
                interestCost.push((item.interestCost / item.totalSale).toFixed(4));
                managementCost.push((item.managementCost / item.totalSale).toFixed(4));
                operationCost.push((item.operationCost / item.totalSale).toFixed(4));
                productCost.push((item.productCost / item.totalSale).toFixed(4));
                year.push(item.year);
              } else {
                adCost.push(0);
                depCost.push(0);
                interestCost.push(0);
                managementCost.push(0);
                operationCost.push(0);
                productCost.push(0);
                year.push(item.year);
              }
            });
            _this.option.xAxis[0].data = year;
            _this.option.legend.data = ['direct cost', 'ad', 'Operating expenses', 'management fee', 'depreciation', 'interest'];
            _this.option.series = [{
              name: 'direct cost',
              type: 'bar',
              stack: 'cost',
              data: productCost
            }, {
              name: 'ad',
              type: 'bar',
              stack: 'cost',
              data: adCost
            }, {
              name: 'Operating expenses',
              type: 'bar',
              stack: 'cost',
              data: operationCost
            }, {
              name: 'management fee',
              type: 'bar',
              stack: 'cost',
              data: managementCost
            }, {
              name: 'depreciation',
              type: 'bar',
              stack: 'cost',
              data: depCost
            }, {
              name: 'interest',
              type: 'bar',
              stack: 'cost',
              data: interestCost
            }];
            _this.renderChart();
          } else {
            _this.$chart.height('auto');
            _this.$chart.html('<p style="text-align: center;margin-top: 40px">no data available</p>');
          }
        }
      }, 'json');
    },
    renderProductsProfit: function () {// 产品贡献利润分析
      var _this = this;
      var group = this.$groupSelected.val();
      var year = this.$yearSelected.val();
      var userunique = this.$groupItemSelected.val();
      var data = {
        groupName: group,
        year: year,
        userunique: userunique
      };
      $.post('historyAction!getProductsProfit.action', data, function (res) {
        if (res.code == 0) {
          var data = res.productProfits;
          if (data.length > 0) {
            var x = new Array(), xdata = new Array();
            $(data).each(function (index, item) {
              x[index] = item.productname;
              xdata[index] = item.sale - item.price - item.cost;
            });
            _this.option.xAxis[0].data = x;
            _this.option.legend.data = [];// 清空上一次图例数据
            _this.option.series = [{
              name: '',
              type: 'bar',
              data: xdata
            }];
            _this.renderChart();
          } else {
            _this.$chart.height('auto');
            _this.$chart.html('<p style="text-align: center;margin-top: 40px">no data available</p>');
          }
        }
      }, 'json');
    },
    renderMembersCapacity: function () {// 生产能力分析
      var _this = this;
      var group = this.$groupSelected.val();
      var data = {
        groupName: group
      };
      $.post('historyAction!getMembersCapacity.action', data, function (res) {// /EnterpriseEvaluateAction! getMembersCapacity.action
        if (res.code == 0) {
          var data = res.produceCapacities;
          if (data.length > 0) {
            var x = new Array(), xdata = new Array();
            $(data).each(function (index, item) {
              x[index] = item.member.userName;
              xdata[index] = item.capacity;
            });
            _this.option.xAxis[0].data = x;
            _this.option.legend.data = [];// 清空上一次图例数据
            _this.option.series = [{
              name: '',
              type: 'bar',
              data: xdata
            }];
            _this.renderChart();
          } else {
            _this.$chart.height('auto');
            _this.$chart.html('<p style="text-align: center;margin-top: 40px">no data available</p>');
          }
        }
      }, 'json');
    },
    createChart: function () {
      var _this = this;
      require([
        'echarts',
        'echarts/chart/line',   // 按需加载所需图表，如需动态类型切换功能，别忘了同时加载相应图表
        'echarts/chart/bar'
      ], function (ec) {
        _this.$chart.height(500);
        _this.chart = ec.init(document.getElementById('chart'));
        _this.option = {
          title: {
            text: '',
            subtext: ''
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: []
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
          calculable: true,
          xAxis: [{
            type: 'category',
            data: []
          }],
          yAxis: [{
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            }
          }],
          series: [{
            name: '',
            type: 'line',
            data: []
          }]
        };
      });
    },
    createChart1: function () {
      var _this = this;
      require([
        'echarts',
        'echarts/chart/line',   // 按需加载所需图表，如需动态类型切换功能，别忘了同时加载相应图表
        'echarts/chart/bar'
      ], function (ec) {
        _this.$chart.height(500);
        _this.chart = ec.init(document.getElementById('chart'));
        _this.option = {
          title: {
            text: 'Owners’ equity',
            subtext: ''
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: []
          },
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ['line', 'bar'] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          calculable: false,
          xAxis: [{
            type: 'category',
            data: []
          }],
          yAxis: [{
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            }
          }],
          series: [{
            name: '',
            type: 'bar',
            data: []
          }]
        };
      });
    },
    renderChart: function () {
      var _this = this;
      _this.$chart.height(500);
      var item = this.$itemSelected.val();
      var group = this.$groupSelected.val();
      if (item != 7 && item != 5) {
        var year = this.$yearSelected.val();
        this.option.title.text = _this.analysismap[item];
        this.option.title.subtext = 'Game group：' + _this.groupmap[group].name;
        this.chart.setOption(this.option);
      } else {
        this.option.title.text = _this.analysismap[item];
        this.option.title.subtext = 'Game group：' + _this.groupmap[group].name;
        this.chart.setOption(this.option);
      }
    },
    renderChartOfEquity: function (data) {
      var _this = this;
      _this.$chart.height(500);

      var group = this.$groupSelected.val();
      var year = this.$yearSelected.val();

      this.option.subtext = 'grouping：' + _this.groupmap[group].name + ' num' + year + 'year';

      var xAxis =  new Array();
      var series =  new Array();

      $(data).each(function (index, item) {
        xAxis.push('num' + (index + 1) + 'year');
        series.push(item.ownerBenifit);
      });

      this.option.xAxis[0].data = xAxis;
      this.option.series[0].data = series;
      this.option.legend.data = []; // 清空上一次图例数据
      this.chart.setOption(this.option);
    },
    renderChartOfEquity1: function (data) {
      var _this = this;
      _this.$chart.height(500);

      var group = this.$groupSelected.val();
      var year = this.$yearSelected.val();

      this.option.subtext = 'grouping：' + _this.groupmap[group].name + ' num' + year + 'year';

      var xAxis =  new Array();
      var series =  new Array();

      $(data).each(function (index, item) {
        xAxis.push(item.userName);
        series.push(item.ownerBenifit);
      });

      this.option.xAxis[0].data = xAxis;
      this.option.series[0].data = series;
      this.option.legend.data = []; // 清空上一次图例数据
      this.chart.setOption(this.option);
    }
  };

  assess.init();
});

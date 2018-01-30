/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun, Mars Wong
 * Date: 15-3-18
 * Time: 上午9:57
 */

window.onload = function () {
  var grouplist = {
    $table: $('#table'),

    init: function () {
      this.renderPage();
      this.bindEvent();
      this.search();
    },

    bindEvent: function () {
      var _this = this;

      this.$table.on('click', '.j_toggle', function () {
        // 是否显示分组成员
        _this.toggleSub($(this));
      });

      this.$table.on('click', '.delete', function (e) {
        // 删除分组
        e.preventDefault();
        _this.deleteItems($(this));
      });

      this.$table.on('click', '.add-history', function (e) {
        // 保存为历史数据
        e.preventDefault();
        _this.addHistory($(this));
      });

      // 结束经营
      this.$table.on('click', '.gameover', function (e) {
        e.preventDefault();

        var the = $(this);

        DIALOG.confirm('Are you sure end the group？', function () {
          var userUnique = the.closest('tr').attr('data-mark');
          var groupName = the.closest('.sub-tr').attr('data-name');

          $.post('gameGroupManagerAction!endPlayGame.action?rnd=' + Math.random(), {
            userUnique: userUnique,
            groupName: groupName
          }, function (res) {
            if (res.code === 1) {
              TIP('End of business success！', 'success', 2000);
              the.parent().html('over');
            } else {
              TIP('End of business failure！', 'error', 2000);
            }
          }, 'json');
        });
      });


      // 结束订单选择
      this.$table.on('click', '.chooseorder-end', function (e) {
        e.preventDefault();
        var the = $(this);
        var userUnique = the.closest('tr').attr('data-mark');
        var data = {
          userUnique: userUnique
        };
        DIALOG.confirm('Are you sure end the group order selection', function () {
          $.post('gameGroupManagerAction!endChooseOrder.action?rnd=' + Math.random(), data, function (res) {
            if (res.code == 0) {
              TIP('End order selection is successful！', 'success', 2000);
              the.parent().html('Completed order selection');
            } else {
              TIP('End order selection failed！', 'error', 2000);
            }
          }, 'json');
        });
      });

      // 结束投广告
      this.$table.on('click', '.adver-end', function (e) {
        e.preventDefault();
        var the = $(this);
        var userUnique = the.closest('tr').attr('data-mark');
        var data = {
          userUnique: userUnique
        };
        DIALOG.confirm('Are you sure end the group’s ad serving', function () {
          $.post('gameGroupManagerAction!endAdvertising.action?rnd=' + Math.random(), data, function (res) {//
            if (res.code == 0) {
              TIP('End ad served successfully！', 'success', 2000);
              the.parent().html('The ad has ended');
            } else {
              TIP('Failed to end ad serving！', 'error', 2000);
            }
          }, 'json');
        });
      });

      // 推进下一周期
      this.$table.on('click', '.next-period', function (e) {
        e.preventDefault();
        var the = $(this);
        var userUnique = the.closest('tr').attr('data-mark');
        var data = {
          userUnique: userUnique
        };
        DIALOG.confirm('Are you sure to advance the next period', function () {
          $.post('gameGroupManagerAction!ForwarPeriod.action?rnd=' + Math.random(), data, function (res) { //
            if (res.code == 1) {
              TIP('Promote the next cycle of success！', 'success', 2000);
                    /* var tr = the.parent();
                    var current = parseInt(tr.attr('data-curyear')) + 1;
                    var per = parseInt(tr.attr('data-peryear'));
                    var year = parseInt(tr.attr('data-year'));
                    var p = current % per ;
                    var time = '';
                    if(p>0){
                        time += '当前：第'+ (parseInt(current/per)+1) +"年" + " 第"+ p +"期 ";
                    }else{
                        time += '当前：第'+ parseInt(current/per) +"年" + " 第"+ per +"期 ";
                    }
                    if(current < per*year){
                        time += '<a href="#" class="next-period">推进下一周期</a>';
                    }
                    tr.attr('data-curyear',current);
                    tr.html(time);*/
              var tr = the.closest('tr').parent().parent().parent().parent();
              var groupName = tr.attr('data-name');
              _this.setSubTable(groupName, tr);
            } else if (res.code == 2) {
              TIP('Promote the next cycle failed! Is the beginning of the year but did not complete the advertising fee and order selection confirmation ', 'error', 2000);
            } else if (res.code == 0) {
              TIP('Promote the next cycle failed! The user is already bankrupt  ', 'error', 2000);
            } else {
              TIP('Promote the next cycle failed! The game is over ', 'error', 2000);
            }
          }, 'json');
        });
      });
    },
    renderPage: function () {
      this.table = new Table({
        table: this.$table,
        tableArea: $('#table-area'),
        showIndex: true,
        pageSize: 10,
        showIndexContent: 'Numbering'
      });
      this.extendFun();
      this.table.loadData('gameGroupManagerAction!showGameGroups.action?rnd=' + Math.random(), 'GameGroups');
    },
    extendFun: function () {
      $.extend(true, Table.prototype, {
        setTableData: function () {// 设置setTableData函数
          var _this = this;
          var option = this.option;
          var res = option.res;
          var curr = option.currPage;
          option.table.find('tr:has(td)').remove();
          for (var i = curr * option.pageSize; i < res.length && i < option.pageSize + curr * option.pageSize; i++) {
            var trdata = res[i];
            var tr1 = '<tr id=\'' + trdata.groupName + '\' data-name = \'' + trdata.groupName + '\'>';
            var tr2 = $('<tr class=\'sub-tr hide\'  data-name = \'' + trdata.groupName + '\'><td colspan=' + $('#table>tbody>tr>th').length + '>' +
                      '<span class=\'icon-spin5 animate-spin\'></span>Loading...</td></tr>');
            tr1 += '<td>' +
                      '<span class="icon-plus-squared j_toggle"></span>' +
                      '</td>';
            tr1 += '<td class="groupname">' + trdata.groupName + '</td>' +
                   '<td>' + trdata.groupCreaterId + '</td>' +
                   '<td>' + trdata.userNumbers + '</td>' +
                   '<td>' + trdata.years + '</td>' +
                   '<td>' + trdata.periodsOfOneYear + '</td>' +
                   '<td>' + trdata.currentPeriod + '</td>' +
                      '<td>' +
                      '<a href="#" class="delete"><span class="icon-trash-empty"></span>Cancel</a>' +
                      '<a href="#" class="add-history"><span class="icon-history"></span>Save</a>' +
                      '</td></tr>';
            option.table.append(tr1);
            option.table.append(tr2);
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
                if (item.groupName.toLowerCase().indexOf(txt) != -1) {
                    filterArr.push(item);
                  }
                this.option.searchVal = filterArr;
                curr = 0;
                boo = false;
              }
          }
          var res = this.option.searchVal;
          this.option.totalSize = res.length;

          option.table.find('tr:has(td)').remove();
          for (var i = curr * option.pageSize; i < res.length && i < option.pageSize + curr * option.pageSize; i++) {
            var trdata = res[i];
            var tr1 = '<tr id=\'' + trdata.groupName + '\' data-name = \'' + trdata.groupName + '\'>';
            var tr2 = $('<tr class=\'sub-tr hide\'  data-name = \'' + trdata.groupName + '\'><td colspan=' + $('#table>tbody>tr>th').length + '>' +
                          '<span class=\'icon-spin5 animate-spin\'></span>loading...</td></tr>');
            tr1 += '<td>' +
                          '<span class="icon-plus-squared j_toggle"></span>' +
                          '</td>';
            tr1 += '<td class="groupname">' + trdata.groupName + '</td>' +
                       '<td>' + trdata.groupCreaterId + '</td>' +
                       '<td>' + trdata.userNumbers + '</td>' +
                       '<td>' + trdata.years + '</td>' +
                       '<td>' + trdata.periodsOfOneYear + '</td>' +
                       '<td>' + trdata.currentPeriod + '</td>' +
                          '<td>' +
                          '<a href="#" class="delete"><span class="icon-trash-empty"></span>Cancel</a>' +
                          '<a href="#" class="add-history"><span class="icon-history"></span>Save</a>' +
                          '</td></tr>';
            option.table.append(tr1);
            option.table.append(tr2);
          }
          _this.setPage();
        }
      });
    },
    search: function (res) {
      var _this = this;
      $('#search_group').change(function () {
        var txt = $.trim($(this).val()).toLowerCase();
        if ( txt != '') {
          var boo = true;
          _this.extendFunSearch(txt, boo);
          _this.table.loadData('gameGroupManagerAction!showGameGroups.action?rnd=' + Math.random(), 'GameGroups');
        } else {
          _this.extendFun();
          _this.table.loadData('gameGroupManagerAction!showGameGroups.action?rnd=' + Math.random(), 'GameGroups');
        }
      }).keyup(function () {
        $(this).change();
      });
    },
    toggleSub: function (the) {
      var tr = the.closest('tr').next('tr');
      var groupName = the.closest('tr').attr('data-name');
      if (tr.hasClass('sub-tr')) {
        if (tr.hasClass('hide')) {
          this.setSubTable(groupName, tr);
          tr.fadeIn(300, function () {
            tr.removeClass('hide');
          });

          the.removeClass('icon-plus-squared').addClass('icon-minus-squared');
        } else {
          tr.fadeOut(300, function () {
            tr.addClass('hide');
            tr.find('>td').html('<span class=\'icon-spin5 animate-spin\'></span>loading ...');
          });

          the.removeClass('icon-minus-squared').addClass('icon-plus-squared');
        }
      }
    },

    setSubTable: function (groupName, tr) {
      $.post('gameGroupManagerAction!findGameGroupMemberStatusByGroupName.action?rnd=' + Math.random(), { groupName: groupName }, function (res) {//
        if (res.code == 0) {
          var items = res.GameGroupMemberStatuss;
          if (items) {
            var table = '<table>' +
                    '<tr>' +
                    '<th>Identifier</th>' +
                    '<th>Time</th>' +
                    '<th>Game state</th>' +
                    '<th>AD status</th>' +
                    '<th>Order Status</th>' +
                    '</tr>';

            $(items).each(function (index) {
              var tr = items[index];

                    // 时间
              var time = '';
              var currentYear;
              var currentPeriod;

              if (tr.currentPeriod == 0) {
                time += 'Preparing';
              } else {
                currentYear = Math.ceil(tr.currentPeriod / tr.periodsOfOneYear);
                currentPeriod = tr.currentPeriod % tr.periodsOfOneYear;

                if (currentPeriod == 0) {
                  currentPeriod = tr.periodsOfOneYear;
                }

                time += 'Now：Num ' + currentYear + ' Year Num ' + currentPeriod + ' Period';

                if (tr.currentPeriod < tr.periodsOfOneYear * tr.year && tr.status == 1) {
                  time += '<a href="#" class="next-period">Advance the next cycle</a>';
                }
              }

                    // 游戏状态
              var status = '';

              if (tr.status == 0) {
                status = 'Bankrupt/Ended';
              } else if (tr.status == 1) {
                status = 'Processing/ <a href=\'#\' class=\'gameover\'>End business</a>';
              } else if (tr.status == 10) {
                    status = 'Not started';
                  } else {
                    status = 'over';
                  }

                    // 广告状态
              var advertisText;

              if (tr.finishAdFlag == 1) {
                advertisText = 'The ad is running';
              } else if (tr.finishAdFlag == 0) {
                advertisText = 'Ad serving <a href=\'#\' class=\'adver-end\'>End the delivery</a>';
              } else {
                advertisText = 'Not running';
              }

                    // 订单状态
              var orderText;

              if (tr.finishOrderFlag == 1) {
                orderText = 'Completed order selection';
              } else if (tr.finishOrderFlag == 0 && tr.chooseOrderFlag == 1) {
                orderText = 'Order selection <a href=\'#\' class=\'chooseorder-end\'>End the selection</a>';
              } else {
                orderText = 'Can not menu';
              }

              var opt;
              table += '<tr data-mark="' + tr.userUnique + '">' +
                    '<td>' + tr.userName + '</td>' +
                        '<td data-curyear="' + tr.currentPeriod + '" data-year="' + tr.year + '" data-peryear="' + tr.periodsOfOneYear + '">' +
                             time + '</td>' +
                        '<td>' + status + '</td>' +
                        '<td>' + advertisText + '</td>' +
                        '<td>' + orderText + '</td>' +
                        '</tr>';
            });

            table += '</table>';
            tr.find('>td').html(table);
          }
        }
      }, 'json');
    },

    addHistory: function (the) {
      var _this = this;
      var tr = the.closest('tr');
      var groupName = tr.attr('data-name');
      var groupname = tr.find('.groupname').text();
      var data = {
        groupName: groupName
      };
      DIALOG.confirm('Will be grouped<b>' + groupname + '</b>Are all data transferred to historical data?？', function () {
        $.post('gameGroupManagerAction!changeToHistory.action?rnd=' + Math.random(), data, function (res) {// /GameGroupManagerAction!deteleGameGroup.action
          if (res.code == 0) {
            TIP('Added successfully！', 'success', 2000);
            _this.table.loadData('gameGroupManagerAction!showGameGroups.action?rnd=' + Math.random(), 'GameGroups');// /GameGroupManagerAction!showGameGroups.action
          } else {
            TIP('add failed! (There may be a group of games in the game group)', 'error', 2000);
          }
        }, 'json');
      });
    },

    deleteItems: function (the) {// 删除
      var _this = this;
      var tr = the.closest('tr');
      var groupName = tr.attr('data-name');
      var groupname = tr.find('.groupname').text();
      var data = {
        groupName: groupName
      };
      DIALOG.confirm('OK to delete the game group' + groupname + 'After the deletion will end the game！', function () {
        $.post('gameGroupManagerAction!deteleGameGroup.action?rnd=' + Math.random(), data, function (res) {
          if (res.code == 0) {
            TIP('Successfully deleted！', 'success', 2000);
            _this.table.loadData('gameGroupManagerAction!showGameGroups.action?rnd=' + Math.random(), 'GameGroups');
          } else {
            TIP('Delete the failure (There are groups in the game group is in the game)！', 'error', 2000);
          }
        }, 'json');
      });
    }
  };

  grouplist.init();
};

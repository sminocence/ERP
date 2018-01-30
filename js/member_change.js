$(function(){

	//请求所有成员信息
	$.ajax({
		url : "/erpm/memberDetailAction!findAllInOneTeam.action",
		type : "POST",
		dataType:"json",
		success : function(data){
			if (data.code == 1) {
				var memberData = data.memberDetails;
				var memberStr = '';
				var len = memberData.length;
				for(var i=0;i<len;i++){
					memberStr += '<tr class="memberInfo-tr">'+
					  				'<td class="memberStuId"><input readonly="true" name="studentNo" type="text" value="'+ memberData[i].studentNo +'" /></td>'+
					  				'<td class="memberName"><input readonly="true" name="studentName" type="text" value="'+ memberData[i].studentName +'" /></td>'+
					  				'<td class="memberRole"><input readonly="true" name="title" type="text" value="'+ memberData[i].title +'" /></td>'+
					  				'<td class="memberScore"><input readonly="true" name="contribution" type="text" value="'+ memberData[i].contribution +'" /></td>'+
					  				'<td><span class="memberDel">删除</span></td>'+
					  			'</tr>'
				}
				$(".memberInfo-table").append(memberStr);

				//点击修改
				/*$(".memberChange").click(function(){
					//弹出修改表单
					var changeBoxStr = '';
					changeBoxStr = '<div class="addBox-all">'+
										'<div class="addBox-title">企业内部职务设置<span class="addBox-close">X</span></div>'+
								  		'<div class="addBox-content">'+
									  		'<form id="changeForm" name="changeForm" method="post" enctype="multipart/form-data">'+
									  			'<p>'+
									  				'学&nbsp;&nbsp;&nbsp;&nbsp;号：<input name="studentNo" type="text" value="'+ $(this).parent().siblings().eq(0).text() +'" />'+
									  			'</p>'+
									  			'<p>'+
									  				'姓&nbsp;&nbsp;&nbsp;&nbsp;名：<input name="studentName" type="text" value="'+ $(this).parent().siblings().eq(1).text() +'" />'+
									  			'</p>'+
									  			'<p>'+
									  				'职&nbsp;&nbsp;&nbsp;&nbsp;务：<input name="title" type="text" value="'+ $(this).parent().siblings().eq(2).text() +'" />'+
									  			'</p>'+
									  			'<p>'+
									  				'贡献率：<input name="contribution" type="text" value="'+ $(this).parent().siblings().eq(3).text() +'" />'+
									  			'</p>'+
									  		'</form>'+
									  		'<p>'+
								  				'<button class="changeMember-sure">修改</button>'+
								  			'</p>'+
								  		'</div>'+
								  	'</div>';
					//添加弹出框
					var oldStudentNo = $(this).parent().siblings().eq(0).text();
					$(".addBox").html(changeBoxStr)
					//点击X
					$(".addBox-close").click(function(){
						$(".addBox-all").remove();
					})

					//点击确认修改
					$(".changeMember-sure").click(function(){
						var contribution = $("#changeForm input[name='contribution']").val();
						var studentName = $("#changeForm input[name='studentName']").val();
						var studentNo = $("#changeForm input[name='studentNo']").val();
						var title = $("#changeForm input[name='title']").val();
						$.ajax({
							url : "/erpm/memberDetailAction!updateMemberDetail.action",
							type : "POST",
							dataType:"json",
							data :{
								"contribution": contribution,
								"studentName": studentName,
								"studentNo": studentNo,
								"title": title,
								"oldStudentNo": oldStudentNo
							},
							success : function(data){   //请求成功
								if(data.code == 1){
									console.log(data);  //打印出后台返回数据
									alert(data.result); 
									window.location.reload();  //页面自动重新加载
								}else{
									alert(data.result);
								}				
							},
							error : function(){   //请求失败
								alert("请求失败");
							}
						})
					}) //点击确认修改结束
				})  //点击修改结束*/
				 

				//点击删除
				$(".memberDel").click(function(){
					var studentNo = $(this).parent().siblings().find('input[name="studentNo"]').val(); //获取成员学号
					console.log(studentNo);
					if (confirm("确认删除此成员？")) {
						$.ajax({
							url : "/erpm/memberDetailAction!deleteMemberDetail.action",
							type : "POST",
							dataType:"json",
							data : {
								"studentNo" : studentNo
							},
							success : function(data){
								if (data.code == 1) {
									alert(data.result);
									window.location.reload();  //页面自动重新加载	
								}else{
									alert(data.result);
								}	
							},
							error : function(){
								alert("请求失败");
							}
						}) //删除ajax结束
					} //点击弹出窗口结束 
				}) //点击删除结束
			}else{
				alert(data.result);
			}
		},
		error : function(){
			alert("请求失败");
		}
	})

	//点击添加按钮
	$(".addMember").click(function(){
		//弹出弹出框
		var addBoxStr = '';
		addBoxStr = '<div class="addBox-all">'+
						'<div class="addBox-title">企业内部职务设置<span class="addBox-close">X</span></div>'+
				  		'<div class="addBox-content">'+
					  		'<form id="memberForm" name="memberForm" method="post" enctype="multipart/form-data">'+
					  			'<p>'+
					  				'学&nbsp;&nbsp;&nbsp;&nbsp;号：<input name="studentNo" type="text" />'+
					  			'</p>'+
					  			'<p>'+
					  				'姓&nbsp;&nbsp;&nbsp;&nbsp;名：<input name="studentName" type="text" />'+
					  			'</p>'+
					  			'<p>'+
					  				'职&nbsp;&nbsp;&nbsp;&nbsp;务：<input name="title" type="text" />'+
					  			'</p>'+
					  			'<p>'+
					  				'贡献率(%)：<input name="addContribution" type="text" value="20" />'+
					  			'</p>'+
					  		'</form>'+
					  		'<p>'+
				  				'<button class="addMember-sure">添加</button>'+
				  			'</p>'+
				  		'</div>'+
				  	'</div>';
		//添加弹出框
		$(".addBox").html(addBoxStr)

		//点击X
		$(".addBox-close").click(function(){
			$(".addBox-all").remove();
		})

		//确认添加
		$(".addMember-sure").click(function(){
			var contribution = $("#memberForm input[name='addContribution']").val();
			var studentName = $("#memberForm input[name='studentName']").val();
			var studentNo = $("#memberForm input[name='studentNo']").val();
			var title = $("#memberForm input[name='title']").val();
			var contributionNum = parseInt(contribution);
			var len = $('.memberInfo-tr').length;
			var studentNoReg = /[^\d{10}$]/g;
			for(var i=0;i<len;i++){
				contributionNum += parseInt($('input[name="contribution"]').eq(i).val());
			}
			if(contributionNum>100){
				alert('贡献率之和不得大于100');
			}else{
				$.ajax({
					url : "/erpm/memberDetailAction!addMemberDetail.action",
					type : "POST",
					dataType:"json",
					data :{
						"contribution": contribution,
						"studentName": studentName,
						"studentNo": studentNo,
						"title": title
					},
					success : function(data){   //请求成功
						if(data.code == 1){
							alert(data.result); 
							window.location.reload();  //页面自动重新加载	
						}else{
							alert(data.result);
						}				
					},
					error : function(){   //请求失败 
						alert("请求失败");
					}
				})
			}
		})
	})

	//点击修改成员信息
	$('.changeMember').click(function(){
		$('.memberInfo-tr input').attr('readonly',false);
		$(this).attr('class','changeMember-sure');
		$(this).html('保存修改');

		//点击保存修改
		var oldStudentNoList = [];
		var len = $('.memberInfo-tr').length;
		for(var i=0;i<len;i++){
			oldStudentNoList.push($('.memberInfo-tr').eq(i).find("input[name='studentNo']").val());
		}
		$('.changeMember-sure').click(function(){
			var contributionNum = 0;
			for(var i=0;i<len;i++){
				contributionNum += parseInt($('input[name="contribution"]').eq(i).val());
			}
			if(contributionNum>100){
				alert('贡献率之和必须小于等于100');
			}else{
				var memberDetailList = [];
				var data = {};
				//var len = $('.memberInfo-tr').length;
				for(var i=0;i<len;i++){
					var contribution = $('.memberInfo-tr').eq(i).find("input[name='contribution']").val();
					var studentName = $('.memberInfo-tr').eq(i).find("input[name='studentName']").val();
					var studentNo = $('.memberInfo-tr').eq(i).find("input[name='studentNo']").val();
					var title = $('.memberInfo-tr').eq(i).find("input[name='title']").val();
					data["memberDetailList["+i+"].contribution"] = contribution;
					data["memberDetailList["+i+"].studentName"] = studentName;
					data["memberDetailList["+i+"].studentNo"] = studentNo;
					data["memberDetailList["+i+"].title"] = title;
					data["memberDetailList["+i+"].oldStudentNo"] = oldStudentNoList[i];
				}
				$.ajax({
					url : "/erpm/memberDetailAction!updateMemberDetail.action",
					type : "POST",
					dataType:"json",
					data:data,
					success : function(res){  
						if(res.code == 1){
							alert(res.result); 
							window.location.reload();  //页面自动重新加载
						}else{
							alert(res.result);
							window.location.reload();
						}				
					},
					error : function(){   //请求失败
						alert("请求失败");
					}
				})
			}
		})

	})
})
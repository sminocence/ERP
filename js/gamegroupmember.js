function refresh(){
	gameGroupMemberService.showGameGroupMemberList();
	//parent.location.reload();
	//这里要用徐亚的方法来做 单独调用某块的方法.
}
function deleteGameGroup(){
	parent.location.reload();
}
function exitGroup(){
	parent.location.reload();
}


function displayGameGroupMemberList(list) {
	var size=4;//已有的
	var value;

	//头部信息展示
    	$.post("gameGroupAction!getGameGroupMessage.action?rnd="+Math.random(),function(data){
    		var total = data.userNumbers;
    		for(var i=0;i<total;i++){
    	    	$('.left_tab td').eq(i).css("background","url(../../images/pic_wait.jpg) no-repeat");
    	    }
			$('.header_tab td').eq(0).text("组名："+data.groupName);
			$('.header_tab td').eq(1).text("创建人："+data.groupCreaterId);
			$('.header_tab td').eq(2).text("比赛持续年数："+data.years);
			$('.header_tab td').eq(3).text("每年包含周期数："+data.periodsOfOneYear);
          },"json");
    	
    	
		 var obj = jQuery.parseJSON(list);
    	    value=obj;
    	    $('.left_tab td').empty();
    	    //中间表格内容展示
    	    $(value).each(function(indx){
    		var targ1=$('.left_tab td').eq(indx);
		     var sp1='<p></p>';
		     var userId=value[indx].userID;
		   
        	 var sum=0;
          for(i=0;i<userId.length;i++){
	             sum=sum+userId.charCodeAt(i);
          }
          var j=sum%7+1;//7是头像的总数

			 sp1+='<img src="../../images/pic_meb'+j+'.jpg" />';
			 sp1+='<span></span>';
			 $(targ1).append(sp1);
			 $(targ1).find('p').append('<input type="checkbox" name="checkbox" class="left_check" />');
			 $('.left_tab').find('input').eq(indx).attr("value",value[indx].userID);
			 $(targ1).find('span').text(value[indx].name);
    	     });
    	     $('.left_tab td').eq(0).find('p input').hide();
    	     //悬浮框资料卡显示
    	    $('.unique td').find('p input').hide();
    	    $(".container_5 .left .left_tab td img").mouseover(function(){
		        var x=75; 
             var y=50;  
             var _this=$(this);
             
		        $.each(obj,function(indx){
		        	$('.left_infor').remove();
		        	var s="";
		        	s+='<div class="left_infor"></div>';
		      	    $('.left_tab').after(s);
		            var w=$(_this).offset().left+x;
		            var h=$(_this).offset().top+y;
		            $('.left_infor').css({"left":w+"px","top":h+"px","display":"block"});
			        var sp2='<p class="left_infor_p1"></p>';
			        for(var i=0;i<5;i++){ sp2+='<p></p>'; }
                 $('.left_infor').append(sp2);
			        if($(_this).next().text()==obj[indx].name){
			     	    var targ2=$(_this).parents('.left_tab').next();
			            $(targ2).find('p:eq(0)').text("用户名："+obj[indx].userID);
			            $(targ2).find('p:eq(1)').text("真实姓名："+obj[indx].name);
			            $(targ2).find('p:eq(2)').text("专业："+obj[indx].major);
			            $(targ2).find('p:eq(3)').text("班级："+obj[indx].className);
			            $(targ2).find('p:eq(4)').text("联系电话："+obj[indx].tel);
			            $(targ2).find('p:eq(5)').text("邮箱："+obj[indx].email);
			            return false;
			        }
			    });
		    });
    	  $(".container_5 .left .left_tab td img").mouseout(function(){
			     $(".left_infor").css("display","none");
		 });   	 
}



$(function(){
	gameGroupMemberService.showGameGroupMemberList();
    //删除小组
	$('input[name="remove_member"]').click(function(){
	   var str="";
	   $(".left_tab input").each(function(one){
	       if($('.left_tab input').eq(one).is(":checked")) { str+=$('input').eq(one).val()+","; }
	   });
	   if(str=="") alert("请选择删除内容");
	   else{
	       $.post("gameGroupMemberAction!adminDeleteGroupMember.action?rnd="+Math.random(),{"userID":str},function(){});
	   }
	});
	$('input[name="exit"]').click(function(){
		$.post("gameGroupMemberAction!exitGroup.action?rnd="+Math.random(),function(){
			parent.location.reload();
			//gameGroupMemberService.showGameGroupMemberList();
		});
		
	});
	$('input[name="delete"]').click(function(){
		$.post("gameGroupAction!deleteGameGroup.action?rnd="+Math.random(),function(){
			parent.location.reload();
			//gameGroupMemberService.showGameGroupMemberList();
		});
	});
           
	$('input[name="start_game"]').click(function(){
		$.get("gameGroupAction!startGame.action?rnd="+Math.random(),function(){});
		//window.parent.location.href = "../mainframework/loadingpage.html";
		//alert("ha");
	});
	
});


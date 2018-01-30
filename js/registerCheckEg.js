$(function(){
    $.registerCheck();
});
$.extend({
	/*----------注册页面验证----------*/
	registerCheck:function(){
		var _this1;var _this2;var _this3;var _this4;var _this5;var _this6;
		var ok1 = false;var ok2 = false;var ok3 = false;var ok4 = false;var ok5 = false;var ok6 = false;
	    var showRight=function($str){
            $str.next().empty().append('<img src="../../images/checked.gif" />').css("padding-left","8px");
        };
        var showError=function($str){
    	    var temp='Please enter correctly'+$str.parents('tr').find('.space').text();
    	    temp=temp.replace(/\s+/g,"");
	        $str.next().empty().append(temp).css("color","orange").css("padding-left","8px");
        };
        /*var allReady=function(){
            if(!(ok1&&ok2&&ok3&&ok4&&ok5&&ok6)) { $('input[name="register"]').attr("disabled","disabled").removeClass("readyYes").addClass("readyNo"); }
     	    else{ $('input[name="register"]').removeAttr("disabled").removeClass("readyNo").addClass("readyYes"); }	
        };*/	
        var usernameCheck=function(_this1){
        	//验证用户名
        	if($(_this1).val().search(/\s+/)==0||$(_this1).val()==''){ showError($(_this1)); ok1=false; } 
		    else{
		        var user=$(_this1).val();
		        $.post("registerInfoAction!isExistsUser.action?rnd="+Math.random(),{"userID":user},function(data){
		        	var val=data.existCode;
                    if(val=="true") {$(_this1).next().empty().append("Username already exists").css("color","orange").css("padding-left","8px"); } 
                    else{ $(_this1).next().empty().append('<img src="../../images/checked.gif" />').css("padding-left","8px"); ok1=true;}
        	    },"json"); 
            }
            //allReady();
        };
	    var rmpCheck=function(_this2){
	    	//验证真实姓名、专业、密码
            if($(_this2).val().search(/\s+/)==0||$(_this2).val()=='') { showError($(_this2)); ok2=false; }									        
		    else { showRight($(_this2)); ok2=true; }   
		    //allReady();
	    };
	    var mailCheck=function(_this3){
	    	//验证电子邮箱
	    	if($(_this3).val().search(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)==-1) {
		        showError($(_this3));
		        ok3=false;
		    }
		    else { showRight($(_this3)); ok3=true; }
		    //allReady();
	    };
	    var ctsCheck=function(_this4){
	    	//验证班级、联系方式、学号
	    	if($(_this4).val().search(/^\d+$/)==-1){ showError($(_this4)); ok4=false; }   
		    else {	showRight($(_this4)); ok4=true; }
		    //allReady();
	    };
	    var confirmCheck=function(_this5){
	    	//验证确认密码
	    	if(($(_this5).val()==$('input[name="password"]').val()) && ($(_this5).val()!='')) {
			    showRight($(_this5));
			    ok5=true;
		    }									        
		    else { showError($(_this5)); ok5=false; }   
		    //allReady();
	    };
	    var agreeCheck=function(_this6){
	    	//验证是否同意协议
	        if($(_this6).is(":checked")) { ok6=true; }
	        else{ ok6=false; }
	        //allReady();	
	    };
	    //提交表单前的检查
	    var checkAll=function(){
	    	if(!typeof ($('#userID').val()) == "undefined"){
	    		usernameCheck($('#userID'));
	    	}else{
	    		ok1=true;
	    	}
	    	rmpCheck($('input[name="name"]'));
	    	rmpCheck($('input[name="major"]'));
	    	rmpCheck($('input[name="password"]'));
	    	mailCheck($('input[name="email"]'));
	    	ctsCheck($('input[name="className"]'));
	    	ctsCheck($('input[name="tel"]'));
	    	ctsCheck($('input[name="studentID"]'));
	    	confirmCheck($('input[name="confirm"]'));
	    	agreeCheck($('input[name="agree"]'));
	    };
	    $('#userID').blur(function(){ _this1=$(this); usernameCheck(_this1); });
	    $('input[name="name"],input[name="major"],input[name="password"]').blur(function(){ _this2=$(this); rmpCheck(_this2); checkAll(); });
	    $('input[name="email"]').blur(function(){ _this3=$(this); mailCheck(_this3); });
	    $('input[name="className"],input[name="tel"],input[name="studentID"]').blur(function(){ _this4=$(this); ctsCheck(_this4); });
	    $('input[name="confirm"]').blur(function(){ _this5=$(this); confirmCheck(_this5); checkAll(); });
	    $('input[name="agree"]').click(function(){ _this6=$(this); agreeCheck(_this6); });
	    
	    $('input[name="register"]').click(function(){
	    	if(ok1&&ok2&&ok3&&ok4&&ok5&&ok6) { $('form').submit(); }
	    	 else 
		        { 
		        	if(!ok6){
		        		alert("Please check the user agreement");
		        	}else{
		        		alert("Please enter the correct information");
		        	}
		        	return false; 
		        }
	    });
	}
});
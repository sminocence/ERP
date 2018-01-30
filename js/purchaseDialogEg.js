// JavaScript Document
//设置右下角弹框
function bottomPopup(getInfor,status,num)
{   
    var parent = $(window.parent.document).contents();	
    var popupBox = parent.find("#popupBox");
	var img = popupBox.find("img");
	var span = popupBox.find("span");
    if(popupBox.is(":visible"))
    {
     	alert("The operation is too frequent. Please try again later");
    }
     else
    {
		 if(num>1)
	  {
		 alert("Error occurred!");}
	    else if(num==1)
	   { 
		switch(status){
			case 0:
			     popupBox.css({"background":"#fff url(../../images/popbg2.png) repeat-x","border":"1px solid #ccc"});
			     img.attr("src","../../images/right.png");
				 break;//对应于成功
			case 1:
			      popupBox.css({"background":"#fff url(../../images/popbg.png) repeat-x","border":"1px solid #E05E5E"});
			     img.attr("src","../../images/error.png");
				  break;//对应于失败
			case 2:
			       popupBox.css({"background":"#fff url(../../images/popbg2.png) repeat-x","border":"1px solid #ccc"});
			      img.attr("src","../../images/warn.png");
			      break;//对应于警告
			}//switch结束
		   span.text(getInfor);
		   //触发父窗口的右下角弹框
	 	   popupBox.slideDown(300).delay(2000).slideUp(400);
	  }//else if 结束
	
    }//else结束
	  
}//函数结束
	
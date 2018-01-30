// JavaScript Document
$(function(){
//对右下角的弹窗进行设定
 function bottomPopup(getInfor,status,num)
  {  
     if(num>1)
	 {
		 alert("发生错误！");}
	 else if(num==1)
	 {  
	    var img=$("#popupBox img");
		switch(status){
			case 0:
			     img.attr("src","../../images/right.png");
				 break;//对应于成功
			case 1:
			     img.attr("src","../../images/error.png");
				  break;//对应于失败
			case 2:
			      img.attr("src","../../images/warn.png");
			      break;//对应于警告
			}//switch结束
		$("#popupBox span").text(getInfor);
		$("#popupBox").show(1000).animate({"right":"-360px"},5000);
		
	}//else if 结束
	  
}//函数结束
	bottomPopup("警告信息地方",2,1);
	 //bottomPopup("成功",0,1);
	//bottomPopup("对不起，你所提交的信息错误bdsmbkbfkjshhsdhgkhsdkglhkhgdf",1,1);
	//bottomPopup("",0,4);
});
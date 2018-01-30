// <<<<<<< HEAD
// $(document).ready(function(){
// =======
	$(document).ready(function(){
// >>>>>>> f43aff42123675570b35719bc0a06ae284306d3d
	  //用户点击进入英文版按钮
	  $('input[name="jump01"]').click(function(){
	      $.ajax({
	          type : "GET",
	          url : "loginAction!changeLanguage.action",
	          data :{
// <<<<<<< HEAD
	              language: "english"
// =======
	              // language: "english"
// >>>>>>> f43aff42123675570b35719bc0a06ae284306d3d
	          },
	          success : function(data){
	              if (data.status === '0') {
	                  alert(data.message);
	              }
	              else{
	                  alert( "Jump success! Welcome to ERP English version" );
	                  window.location.href="indexeg.html";      
	              }    
	          },
	          error: function(data){
	              console.log("网络错误");
	          }
	      });
	  });

	  //用户按下Enter键进入英文版
	  $(window).on('keydown', function(event) {
	      if(event.keyCode === 13){
	          if($(this).is('input[name="jump01"]')){
	              $.ajax({
	                  type : "GET",
	                  url : "loginAction!changeLanguage.action",
	                  data :{
// <<<<<<< HEAD
	                      language: "english"
// =======
	                      // language: "english"
// >>>>>>> f43aff42123675570b35719bc0a06ae284306d3d
	                  },
	                  success : function(data){
	                      if (data.status === '0') {
	                          alert(data.message);
	                      }
	                      else{
	                          alert( "Jump success! Welcome to ERP English version" );
	                          window.location.href="indexeg.html";      
	                      }    
	                  },
	                  error: function(data){
	                      console.log("网络错误");
	                  }
	              });
	          }
	      } 
	  });

	  //进入中文版按钮
	  $('input[name="jump02"]').click(function(){
	      $.ajax({
	          type : "GET",
	          url : "loginAction!changeLanguage.action",
	          data :{
	              //language: english
	              language:"chinese"
	          },
	          success : function(data){
	              if (data.status === '0') {
	                  alert(data.message);
	              }
	              else{
	                  alert( "跳转成功啦！欢迎来到ERP中文版" );
	                  window.location.href="index.html";      
	              }    
	          },
	          error: function(data){
	              console.log("网络错误");
	          }
	      });
	  });

	  //用户按下Enter键进入中文版
	  $(window).on('keydown', function(event) {
	      if(event.keyCode === 13){
	          if($(this).is('input[name="jump02"]')){
	              $.ajax({
	                  type : "GET",
	                  url : "loginAction!changeLanguage.action",
	                  data :{
	                     // language: english
	                     language:"chinese"
	                  },
	                  success : function(data){
	                      if (data.status === '0') {
	                          alert(data.message);
	                      }
	                      else{
	                          alert( "跳转成功啦！欢迎来到ERP中文版" );
	                          window.location.href="index.html";      
	                      }    
	                  },
	                  error: function(data){
	                      console.log("网络错误");
	                  }
	              }); 
	          }  
	      }  
	  });
});
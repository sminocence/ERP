$(function(){
    $('#edit').editable({inlineMode: false, alwaysBlank: true})

    function summary(url,message){
	    $.post(url,{context:message},function(res){
	    	alert(res.message);
	    	document.location.reload();
	    },'json')
    }

    $.get('/erpm/experienceAction!getContext.action',function(res){
<<<<<<< HEAD
    	$('.froala-element p').html(res.object);
=======
    	$('.froala-element').html(res.object);
>>>>>>> d68c673aab6863149f47c1fdc1753b5030acc173
    	$('.froala-element').attr('data-placeholder','');
    	if(res.status){
    		url = '/erpm/experienceAction!modify.action';
    		$('.submit').click(function(){
<<<<<<< HEAD
    		    var context = $('.froala-element').text();
                console.log(context);
=======
    		    var context = $('.froala-element').html();
>>>>>>> d68c673aab6863149f47c1fdc1753b5030acc173
    		    summary(url,context);
    		})
    	}else{
    		url = '/erpm/experienceAction!addContext.action';
    		$('.submit').click(function(){
<<<<<<< HEAD
    			var context = $('.froala-element').text();
    			console.log(context);
=======
    			var context = $('.froala-element').html();
>>>>>>> d68c673aab6863149f47c1fdc1753b5030acc173
    			summary(url,context);
    		})
    	}
    },'json')
    
});
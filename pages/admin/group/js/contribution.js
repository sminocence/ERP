(function(){
	$.ajax({
		url : "http://rapapi.org/mockjsdata/22944/memberMessageAction!findAllInOneTeam.action",
		type : "POST",
		success : function(data){
			if (data.code == 1) {
				var groupData = data.memberDetails;
				console.log(groupData);
			}
		}
	})
})();
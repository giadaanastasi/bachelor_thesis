 function getValues(){}

 getValues.REQ;

getValues.DEFAUL_METHOD = "GET";
getValues.URL_REQUEST = "../bootstrap/dist/php/ajax/updateScore.php";

getValues.ASYNC_TYPE = true;

getValues.SUCCESS_RESPONSE = "0";
getValues.NO_SUCCESS = "1";


getValues.init=
		function(req){
		//window.alert("sono dentro la init");
		getValues.REQ=req;
		if(req==0){
			var queryString="?request="+req+"&node="+node+"&parameter="+parameter+'&name='+name;
		}
		else 
			var queryString="?request="+req;
		var url=getValues.URL_REQUEST+queryString;
		//window.alert(url);
		var responseFunction=getValues.onAjaxResponse;
		//window.alert("responseFunction"+responseFunction);
		AjaxManager.performAjaxRequest(getValues.DEFAUL_METHOD,
										url,getValues.ASYNC_TYPE,
										null,responseFunction);
	}

	
getValues.onAjaxResponse = 
	function(response){
		//window.alert("dentro onAjaxResponse");
		if (response.responseCode === getValues.NO_SUCCESS){
			window.alert("Dati non disponibili");	
			clearPlot();
		}
		else{
			if(getValues.REQ==0)
		 		createPlot(response.responseData);
		 	else createGraph(response.responseData);
		}
	}
		

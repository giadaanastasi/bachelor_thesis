function AjaxManager(){}

AjaxManager.getAjaxObject = 
	function(){
		//window.alert("Dentro getAjaxObject");
		var xmlHttp = null;
		try { 
			xmlHttp = new XMLHttpRequest(); 
		} catch (e) {
			try { 
				xmlHttp = new ActiveXObject("Msxml2.XMLHTTP"); //IE (recent versions)
			} catch (e) {
				try { 
					xmlHttp = new ActiveXObject("Microsoft.XMLHTTP"); //IE (older versions)
				} catch (e) {
					xmlHttp = null; 
				}
			}
		}
		return xmlHttp;
	}

AjaxManager.performAjaxRequest = 
	function(method, url, isAsync, dataToSend, responseFunction){
		//window.alert("Sono dentro alla performAjaxRequest");
		var xmlHttp = AjaxManager.getAjaxObject();
		if (xmlHttp === null){
			window.alert("Your browser does not support AJAX!"); // set error function
			return;
		}
	
		xmlHttp.open(method, url, isAsync); 
		xmlHttp.onreadystatechange = function (){
			if (xmlHttp.readyState == 4){
				console.log(xmlHttp.responseText);
				//window.alert(xmlHttp.responseText);
				var data = JSON.parse(xmlHttp.responseText);
				//window.alert("Data: "+data);
				responseFunction(data);
			}
		}
		xmlHttp.send(dataToSend);
}		
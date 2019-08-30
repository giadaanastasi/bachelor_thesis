<?php
	session_start();
	
	require_once "/../config.php";
	require_once "/../util/managerDb.php";
	require_once "/../ajax/AjaxResponse.php";
	if(!isset($_GET['request'])){
		$response=new AjaxResponse();
		echo json_encode($response);
		return;
	}
	$request=$_GET['request'];
	if($request==0){
		if (!isset($_GET['node'])|| !isset($_GET['parameter'])|| !isset($_GET['name'])){
			$response=new AjaxResponse();
			echo json_encode($response);
			return;
		}
		
		$node = $_GET['node'];
		$parameter = $_GET['parameter'];
		$name=$_GET['name'];

		$result=getValue($node, $parameter, $name);
	}
	else {
		$result=getGraph();
	}

	if (!$result){
		$response = new AjaxResponse("1", null);	
		echo json_encode($response);
		return;
	} 
	$response = new AjaxResponse("0", $result);
	echo json_encode($response);
	return;
?>

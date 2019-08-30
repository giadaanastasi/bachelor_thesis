<?php 
	
	class AjaxResponse{
		public $responseCode;
		public $responseData; 
		function AjaxResponse($responseCode = 1, $responseData=null
								){
			$this->responseCode = $responseCode;
			$this->responseData=$responseData;	
		}
	}
?>
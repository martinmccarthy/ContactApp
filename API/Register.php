<?php
	header('Access-Control-Origin: *');
	header("Access-Control-Methods: GET, POST, OPTIONS, PUT, DELETE");
	header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");
	$inData = getRequestInfo();
	
	$FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
	$Login = $inData["Login"];
	$Password = $inData["Password"];
	$email = $inData["email"];

	$conn = new mysqli("localhost", "web", "Group232021Summ3r", "Contacks");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "INSERT into Users (FirstName,LastName,Login,Password,email) VALUES('" . $FirstName . "', '" . $LastName . "', '" . $Login . "', '" . $Password . "', '" . $email . "')";
		if($result = $conn->query($sql) != TRUE)
		{
			returnWithError("$conn->error");
		}
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
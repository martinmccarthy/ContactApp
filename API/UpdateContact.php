<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");
	
	$inData = getRequestInfo();
	
	
	//$ID = $inData["contactID"];
	//$ContactID = null;
	$FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
	$email = $inData["email"];
	$phone = $inData["phone"];
	$DateCreated = $inData["DateCreated"];
	$DateCreated = date("Y-m-d H:i:s");
	$Login = $inData["Login"];

	//$Login = "";
	
	

	$conn = new mysqli("localhost", "web", "Group232021Summ3r", "Contacks");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts Set FirstName = ?, LastName = ?, email = ?, phone = ? where Login = ?");
		$stmt->bind_param("sssss", $FirstName, $LastName, $email, $phone, $Login);
		$stmt->execute();
		returnWithError($stmt->error);
		$stmt->close();
		$conn->close();
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

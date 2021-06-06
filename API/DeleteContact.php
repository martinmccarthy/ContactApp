<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

$inData = getRequestInfo();

	$FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
	$email = $inData["email"];
	$phone = $inData["phone"];
	$Login = $inData["Login"];
	

	$conn = new mysqli("localhost", "web", "Group232021Summ3r", "Contacks");
	if ($conn->connect_error){

		returnWithError( $conn->connect_error );

	}else{

		$stmt = $conn->prepare("DELETE FROM Contacts WHERE (FirstName = ? AND LastName = ? AND email = ? AND phone = ? AND Login = ?)");
		$stmt->bind_param("sssss", $FirstName, $LastName, $email, $phone, $Login);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		
		if( $stmt->error ){
			returnWithError($stmt->error);
		}else{
			returnWithSuccess();
		}
	}

	function getRequestInfo(){

		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj ){

		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err ){

		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithSuccess(){

		$retValue = '{"success": "Contact Deleted"}';
		sendResultInfoAsJson( $retValue );
	}

?>

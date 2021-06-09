<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");
	
	$inData = getRequestInfo();
	
	$FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
	$email = $inData["email"];
	$phone = $inData["phone"];
	$DateCreated = date("Y-m-d H:i:s");
	$Login = $inData["Login"];
	$pinned = $inData["pinned"];

	//$Login = "";
	$pinned = 0;	


	$conn = new mysqli("localhost", "web", "Group232021Summ3r", "Contacks");
	if ($conn->connect_error){
		returnWithError( $conn->connect_error );
	}

	else{
		
		$stmt = $conn->prepare("INSERT into Contacts (FirstName, LastName, email, phone, DateCreated, Login, pinned) VALUES (?,?,?,?,?,?,?)");
		$stmt->bind_param("sssssss", $FirstName, $LastName, $email, $phone, $DateCreated, $Login, $pinned);
		$stmt->execute();
		$stmt->close();
		$conn->close();

		if($stmt->error){
			returnWithError( $stmt->error );
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
?>


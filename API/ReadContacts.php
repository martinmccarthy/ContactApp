<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");
	
	$inData = getRequestInfo();

	$searchResults = "";
	$searchCount = 0;

	#Connect to DataBase
	$conn = new mysqli("localhost", "web", "Group232021Summ3r", "Contacks");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		//SQL STATMENT TO READ ALL THE USER CONTACTS
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE Login = ?");	
		$stmt->bind_param("s", $inData["Login"]);
		$stmt->execute();
		
		$result = $stmt->get_result();

		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0)
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"FirstName":"' . $row["FirstName"] . '", "LastName":"' . $row["LastName"] . '", "email":"' . $row["email"] . '", "phone":"' . $row["phone"] . '"}';
		}

		if($searchCount == 0){
			returnWithError("No Contact Found");
		}
		else{
			returnWithInfo( $searchResults );
		}

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
	
	function returnWithInfo( $searchResults ){
		$retValue = '{"results":[' . $searchResults . ']}';
		sendResultInfoAsJson( $retValue );
	}

?>

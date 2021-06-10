<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");
	
	$inData = getRequestInfo();

	$searchResults = "";
	$searchCount = 0;
	$search = "%" .$inData["search"] ."%";
	//$searchType = $inData["searchPayload"];

	#Connect to DataBase
	$conn = new mysqli("localhost", "web", "Group232021Summ3r", "Contacks");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else{

		//SQL STATMENT TO SEARCH THE USER CONTACTS
		//$stmt = $conn->prepare("SELECT * FROM Contacts WHERE (Name = '$searchType') and ( Email = '$searchType') and ( Phone = '$searchType') and Login = ? ");	
		
		$searchType = $inData["searchType"];


		if(strcmp($searchType, "name") == 0){
			$temp = $search;
			$searchArr = explode(" ", $temp, 2);

			$stmt = $conn->prepare("SELECT * from Contacts where ((FirstName like ? or LastName like ?) or (FirstName like ? and LastName like ?)) and Login=?");
			$stmt->bind_param("sssss", $search, $search, $searchArr[0], $searchArr[1], $inData["Login"]);
		} else if(strcmp($searchType, "email") == 0){
			$stmt = $conn->prepare("SELECT * from Contacts where email like ? and Login=?");
			$stmt->bind_param("ss", $search, $inData["Login"]);
		} else{
			$stmt = $conn->prepare("SELECT * from Contacts where phone like ? and Login=?");
			$stmt->bind_param("ss", $search,$inData["Login"]);


		}
		$stmt->execute();
		$result = $stmt->get_result();

		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0)
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .=  json_encode($row);
		}

		if($searchCount == 0)
		{
			returnWithError("No Record Found");
		}
		else
		{
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

<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");
	
	$inData = getRequestInfo();

	$searchResults = "";
	$searchCount = 0;


	$conn = new mysqli("localhost", "web", "Group232021Summ3r", "Contacks");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{

		$stmt = $conn->prepare("SELECT * from  Contacts Where (FirstName like ? or  LastName like ?) and Login like ?");
		$FirstName = "%" . $inData["FirstName"] . "%";
		$LastName = "%" . $inData["LastName"] . "%";
		//$Login = "%" . $inData["Login"] . "%";
		//$user = "%" .$inData["search"] . "%";
		$stmt->bind_param("sss", $FirstName, $LastName, $inData["Login"]);
		$stmt->execute();
		
		$result = $stmt->get_result();

		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0)
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"FirstName":"' . $row["FirstName"] . '", "LastName":"' . $row["LastName"] . '", "email":"' . $row["email"] . '", "phone":"' . $row["phone"] . '","DateCreated":"' . $row["DateCreated"] . '"}';

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

<?php
	header('Access-Control-Origin: *');
	header("Access-Control-Methods: GET, POST, OPTIONS, PUT, DELETE");
	header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");
	$inData = getRequestInfo();
	
	$Login = $inData["Login"];
	$Password = $inData["Password"];
	$conn = new mysqli("localhost", "web", "Group232021Summ3r", "Contacks");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$query = "SELECT FirstName,LastName,Login,Password FROM Users WHERE Login= '" . $Login . "' AND Password = '" . $Password . "'";
		$result = $conn->query($query);
		if($row = $result->fetch_assoc())
		{
			//printf("%s,%s",$row["FirstName"],$row["LastName"]);
			returnWithInfo($row["FirstName"],$row["LastName"],$row["Login"],$row["Password"]);
		}
		else
		{
			returnWithError("No Records Found");
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
		
	function returnWithInfo( $FirstName, $LastName, $Login, $Password )
	{
		$retValue = '{"FirstName":"' . $FirstName . '","LastName":"' . $LastName . '","Login":"' . $Login . '","Password":"' . $Password . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
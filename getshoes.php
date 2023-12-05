<?php
header('Content-Type:application/json; charset=UTF-8');
ini_set('display_errors', 1);
error_reporting(E_ALL);
//Define the address of the server, database, user, and password
$host = '172.17.0.3';
$db = 'runningStore';
$user = 'angel';
$pass = 'angel767';
$dsn = "mysql:host=$host;dbname=$db";

if( !empty( $_GET[ "query" ] ) )
	$query = $_GET[ "query" ];
    $oneShoe = true;
else{
	$query = "SELECT DISTINCT Picture, Gender, Brand, Shoe , Price FROM shoes;";
    $oneShoe = false; //true when the data of only one shoe is required, false otherwise
}

//try to reach/open database
try {$pdo = new PDO( $dsn, $user, $pass );
} catch( Exception $e ) {
die( "<h3>Error in connection: " . $e->getMessage() .
"</h3>" );
}

//get data from database
try {
    $sql= $query
    $sth = $pdo->query( $sql );
    $rows = $sth->fetchAll();
} catch( Exception $e ){
die( "<h3>Error in query: " . $e ->getMessage() . "</h3>" );
}

$list = array();
if($oneShoe){
    foreach( $rows as $row ){
        array_push( $list, array( $row[0], $row[1], $row[2], $row[3], $row[4] ));
    }
}
else{
    foreach( $rows as $row ){
        array_push( $list, array( $row[0], $row[1], $row[2], $row[3], $row[4] ));
    }
}
$answer = json_encode( $list );
echo $answer;
?>
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

//try to reach/open database
try {$pdo = new PDO( $dsn, $user, $pass );
} catch( Exception $e ) {
die( "<h3>Error in connection: " . $e->getMessage() .
"</h3>" );
}

//Access cartShoe JSON POSTED from shoes-cart.js or GET with query
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    try{
        $rawData = file_get_contents("php://input");
        $shoe = json_decode($rawData, true);
        var_dump($shoe);
        if(!empty($shoe)){
            //access shoe data to add to cart database
            $query = "INSERT INTO shoeCart VALUES (:id, :title, :imageurl, :price, :shoename, :gender, :shoesize);";
            $stmt = $pdo->prepare( $query );
            var_dump($stmt->queryString);
            $stmt->execute($shoe);
        }        
    } catch (Exception $e ){
        echo 'Caught exception', $e->getMessage(), "\n";
    } catch (Error $e) {
        // Handle errors (if needed)
        echo 'Caught error: ', $e->getMessage(), "\n";
    }

} elseif($_SERVER['REQUEST_METHOD'] === 'GET'){
    $userquery = $_GET[ "query" ];
    $sql= "SELECT COUNT(*) FROM shoeCart WHERE UserID = " .$userquery .";";
    $sth = $pdo->query( $sql );
    $count = $sth->fetchColumn();
    if($count){
        $list = array( $count );
    }
    else{
        $list = array(0);
    }
    $list = $count ? array( $count ) : array(0);
    $answer = json_encode( $list ); 
    echo $answer;   
}
?>
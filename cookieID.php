<?php
// generate_unique_id.php
session_start();

// Check if the user has a unique ID stored in a cookie
if (!isset($_COOKIE['uniqueID'])) {
    // Generate a unique ID (e.g., UUID)
    $uniqueID = uniqid();

    // Set the unique ID as a cookie that expires in 30 days
    setcookie('uniqueID', $uniqueID, time() + (30 * 24 * 60 * 60), '/');

    // Store the unique ID in the session for server-side use
    $_SESSION['uniqueID'] = $uniqueID;
} else {
    // Retrieve the unique ID from the cookie and session
    $uniqueID = $_COOKIE['uniqueID'];
}

// Redirect the user back to the index.html page
header("Location: index.html");
exit;
?>

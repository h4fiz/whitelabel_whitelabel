<?php	
	session_start();
	unset($_SESSION["valid"]);
	unset($_SESSION["timeout"]);
	unset($_SESSION["username"]);
	unset($_SESSION["password"]);
	header('Refresh: 0; URL = login.php');
?>

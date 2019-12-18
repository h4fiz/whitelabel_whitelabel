<?php
	ob_start();
	session_start();
	$msg='';
	if( isset($_SESSION['valid']) )
	{
		if( $_SESSION['valid']==true && (time()-$_SESSION['timeout'])<=900 )
		{
			header('Refresh: 0; URL = index.php');
			exit;
		} else 
		{
			unset($_SESSION["valid"]);
			unset($_SESSION["timeout"]);
			unset($_SESSION["username"]);
			unset($_SESSION["password"]);
		}
	}
	if (!empty($_POST['username']) && !empty($_POST['password'])) 
	{	
		if (strcmp($_POST['username'],'admin')==0 && strcmp($_POST['password'],'zoomitnow3368')==0) 
		{
			$_SESSION['valid'] = true;
			$_SESSION['timeout'] = time();
			$_SESSION['username'] = 'admin';
			header('Refresh: 0; URL = index.php');
			exit;
        	}else {
                  $msg = 'Wrong username or password';
               }
	}
?>

<!DOCTYPE html>
<html>
<head>
<link href='http://fonts.googleapis.com/css?family=Montserrat:400,700' rel='stylesheet' type='text/css'>
<meta charset="UTF-8">

<title>Login</title>
<style>
body {    
    background: #00C4C7;
    font-family: Montserrat;
	position: fixed;
	top: 50%;
	left: 50%;
	margin-top: -132px;
	margin-left: -180px;
}

.login-block {
    width: 320px;
    padding: 20px;
    background: #fff;
    border-radius: 5px;    
    margin: 0 auto;	
}

.login-block h1 {
    text-align: center;
    color: #5B4FE8;
    font-size: 18px;
    text-transform: uppercase;
    margin-top: 0;
    margin-bottom: 20px;
}

.login-block img {	
    text-align: center;   
    margin-top: auto;
	margin-bottom: 20px;
}


.login-block input {
    width: 100%;
    height: 42px;
    box-sizing: border-box;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-bottom: 20px;
    font-size: 14px;
    font-family: Montserrat;
    padding: 0 20px 0 50px;
    outline: none;
}

.login-block input#username {
    background: #fff url('./images/user.png') 20px top no-repeat;
    background-size: 16px 80px;
}

.login-block input#username:focus {
    background: #fff url('./images/user.png') 20px bottom no-repeat;
    background-size: 16px 80px;
}

.login-block input#password {
    background: #fff url('./images/password.png') 20px top no-repeat;
    background-size: 16px 80px;
}

.login-block input#password:focus {
    background: #fff url('./images/password.png') 20px bottom no-repeat;
    background-size: 16px 80px;
}

.login-block input:active, .login-block input:focus {
    border: 1px solid #5B4FE8;
}

.login-block button {
    width: 100%;
    height: 40px;
    background: #5B4FE8;
    box-sizing: border-box;
    border-radius: 5px;
    border: 1px solid #5B4FE8;
    color: #fff;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 14px;
    font-family: Montserrat;
    outline: none;
    cursor: pointer;
}

.login-block button:hover {
    background: #5B4FE8;
}

</style>
</head>

<body>

<div class="login-block">
	<div style="text-align:center;margin:auto;">
		<img src="./images/logo_top.png">
	</div>
	<form action ="#" method = "post">
		<input type="text" value="" placeholder="Username" id="username" name="username"/>
		<input type="password" value="" placeholder="Password" id="password" name="password"/>
		<button>Login</button>
		<h4> <?php echo $msg; ?></h4>
	</form>
</div>
</body>

</html>

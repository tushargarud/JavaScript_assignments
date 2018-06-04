<html>
<head>
    <title>Message Board</title>
    <link rel="stylesheet" type="text/css" href="board.css">
    <script type="text/javascript">
        function submitForm(replyId)
        {
            var form = document.createElement("form");
            form.setAttribute("method", "post");
            form.setAttribute("action", "board.php");

            var replyField = document.createElement("input");
            replyField.setAttribute("type", "hidden");
            replyField.setAttribute("name", "replyto");
            replyField.setAttribute("value", replyId);
            form.appendChild(replyField);

            var messageField = document.createElement("input");
            messageField.setAttribute("type", "hidden");
            messageField.setAttribute("name", "messageBody");
            messageField.setAttribute("value", document.getElementById("messageBody").value);
            form.appendChild(messageField);

            document.body.appendChild(form);
            form.submit();
        }
    </script>
</head>
<body>

<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors','On');

function clean_input($inputStr)
{
    $inputStr = trim($inputStr);
    $inputStr = stripslashes($inputStr);
    $inputStr = htmlspecialchars($inputStr);
    return $inputStr;
}

if(empty($_SESSION['login']) || isset($_GET["logout"]))
{
    session_unset();
    session_destroy();
    //session_regenerate_id(true);
    header("Location: login.php");
    exit();
}

$db_host='127.0.0.1:3306' ;
$db_database='board' ;
$db_username='root';
$db_password='';

if(isset($_POST["replyto"]))
{
    try
    {
        $c_id = uniqid("M");
        $c_replyto = clean_input($_POST["replyto"]);
        $c_postedby = $_SESSION["userName"];
        $c_message = clean_input($_POST["messageBody"]);

        $dbh = new PDO("mysql:host=$db_host;dbname=$db_database","$db_username","$db_password",array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $dbh->beginTransaction();
        $stmt = $dbh->prepare("INSERT INTO posts (id, replyto, postedby, datetime, message) VALUES (:c_id, :c_replyto, :c_postedby, NOW(), :c_message)");
        $stmt->bindParam(':c_id', $c_id);
        $stmt->bindParam(':c_replyto', $c_replyto);
        $stmt->bindParam(':c_postedby', $c_postedby);
        $stmt->bindParam(':c_message', $c_message);
        $stmt->execute() or die(print_r($dbh->errorInfo(), true));
        $dbh->commit();
        $dbh=null;
    }
    catch (PDOException $e)
    {
        $dbh=null;
        print "Error!: " . $e->getMessage() . "<br/>";
        die();
    }
}

?>

<h1>MESSAGE BOARD</h1>
<div class="right">
    <form action="board.php" method="get">
        <input name="logout" value="1" type="hidden" />
        <input type="submit" value="Logout" id="logoutbtn" class="post-button" />
    </form>
</div>

<div class="postform">
    <form>
        <textarea rows="4"  name="messageBody" id="messageBody" ></textarea>
        <br/><br/>
        <input type="hidden" name="replyto" value="null" />
        <input type="button" value="New Post" class="post-button newpost-button" onclick="submitForm('null')" />
    </form>
</div>

<?php

try
{
    $dbh = new PDO("mysql:host=$db_host;dbname=$db_database","$db_username","$db_password",array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
    $stmt = $dbh->prepare('SELECT p.id, p.replyto, p.postedby, p.datetime, p.message, u.fullname FROM posts p LEFT JOIN users u ON p.postedby = u.username ORDER BY p.datetime DESC');
    $stmt->execute();

    while ($row = $stmt->fetch()) {
        echo "<div class='message'><form>";
        echo "<span class='msgtext'>" . $row["message"] . "</span><br/><div class='msginfo'>";
        $mid = $row["id"];
        echo "<input type='button' value='Reply' class=\"post-button reply-button\" onclick='submitForm(\"$mid\")'>";
        echo "<span class='senderinfo'>By " . $row["fullname"] . " (";
        echo $row["postedby"] . ") ";
        echo "on " . $row["datetime"] . "</span>&nbsp";
        echo "<span class='messageid'>[" . $row["id"] . "&nbsp";
        if($row["replyto"]!="null")
            echo "Reply to " . $row["replyto"];
        echo "]</span></div>";
        echo "</form></div>";
    }

    $dbh=null;
}
catch (PDOException $e)
{
    $dbh=null;
    print "Error!: " . $e->getMessage() . "<br/>";
    die();
}


?>

</body>
</html>
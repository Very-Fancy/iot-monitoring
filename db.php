
<?php

//DB details

$dbHost = 'localhost';

$dbUsername = 'root';

$dbPassword = 'root';

$dbName = 'hm';

//Create connection and select DB

$db = mysql_connect($dbHost, $dbUsername, $dbPassword);

if(! $db ) {
            die('Could not connect: ' . mysql_error());
         }

<?php

// for right now, I will declare the restaurant_identifier manually,
// instead of having to log in to set it
session_start();
$_SESSION['restaurant_identifier'] = "1234567890";

$servername = "localhost";
$username = "devinm";
$password = "IlikeXAMPP2";
$dbname = "mobile_menu";

// parse the encoded json object
	$post_data_as_assoc_array = json_decode(file_get_contents('php://input'), true);

// action tell which case to trigger and data holds the json object from the js file
	$action = $post_data_as_assoc_array['action'];
	$data = $post_data_as_assoc_array['data'];

// this switch will handle all AJAX requests from Manage.js
switch ($action) {
	case 1: // update database when category is saved (existing or new)
			try {

				$connection = new PDO("mysql:host=$servername;dbname=$dbname",$username,$password);
				
				// set the PDO error mode to exception
					$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

				$category_identifier = $data['category_identifier'];
				$sql_query = "";

				if ($category_identifier == "") {
					// it is a new category so give it a Unique Id
						$category_identifier = random_str(10);

					// new category ---> INSERT 
						$sql_query = "INSERT INTO food_categories (category_identifier,
						restaurant_identifier, menu_position, category_name, default_description, default_price,
						start_time, end_time, default_type)
						VALUES (:category_identifier, :restaurant_identifier, :menu_position, :category_name,
						:default_description, :default_price, :start_time, :end_time, :default_type)";
				}
				elseif (strlen($category_identifier) == 10){
					// existing category ---> UPDATE
						$sql_query = "UPDATE food_categories 
						SET restaurant_identifier = :restaurant_identifier, menu_position = :menu_position, 
						category_name = :category_name, default_description = :default_description,
						default_price = :default_price, start_time = :start_time, end_time = :end_time,
						default_type = :default_type 
						WHERE category_identifier = :category_identifier";
				}

				// prepare statement for sql_query since we have new category
					$statement = $connection->prepare($sql_query);

				// bind parameters to statement
					$statement->bindParam(':category_identifier', $category_identifier);
					$statement->bindParam(':restaurant_identifier', $restaurant_identifier);
					$statement->bindParam(':menu_position', $menu_position);
					$statement->bindParam(':category_name', $category_name);
					$statement->bindParam(':default_description', $default_description);
					$statement->bindParam(':default_price', $default_price);
					$statement->bindParam(':start_time', $start_time);
					$statement->bindParam(':end_time', $end_time);
					$statement->bindParam(':default_type', $default_type);


				// make variables for each $data[] values
					$restaurant_identifier = $_SESSION['restaurant_identifier'];
					$menu_position = $data['menu_position'];
					$category_name = $data['category_name'];
					$default_description = $data['default_description'];
					$default_price = $data['default_price'];
					$start_time = 60*$data['start_time'];
					$end_time = 60*$data['end_time'];
					$default_type = $data['default_type'];

				// execute query
					$statement->execute();

				echo $category_identifier;
			}
			catch(PDOException $exception) {
				echo $sql_query . "<br>" . $exception->getMessage();
			}

			$connection = null;
		break;
	
	default:
		# code...
		break;
}


// Generic helper functions
function random_str($length, $keyspace = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
{
    $str = '';
    $max = mb_strlen($keyspace, '8bit') - 1;
    for ($i = 0; $i < $length; ++$i) {
        $str .= $keyspace[rand(0, $max)];
    }
    return $str;
}




?>



























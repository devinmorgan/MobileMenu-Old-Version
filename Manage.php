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
				//create new PDO and set its error mode to exception
					$connection = new PDO("mysql:host=$servername;dbname=$dbname",$username,$password);
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

				/// prepare statement for sql_query AND bind parameters
					$statement = $connection->prepare($sql_query);
					$statement->bindParam(':category_identifier', $category_identifier);
					$statement->bindParam(':restaurant_identifier', $_SESSION['restaurant_identifier']);
					$statement->bindParam(':menu_position', $data['menu_position']);
					$statement->bindParam(':category_name', $data['category_name']);
					$statement->bindParam(':default_description', $data['default_description']);
					$statement->bindParam(':default_price', $data['default_price']);
					$statement->bindParam(':start_time', $data['start_time']);
					$statement->bindParam(':end_time', $data['end_time']);
					$statement->bindParam(':default_type', $data['default_type']);

				// execute query
					$statement->execute();

				echo $category_identifier;
			}
			catch(PDOException $exception) {
				echo $sql_query . "<br>" . $exception->getMessage();
			}

			$connection = null;

		break;

	case 2: // load all menu categories
			try {
				//create new PDO and set its error mode to exception
					$connection = new PDO("mysql:host=$servername;dbname=$dbname",$username,$password);
					$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);				

				$sql_query = "SELECT category_identifier, category_name, menu_position FROM food_categories
				WHERE restaurant_identifier = :restaurant_identifier ORDER BY menu_position ASC";

				// prepare statement for sql_query AND bind parameters
					$statement = $connection->prepare($sql_query);
					$statement->bindParam(':restaurant_identifier', $_SESSION['restaurant_identifier']);

				$statement->setFetchMode(PDO::FETCH_ASSOC);
				$statement->execute();
		
				echo json_encode($statement->fetchAll(),JSON_FORCE_OBJECT);
			}
			catch(PDOException $exception) {
				echo $sql_query . "<br>" . $exception->getMessage();
			}

			$connection = null;

		break;

	case 3: // updates the database with each category's menu_position
			try {
				//create new PDO and set its error mode to exception
					$connection = new PDO("mysql:host=$servername;dbname=$dbname",$username,$password);
					$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

				$sql_query = "UPDATE food_categories SET menu_position = :menu_position
				WHERE category_identifier = :category_identifier";

				// prepare statement for sql_query AND bind parameters
					$statement = $connection->prepare($sql_query);
					$statement->bindParam(':menu_position',$menu_position);
					$statement->bindParam(':category_identifier',$category_identifier);

				for ($i = 0; $i < sizeof($data); $i++) {
					$category_identifier = $data[$i]["category_identifier"];
					$menu_position = $data[$i]["menu_position"];

					$statement->execute();
				}
			}
			catch(PDOException $exception) {
				echo $sql_query . "<br>" . $exception->getMessage();
			}

			$connection = null;

		break;

	case 4: // gets necessary data to populate right sidebar with category info
			try {
				//create new PDO and set its error mode to exception
					$connection = new PDO("mysql:host=$servername;dbname=$dbname",$username,$password);
					$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

				$sql_query = "SELECT category_name, default_description, default_price, start_time,
				end_time, default_type FROM food_categories WHERE category_identifier = :category_identifier";

				// prepare statement for sql_query AND bind parameters
					$statement = $connection->prepare($sql_query);
					$statement->bindParam(':category_identifier', $data["category_identifier"]);

				$statement->setFetchMode(PDO::FETCH_ASSOC);
				$statement->execute();

				echo json_encode($statement->fetchAll(),JSON_FORCE_OBJECT);
			}
			catch(PDOException $exception) {
				echo $sql_query . "<br>" . $exception->getMessage();
			}

			$connection = null;

		break;

	case 5: // deletes a category from the database
			try {
				//create new PDO and set its error mode to exception
					$connection = new PDO("mysql:host=$servername;dbname=$dbname",$username,$password);
					$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

				$sql_query = "DELETE FROM food_categories WHERE category_identifier = :category_identifier";

				// prepare statement for sql_query AND bind parameters
					$statement = $connection->prepare($sql_query);
					$statement->bindParam(':category_identifier', $data["category_identifier"]);

				$statement->execute();
			}
			catch(PDOException $exception) {
				echo $sql_query . "<br>" . $exception->getMessage();
			}

			$connection = null;
		break;

	case 6: // create a NEW FOOD (only new) for the provided category
			try {
				//create new PDO and set its error mode to exception
					$connection = new PDO("mysql:host=$servername;dbname=$dbname",$username,$password);
					$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

				$sql_query = "SELECT default_description, default_price 
				FROM food_categories WHERE category_identifier = :category_identifier";
				// NOTE: the default photo & name will be provided in js

				// prepare statement for sql_query AND bind parameters
					$statement = $connection->prepare($sql_query);
					$statement->bindParam(':category_identifier', $data['category_identifier']);
					
				$statement->setFetchMode(PDO::FETCH_ASSOC);
				$statement->execute();
		
				echo json_encode($statement->fetchAll(),JSON_FORCE_OBJECT);
			}
			catch(PDOException $exception) {
				echo $sql_query . "<br>" . $exception->getMessage();
			}

			$connection = null;
		break;

	case 7: // save a food to the food_items database
			try {
				//create new PDO and set its error mode to exception
					$connection = new PDO("mysql:host=$servername;dbname=$dbname",$username,$password);
					$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

				$food_identifier = $data['food_identifier'];
				$sql_query = "";

				if ($food_identifier == "") {
					// it is a new food so give it a Unique Id
						$food_identifier = random_str(10);

					// new food ---> INSERT 
						$sql_query = "INSERT INTO food_items (food_identifier,
						category_identifier, photo_src, food_name, food_description, food_price,
						start_time, end_time, food_type)
						VALUES (:food_identifier, :category_identifier, :photo_src, :food_name,
						:food_description, :food_price, :start_time, :end_time, :food_type)";
				}
				elseif (strlen($food_identifier) == 10){
					// existing food ---> UPDATE
						$sql_query = "UPDATE food_items 
						SET category_identifier = :category_identifier, photo_src = :photo_src, 
						food_name = :food_name, food_description = :food_description,
						food_price = :food_price, start_time = :start_time, end_time = :end_time,
						food_type = :food_type 
						WHERE food_identifier = :food_identifier";
				}

				// prepare statement for sql_query AND bind parameters
					$statement = $connection->prepare($sql_query);
					$statement->bindParam(':food_identifier', $food_identifier);
					$statement->bindParam(':category_identifier', $data['category_identifier']);
					$statement->bindParam(':photo_src', $data['photo_src']);
					$statement->bindParam(':food_name', $data['food_name']);
					$statement->bindParam(':food_description', $data['food_description']);
					$statement->bindParam(':food_price', $data['food_price']);
					$statement->bindParam(':start_time', $data['start_time']);
					$statement->bindParam(':end_time', $data['end_time']);
					$statement->bindParam(':food_type', $data['food_type']);

				// execute query
					$statement->execute();

				echo $food_identifier;
			}
			catch(PDOException $exception) {
				echo $sql_query . "<br>" . $exception->getMessage();
			}

			$connection = null;
		break;

	case 8: // load a categories foods when a category is selected
			try {
				//create new PDO and set its error mode to exception
					$connection = new PDO("mysql:host=$servername;dbname=$dbname",$username,$password);
					$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

				$sql_query = "SELECT food_identifier, photo_src, food_name, food_description,
				food_price FROM food_items WHERE category_identifier = :category_identifier";

				// prepare statement for sql_query AND bind parameters
					$statement = $connection->prepare($sql_query);
					$statement->bindParam(':category_identifier', $data['category_identifier']);

				$statement->setFetchMode(PDO::FETCH_ASSOC);
				$statement->execute();
				
				echo json_encode($statement->fetchAll(),JSON_FORCE_OBJECT);
			}
			catch(PDOException $exception) {
					echo $sql_query . "<br>" . $exception->getMessage();
				}

			$connection = null;
		break;

	case 9: // delete the food item that is selected
			try {
				//create new PDO and set its error mode to exception
					$connection = new PDO("mysql:host=$servername;dbname=$dbname",$username,$password);
					$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

				$sql_query = "DELETE From food_items WHERE food_identifier = :food_identifier";

				// prepare statement for sql_query AND bind parameters
					$statement = $connection->prepare($sql_query);
					$statement->bindParam(':food_identifier', $data['food_identifier']);

				$statement->execute();
			}
			catch(PDOException $exception) {
				echo $sql_query . "<br>" . $exception->getMessage();
			}

			$connection = null;
		break;

	case 10: // saves photo path for a given food item
			try {
				//create new PDO and set its error mode to exception
					$connection = new PDO("mysql:host=$servername;dbname=$dbname",$username,$password);
					$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

					$sql_query = "UPDATE food_items SET photo_src = :photo_src
					WHERE food_identifier = :food_identifier";

					// prepare statement for sql_query AND bind parameters
						$statement = $connection->prepare($sql_query);
						$statement->bindParam(':photo_src', $data['photo_src']);
						$statement->bindParam(':food_identifier', $data['food_identifier']);

					$statement->execute();
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
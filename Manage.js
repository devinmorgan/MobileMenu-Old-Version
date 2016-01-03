//=================================================//
//========Visual and Aesthetic Functions==========//
//=================================================//

// GLOBAL VARIABLES
	var phpFile = "Manage.php"

	var SERVED_WITH_SEGMENT_DELIMITER = "frGaQfOMjZ";
	var SERVED_WITH_INSTRUCTION_DELIMITER = "Mh0MDYFeRb";
	var SERVED_WITH_OPTION_DELIMITER = "djhdR1D7hO";

	var UPSALES_ITEM_PRICE_PAIRS_DELIMITER = "RHVaDD0TZa";
	var UPSALES_ITEM_DELIMITER = "WlDaAcTWs4";

	var PORTIONS_ITEM_PRICE_PAIRS_DELIMITER = "NgQg2W6Dpn";
	var PORTIONS_ITEM_DELIMITER = "VxZcCo8SdT"

	var DEFAULT_FOOD_PHOTO_SRC = "http://localhost/MobileMenu/Images/no_image_available.png";
	var DEFAULT_FOOD_NAME = "Untitled Food";
	var DEFAULT_FOOD_IDENTIFIER = "";

	var DEFAULT_CATEGORY_NAME = "Untitled Category";

	var DEFAULT_SELECT_ELEMENT_VALUE = -1;

//EVENT LISTENERS
	document.addEventListener('click', function(e){
		e = e || window.event;

		var target = e.target || e.srcElement;

		clickedOutside(e,target);
		
	}, false);

	//call this whereever event.stopPropogation() is used to make sure things disappear when they are clicked outside of
		function clickedOutside(e,target)
		{
			// ensures the options drop down menu disappears as necessary
			if (target.className.indexOf("right_sidebar_options_btn") == -1)
			{
				displayNoneForClass("right_sidebar_options_dd");
			}
		}

	window.onload = (function (event) {
		
		// call any functions necessary to initialize the page onload
			loadRestaurantCategories();
		// give iFrame appropriate onload
			document.getElementById("photo_upload_iframe").onload = uploadPhotoToSever;

	});

// selecting food AND category items
	//helper functions
			function populateServedWith(served_with) {
				// 1st get the inst
				var instructions_ul = document.getElementById("instructions_ul");
				instructions_ul.innerHTML = "";
				
				// recall that served_with is an encoded string that stores inctructions
				// and all of the options associated with them
					var sw_data = served_with.split(SERVED_WITH_SEGMENT_DELIMITER);
					if (served_with.length > 20) {
						for (var i = 0; i < sw_data.length -1; i++) {
							var instruction_value = sw_data[i].split(SERVED_WITH_INSTRUCTION_DELIMITER)[0];
							var options_list = sw_data[i].split(SERVED_WITH_INSTRUCTION_DELIMITER)[1].
								split(SERVED_WITH_OPTION_DELIMITER);
							// create an instructions_li and set the input value to instruction_value
								createNewInstructionForServedWith();
								var current_instruction_li = instructions_ul.lastChild;
								var current_instruction_input = current_instruction_li.getElementsByTagName("input")[0];
								current_instruction_input.value = instruction_value;

							// create and append an option_li to the option_ul that belongs to the instruction_ul
							// as each option_li is created set its input value to option
							for (var j = 0; j < options_list.length -1; j++) {
								var current_option_li = current_instruction_li.getElementsByTagName("ul")[0].lastChild;
								var current_option_input = current_option_li.getElementsByTagName("input")[0];
								// since each Served With already has 1 options input, we only want to add 1 less
								// than the number of options
									if (j < options_list.length - 2) {
										createNewOptionForInstruction(current_option_input,true);
									}
								current_option_input.value = options_list[j];
							}
						}
					}
			}

			function populateExtrasAndSubstitutions(upsales) {
				var upsales_ul = document.getElementById("upsales_ul");
				upsales_ul.innerHTML = "";
				// recall that upsales is an encoded string that stores items and
				// their corresponding prices
					var upsales_data = upsales.split(UPSALES_ITEM_PRICE_PAIRS_DELIMITER);
					if (upsales.length > 20 ) {
						for (var i = 0; i < upsales_data.length -1; i++) {
							var item_value = upsales_data[i].split(UPSALES_ITEM_DELIMITER)[0];
							var price_value = upsales_data[i].split(UPSALES_ITEM_DELIMITER)[1];

							// create an upsales_li for each item/price pair
								createNewUpsaleItem();

							// getthe price and input elements and set their values correctly
								var upsale_li_inputs = upsales_ul.lastChild.getElementsByTagName("input");
								var item_input = upsale_li_inputs[0];
								var price_input = upsale_li_inputs[1];

								item_input.value = item_value;
								price_input.value= price_value;
						}
					}

			}

		function populatRightSidebarWithCategoryInfo(element) {
			// get all of the static HTML elements that need to be updated
				var header = document.getElementById("right_sidebar_header");
				var title_input = returnFoodOrCategoryElementForClass("title","category");
				var from_time = returnFoodOrCategoryElementForClass("from_time","category");
				var until_time = returnFoodOrCategoryElementForClass("until_time","category");
				var type_input = returnFoodOrCategoryElementForClass("food_type_select","category");

			var category_identifier = element.getAttribute("data-category-identifier");

			// category has already been saved and is in the database
				if (category_identifier !== "") {
					// result is of the form {"category_name":category_name, "default_description":default_description, ...}
						function responseFunction(result) {
							category_dict = JSON.parse(result)[0];

							// supply the necessary information to all of the HTML elements
								header.innerHTML = category_dict["category_name"];
								title_input.value = category_dict["category_name"];
								// description_textarea.value = category_dict["default_description"];
								// price_input.value = category_dict["default_price"];
								from_time.value = category_dict["start_time"];
								until_time.value = category_dict["end_time"];
								type_input.value = category_dict["category_type"];

							// fill in for all of the Served With Values
								populateServedWith(category_dict["served_with"]);

							// fill in for all of the Extras & Substitutions
								populateExtrasAndSubstitutions(category_dict["upsales"]);

							// load category's food items after the category data has loaded
								loadFoodItemsForSelectedCategory();
						}

					var action = 4;
					var data_object = {"category_identifier":category_identifier};
					ajax(action,data_object,responseFunction,"populatRightSidebarWithCategoryInfo");

				}
			// category is a +New Category; it is not in database
				else {
					// provide the right sidebar header and the category title input with
					// the NEW category's default name. This is necessary so that the NEW
					// category gets saved with a title
						title_input.value = DEFAULT_CATEGORY_NAME;
						header.innerHTML = DEFAULT_CATEGORY_NAME;
						from_time.value = DEFAULT_SELECT_ELEMENT_VALUE;
						until_time.value = DEFAULT_SELECT_ELEMENT_VALUE;
						type_input.value = DEFAULT_SELECT_ELEMENT_VALUE;

					// reset the upsales and served with lists
						document.getElementById("instructions_ul").innerHTML = "";
						createNewInstructionForServedWith();
						document.getElementById("upsales_ul").innerHTML = "";
						createNewUpsaleItem();
					
					// since the category is a new one, save it
						saveMenuCategory();
				}

		}

	function selectCategory(element) {
		// hide all tabs not related to category and show the category tab
		unselectEveryThing();
		returnFoodOrCategoryElementForClass("right_sidebar_container","category").
			style.display = "block";

		var menu_category_items = document.getElementsByClassName("left_sidebar_tab_li");
		for (var i = 0; i < menu_category_items.length;i++) {
			if (menu_category_items[i] === element) {
				menu_category_items[i].className = "left_sidebar_tab_li item item_selected";
			}
			else {
				menu_category_items[i].className = "left_sidebar_tab_li item";
			}

		}
		populatRightSidebarWithCategoryInfo(element);
	}

		// helper Functions
			function populatePortionsAndPrices(portion_prices) {
				var portions_ul = document.getElementById("portions_ul");
				portions_ul.innerHTML = "";
				// recall that portion_prices is an encoded string that stores items and
				// their corresponding prices
					var portions_data = portion_prices.split(PORTIONS_ITEM_PRICE_PAIRS_DELIMITER);
					if (portion_prices.length > 20 ) {
						for (var i = 0; i < portions_data.length -1; i++) {
							var item_value = portions_data[i].split(PORTIONS_ITEM_DELIMITER)[0];
							var price_value = portions_data[i].split(PORTIONS_ITEM_DELIMITER)[1];

							// create an portions_li for each item/price pair
								createNewPortionSize();

							// getthe price and input elements and set their values correctly
								var portions_li_inputs = portions_ul.lastChild.getElementsByTagName("input");
								var item_input = portions_li_inputs[0];
								var price_input = portions_li_inputs[1];

								item_input.value = item_value;
								price_input.value= price_value;
						}
					}
			}
		function populatRightSidebarWithFoodInfo(element)
		{
			var food_identifier = element.getAttribute("data-food-identifier");

			// food already exists in database
				if (food_identifier !== "") {

					var data_object = {"food_identifier":food_identifier};
					var action = 6;

					function responseFunction(result) {
						var food_dict = JSON.parse(result)[0];

						// set the right_sidebar_header to the food name and the title_element
							document.getElementById("right_sidebar_header").innerHTML = food_dict["food_name"];
							returnFoodOrCategoryElementForClass("title","food").value = food_dict["food_name"];

						// set the right_sidebar image to appropriate src
							document.getElementById("right_sidebar_image_wrapper").
								getElementsByTagName("img")[0].src = food_dict["photo_src"];

						// set the food_description to appropriate text
							returnFoodOrCategoryElementForClass("right_sidebar_textarea","food").value = food_dict["food_description"];

						populatePortionsAndPrices(food_dict["portion_prices"]);
					}

					ajax(action,data_object,responseFunction,"populatRightSidebarWithFoodInfo");
				}
			// food is a NEW FOOD and does not exist in the database yet 
				else {
					document.getElementById("right_sidebar_header").innerHTML = DEFAULT_FOOD_NAME;
					returnFoodOrCategoryElementForClass("title","food").value = DEFAULT_FOOD_NAME;

					// set the right_sidebar image to appropriate src
						document.getElementById("right_sidebar_image_wrapper").
							getElementsByTagName("img")[0].src = DEFAULT_FOOD_PHOTO_SRC;

					// set the food_descrtiption to appropriate text
						returnFoodOrCategoryElementForClass("right_sidebar_textarea","food").value = "";

					// clear out the portion size list AND add a blank li
						var portions_ul = document.getElementById("portions_ul");
						portions_ul.innerHTML = "";
						createNewPortionSize();
				}
			
		}
	function selectFoodObject(element)
	{

		//1st, switch the right sidebar to the food category
			var food_container = returnFoodOrCategoryElementForClass("right_sidebar_container","food");
			var category_container = returnFoodOrCategoryElementForClass("right_sidebar_container","category");

			// showRightSidebarElements();
			food_container.style.display = "block";
			category_container.style.display = "none";

		//2nd, populate the Title and the Header with name of food
			populatRightSidebarWithFoodInfo(element);

		//3rd, highlight the food with blue border AND unhighlight all other foods
			unhighlightFoodItems();
			element.className = "food_entry food_selected";

	}

// creating new food AND category functions
	function createNewMenuCategory(category_name, category_identifier, menu_position)
	{
		var categories_list = document.getElementById("menu_categories_list");
		// set parametes to default if not supplied as function arguments
			category_name = typeof category_name !== "undefined" ? category_name : "Untitled Category";
			category_identifier = typeof category_identifier !== "undefined" ? category_identifier : "";
			menu_position = typeof menu_position !== "undefined" ? menu_position : 
				categories_list.getElementsByTagName("li").length;

		// create the HTML element for the new food category
			new_category_item = document.createElement("li");

		// add relevant attriubtes to the category HTML element
			new_category_item.className = "left_sidebar_tab_li item";
			new_category_item.setAttribute("onclick","selectCategory(this)");

			// attributes that allow reording of list via drag and drop
				new_category_item.setAttribute("draggable","true");
				new_category_item.setAttribute("ondragstart","dragstart(event)");
				new_category_item.setAttribute("ondragend","dragend(event)");
				new_category_item.setAttribute("ondragover","dragover(event)");
				new_category_item.setAttribute("ondragenter","dragenter(event)");
				new_category_item.setAttribute("ondragleave","dragleave(event)");
				new_category_item.setAttribute("ondrop","drop(event)");
				new_category_item.setAttribute("data-list-index",menu_position);

			// holds the reference to the categories Id in the database
				new_category_item.setAttribute("data-category-identifier", category_identifier)

		new_category_item.innerHTML =  '<div class="menu_icon_container">'+
									  		'<div class="pseudo_content"></div>'+
										  	'<div class="pseudo_content"></div>'+
										  	'<div class="pseudo_content"></div>'+
										  	'<div class="pseudo_content"></div>'+
										  	'<div class="pseudo_content"></div>'+
										'</div>'+
										'<span class="category_name">' + category_name + '</span>';

		
		categories_list.appendChild(new_category_item);
		
		// if it is a new category auto-click it
			if (category_identifier == "")
			{
				new_category_item.click();
			}
	}
	function createNewFoodItem()
	{
		var category_li = document.querySelectorAll(".left_sidebar_tab_li.item.item_selected")[0];
		var category_identifier = category_li.getAttribute("data-category-identifier");

		// create the food item li for the category_content_list (the main feed)
			new_food_item =document.createElement("li");

		// give the food li the appropriate attributes
			new_food_item.className = "food_entry";
			new_food_item.setAttribute("onclick","selectFoodObject(this)");
			new_food_item.setAttribute("data-food-identifier",DEFAULT_FOOD_IDENTIFIER);

		new_food_item.innerHTML =   '<div class="food_item">'+
									    '<img class="food_item_img" src="'+DEFAULT_FOOD_PHOTO_SRC+'" alt="Picture of '+ DEFAULT_FOOD_NAME +'" />'+
									    '<div class="food_item_info_wrapper">'+
									        '<h4 class="food_item_title">'+ DEFAULT_FOOD_NAME +'</h4>'+
									    '</div>'+
									'</div>';
		// append food item to list
			var food_items_list = document.getElementById("category_content_list");
			food_items_list.insertBefore(new_food_item,food_items_list.firstChild);
			new_food_item.click();

		// once a new food is made it should be saved 
			saveFoodItem();
	}
	function createNewOptionForInstruction(element, is_no_event) {
        if (event.which == 13 || is_no_event === true) {
            var options_ul = element.parentElement.parentElement;
            var new_option_li = document.createElement("li");
            new_option_li.className = "options_li";
            new_option_li.innerHTML = '<label class="right_sidebar_li_label">Option </label>' +
                                      '<input type="text" onkeydown="createNewOptionForInstruction(this)"'+
                                          'class="options_input" />'+
                                      '<span class="remove_option" onclick=deleteRightSidebarListItem(this)> X</span>';
            options_ul.appendChild(new_option_li);
            new_option_li.getElementsByTagName("input")[0].focus();
        }
    }
    function createNewInstructionForServedWith() {
        var instructions_ul = document.getElementById("instructions_ul");
        var new_instruction_li = document.createElement("li");
        new_instruction_li.className = "instructions_li";
        new_instruction_li.innerHTML =  '<label class="right_sidebar_li_label">Instruction </label>'+
                                        '<input type="text" class="instruction_input" />'+
                                        '<span class="remove_right_sidebar_li" onclick=deleteRightSidebarListItem(this)> X</span>'+
                                          '<ul class="options_ul">'+
                                              '<li class="options_li">'+
                                                  '<label class="right_sidebar_li_label">Option </label>'+
                                                  '<input type="text" onkeydown="createNewOptionForInstruction(this)" class="options_input" />'+
                                                  '<span class="remove_right_sidebar_li" onclick=deleteRightSidebarListItem(this)> X</span>'+
                                              '</li>'+
                                          '</ul>';
        instructions_ul.appendChild(new_instruction_li);
    }

	function createNewUpsaleItem() {
		var upsales_ul = document.getElementById("upsales_ul");
		var new_upsale_li = document.createElement("li");
		new_upsale_li.className = "upsales_li";
		new_upsale_li.innerHTML = '<label class="right_sidebar_li_label">Item </label>'+
		                          '<input type="text" class="upsales_item_input" />'+
		                          '<label class="right_sidebar_li_label"> Price </label>'+
		                          '<input type="text" class="upsales_price_input" />'+
		                          '<span class="remove_right_sidebar_li" onclick="deleteRightSidebarListItem(this)"> X </span>';
		  
		 upsales_ul.appendChild(new_upsale_li);
	}
	function createNewPortionSize() {
		var portions_ul = document.getElementById("portions_ul");
		var new_portion_li = document.createElement("li");
		new_portion_li.className = "portions_li";
		new_portion_li.innerHTML = '<label class="right_sidebar_li_label">Size </label>'+
		                          '<input type="text" class="portions_item_input" />'+
		                          '<label class="right_sidebar_li_label"> Price </label>'+
		                          '<input type="text" class="portions_price_input" />'+
		                          '<span class="remove_right_sidebar_li" onclick="deleteRightSidebarListItem(this)"> X </span>';
		  
		 portions_ul.appendChild(new_portion_li);
	}
	function createNewFeedbackQuestion()
	{
		var feedback_question_ul = document.getElementById("feedback_Qs_list");

		var new_feedback_question = document.createElement("li");
		new_feedback_question.className = "feedback_Q_li";

		new_feedback_question.innerHTML = 	'<input type="text" class="feedback_Q_input"></input>'+
											'<span class="remove_Q" onclick="deleteFeedbackQuestion(this)"> X</span>';

		feedback_question_ul.appendChild(new_feedback_question);
	}
	function revealNewSurveyTab(element)
	{
		var tab_number = element.getAttribute("data-survey-tab");

		var diagnosis_tab_list = document.getElementsByClassName("diagnosis_tab_container");

		for (var i = 0; i < diagnosis_tab_list.length; i++)
		{
			if (diagnosis_tab_list[i].getAttribute("data-survey-tab") == tab_number)
			{
				diagnosis_tab_list[i].style.display = "block";
			}
			else
			{
				diagnosis_tab_list[i].style.display = "none";
			}
		}

	}



// deleting food AND category functions
	function deleteMenuCategory() {
		// gets the list item that will be deleted
			var category_li = document.querySelectorAll(".left_sidebar_tab_li.item.item_selected")[0];

		var category_identifier = category_li.getAttribute("data-category-identifier");

		function responseFunction(result) {
			// removes the category from the menu_categories_list AND re-evaluates menu positions
				var categories_list = document.getElementById("menu_categories_list");
				categories_list.removeChild(category_li);
				indexListItemsOfList(categories_list);

				unselectEveryThing();
		}

		var data_object = {"category_identifier":category_identifier};
		var action = 5;

		ajax(action,data_object,responseFunction,"deleteMenuCategory");

	}
	function deleteFoodItem()
	{
		// gets the list item that will be deleted AND food_identifier
			var food_li = document.querySelectorAll(".food_entry.food_selected")[0];
			var food_identifier = food_li.getAttribute("data-food-identifier");

		function responseFunction(result) {
			// removes the category from the ul (menu_categories_list)
				food_li.parentElement.removeChild(food_li);
			// resets right sidebar
				hideRightSidebarElements();
		}

		var data_object = {"food_identifier":food_identifier};
		var action = 9;

		ajax(action,data_object,responseFunction,"deleteFoodItem");
		
	}
	// used to delete Instruction/ Option pairs, Extras & Substitutions, and Portion/ Price pairs
		function deleteRightSidebarListItem(element) {
	        var ul = element.parentElement.parentElement;
	        // this doesn't work for instruction li because there is always at least
	        // 2 li elements in instructions_ul. But, with +New Served With, it doesn't
	        // really matter
	        if (ul.getElementsByTagName("li").length > 1) { 
	            var li = element.parentElement;
	            ul.removeChild(li); 
	        }
	    }
	function deleteFeedbackQuestion(element)
	{
		var li_of_question = element.parentElement;
		var index_of_li = getElementIndex(li_of_question);
		var ul_of_li = li_of_question.parentElement;

		ul_of_li.removeChild(li_of_question);
	}



// saving food AND category functions
	//helper functions
		function collectServedWithDataFromRightSidebar() {
			var instruction_ul = document.getElementsByClassName("instructions_li");
			var encoded_string = "";
			for (var i = 0; i < instruction_ul.length; i++) {
				var instruction_value = instruction_ul[i].getElementsByClassName("instruction_input")[0].value;

				// add instruction followd by instruction delimiter
					if (instruction_value != "") {
						encoded_string += instruction_value + SERVED_WITH_INSTRUCTION_DELIMITER;
					}

				var options_li = instruction_ul[i].getElementsByClassName("options_ul")[0].
					getElementsByTagName("li");
				for (var j = 0; j < options_li.length; j++) {
					var option_value = options_li[j].getElementsByClassName("options_input")[0].value;

					// add option followed by option delimiter
						if (option_value != "") {
							encoded_string += option_value + SERVED_WITH_OPTION_DELIMITER
						}
				}

				// complete this segment of the string by adding the segment delimeter
					encoded_string += SERVED_WITH_SEGMENT_DELIMITER;
			}
			return encoded_string;
		}
		function collectUpsalesDataFromRightSidebar() {
			var upsales_li = document.getElementsByClassName("upsales_li");
			var encoded_string = "";
			for (var i = 0; i < upsales_li.length; i++) {
				var input_list = upsales_li[i].getElementsByTagName("input");
				var item_value = input_list[0].value;
				var price_value = input_list[1].value;
				// add item_value AND price_value followed by delimiter
				if (item_value != "" && price_value != "") {
					encoded_string += item_value + UPSALES_ITEM_DELIMITER + price_value + UPSALES_ITEM_PRICE_PAIRS_DELIMITER;
				}
			}
			return encoded_string;
		}
	function saveMenuCategory() {
		// gets the category list item that will be "saved"
			var category_li = document.querySelectorAll(".left_sidebar_tab_li.item.item_selected")[0];
		// update the database with new info
			var category_name = escapeHtml(returnFoodOrCategoryElementForClass("title","category").value);
			var start_time = escapeHtml(returnFoodOrCategoryElementForClass("from_time","category").value);
			var end_time = escapeHtml(returnFoodOrCategoryElementForClass("until_time","category").value);
			var category_type = escapeHtml(returnFoodOrCategoryElementForClass("food_type_select","category").value);

			var category_identifier = category_li.getAttribute("data-category-identifier");
			var menu_position = getElementIndex(category_li);

		// get all of the served_with and upsales information
			var served_with = escapeHtml(collectServedWithDataFromRightSidebar());
			var upsales = escapeHtml(collectUpsalesDataFromRightSidebar());

			var category_object = {
				"category_name":category_name,
				"start_time":start_time,
				"end_time":end_time,
				"category_type":category_type,
				"category_identifier":category_identifier,
				"menu_position":menu_position,
				"served_with":served_with,
				"upsales":upsales
			};
		
			function responseFunction(result) {
				// new categories don't have a value for data-category-identifer, this gives them one AND
				// if the category aready exists, it gives them the same one...
					category_li.setAttribute("data-category-identifier",result.substring(0,10));
				// change the title of the list item in the category list (menu_categories_list)
					category_li.getElementsByTagName("span")[0].innerHTML = category_name;
					document.getElementById("right_sidebar_header").innerHTML = category_name;
			}

			var action = 1;
			ajax(action,category_object,responseFunction,"saveMenuCategory");
	}
		function collectPortionPricesFromRightSidebar() {
			var portions_li = document.getElementsByClassName("portions_li");
			var encoded_string = "";
			for (var i = 0; i < portions_li.length; i++) {
				var input_list = portions_li[i].getElementsByTagName("input");
				var item_value = input_list[0].value;
				var price_value = input_list[1].value;
				// add item_value AND price_value followed by delimiter
				if (item_value != "" && price_value != "") {
					encoded_string += item_value + PORTIONS_ITEM_DELIMITER + price_value + PORTIONS_ITEM_PRICE_PAIRS_DELIMITER;
				}
			}
			return encoded_string;
		}
	function saveFoodItem()
	{
		// gets the food li that will be "saved"
			var food_li = document.querySelectorAll(".food_entry.food_selected")[0];
		// update the database with new info
			var food_name = escapeHtml(returnFoodOrCategoryElementForClass("title","food").value);
			var photo_src = document.getElementById("right_sidebar_image_wrapper").
				getElementsByTagName("img")[0].src;
			var food_description = escapeHtml(returnFoodOrCategoryElementForClass("right_sidebar_textarea","food").value);
			var portion_prices = escapeHtml(collectPortionPricesFromRightSidebar());
			
			var food_identifier = food_li.getAttribute("data-food-identifier");
			var category_identifier = document.querySelectorAll(".left_sidebar_tab_li.item.item_selected")[0].
				getAttribute("data-category-identifier");

			var food_object = {
				"food_identifier":food_identifier,
				"category_identifier":category_identifier,
				"photo_src":photo_src,
				"food_name":food_name,
				"food_description":food_description,
				"portion_prices":portion_prices,
			};

		function responseFunction(result) {
			// new foods don't have a value for data-food-identifer, this gives them one AND
			// if the food aready exists, it gives them the same one...
				food_li.setAttribute("data-food-identifier",result.substring(0,10));

			// update the attributes of the food li according to what was saved
				food_li.getElementsByClassName("food_item_title")[0].innerHTML = food_name;
				food_li.getElementsByTagName("img")[0].src = photo_src;
			
			// update the right sidebar header with new food name
				document.getElementById("right_sidebar_header").innerHTML = food_name;
		}

			var action = 7;
			ajax(action,food_object,responseFunction,"saveFoodItem");
	}

// Functions to Load items from Database
	function loadRestaurantCategories() {
		var action = 2;
		function responseFunction(result) {
			// the result will be a JSON object of the form {"category name":"category identifer"}
				categories_list = JSON.parse(result);

			for (pointer in categories_list) {
				var category_name = categories_list[pointer]['category_name'];
				var category_identifier = categories_list[pointer]['category_identifier'];
				var menu_position = categories_list[pointer]['menu_position'];

				createNewMenuCategory(category_name, category_identifier, menu_position);
			}
		}

		ajax(action,{},responseFunction,"loadRestaurantCategories");
	}
	function loadFoodItemsForSelectedCategory() {
		// 1st clear the main food list
			document.getElementById("category_content_list").innerHTML = "";

		// 2nd get the category_identifier of the currently selected catogry
			var category_identifier = document.querySelectorAll(".left_sidebar_tab_li.item.item_selected")[0].
				getAttribute("data-category-identifier");
			var data_object = {"category_identifier":category_identifier};

		function responseFunction(result) {
			// the result will be a JSON object of the form {pointer: {dictionary} }
				foods_list = JSON.parse(result);
			for (pointer in foods_list) {
				// determine food item's attributes depending on whether it is NEW or not
					var food_identifier = foods_list[pointer]["food_identifier"];
					var photo_src = foods_list[pointer]["photo_src"];
					var food_name = foods_list[pointer]["food_name"];
					
				// create the food item li for the category_content_list (the main feed)
					new_food_item = document.createElement("li");

				// give the food li the appropriate attributes
					new_food_item.className = "food_entry";
					new_food_item.setAttribute("onclick","selectFoodObject(this)");
					new_food_item.setAttribute("data-food-identifier",food_identifier);

				new_food_item.innerHTML = 	'<div class="food_item">'+
											    '<img class="food_item_img" src="'+photo_src+'" alt="Picture of '+ food_name +'" />'+
											    '<div class="food_item_info_wrapper">'+
											        '<h4 class="food_item_title">'+ food_name +'</h4>'+
											    '</div>'+
											'</div>';
				// append food item to list
					document.getElementById("category_content_list").appendChild(new_food_item);

			}
		}

		var action = 8;
		ajax(action,data_object,responseFunction,"loadFoodItemsForSelectedCategory");
	}

// Functions that work with both Category and Food for right_sidebar
	function selectRightAndLeftSidebarTabs(element)
	{
		// displays the appropriate tab AND hides the irrelevent ones
			var tab_number = element.getAttribute("data-tab-number");
			var target_tab_class = element.getAttribute("data-tab-className");

			var tab_wrappers = document.getElementsByClassName(target_tab_class);
			for (var i = 0; i < tab_wrappers.length; i++)
			{
				if (tab_wrappers[i].getAttribute("data-tab-number") == tab_number)
				{
					tab_wrappers[i].style.display = "block";
				}
				else
				{
					tab_wrappers[i].style.display = "none";
				}
			}

		//underlines the correct tab AND un-underlines the irrelevent ones
			var tab_headers_class = element.className.split(" ")[0];
			var tab_headers = document.getElementsByClassName(tab_headers_class);
			for (var i = 0; i < tab_headers.length; i++)
			{
				if (tab_headers[i].getAttribute("data-tab-number") == tab_number)
				{
					tab_headers[i].className = tab_headers_class + " tab_selected";
				}
				else
				{
					tab_headers[i].className = tab_headers_class;
				}
			}
	}
	
	function displayOptionsMenu(element)
	{
		//grab the options DD menu of interest (there is on for categories and for foods)
			var parent_div = element.parentElement;
			var target_menu = parent_div.getElementsByClassName("right_sidebar_options_dd")[0];

		//this will togle the options DD's visibility
			var is_visilbe_dict = {true:"block",false:"none"};
			var is_visible = target_menu.style.display == "none";
			target_menu.style.display = is_visilbe_dict[is_visible];

	}

// draw performance graph on right sidebar performance tab's canvace
	// helper Functions 
		function drawGaphLineIncrements(num_gridlines)
		{
		    var canvas = document.getElementById("performance_canvas");
		    var vert_cell_dist = canvas.height/num_gridlines;
		    var graph_width = canvas.width;
		 
		    if (canvas.getContext)
		    {
		    	var ctx = canvas.getContext("2d");

			    for (var i = 0; i < num_gridlines; i++)
			    {
			        
			        ctx.beginPath();
			        ctx.moveTo(0,i*vert_cell_dist);
			        ctx.lineTo(graph_width,i*vert_cell_dist);
			        ctx.lineWidth = 1;
			        ctx.strokeStyle = "rgb(125,125,125)";
			        ctx.stroke();
			        ctx.closePath();
			    }
			    ctx.moveTo(0,0);
		    }
		}
		
		function makeLineWithDataPoints(list_of_percents)
		{
			// list is of the form [%,%,...,%] and is organized by most distant to most recent

			var canvas = document.getElementById("performance_canvas");
			var graph_width = canvas.width;
			var graph_height = canvas.height;
			var number_of_datapoints = list_of_percents.length;

			function yCoordinate(index_in_list)
			{
				return graph_height - graph_height * list_of_percents[index_in_list] *2; // x2 is because the scale is out of 50% not 100%
			}

			function xCoordinate(index_in_list)
			{
				var horz_spacing = graph_width / number_of_datapoints;
			    return (index_in_list) * horz_spacing + horz_spacing/2;
			}

			if (canvas.getContext)
			{
				var ctx = canvas.getContext("2d");

			    ctx.beginPath();
			    ctx.moveTo(xCoordinate(0), yCoordinate(0));

			    // add each data point to the path
			    for (var i = 1; i < number_of_datapoints; i++)
			    {
			    	var x_coordinate = xCoordinate(i);
			   		var y_coordinate = yCoordinate(i);
			      
			    	ctx.lineTo(x_coordinate, y_coordinate); //(x-coordinate, y-coordinate)
			    	ctx.strokeStyle = "rgb(0,0,0)";
			    	ctx.stroke();
			    }
			    ctx.closePath();
			    
			    for (var i = 0; i < number_of_datapoints; i++)
			    {
			        var x_coordinate = xCoordinate(i);
			        var y_coordinate = yCoordinate(i);
			        
			        ctx.beginPath();
			    	ctx.arc(x_coordinate, y_coordinate, 4, 0, 2 * Math.PI);
			    	ctx.fill();
			    	ctx.closePath();
			    }
			}
		}
	function drawPerformanceGraph(data_list)
	{
		//1 add faint line increments of 10%
			drawGaphLineIncrements(5);

		//2 add the path that is the graph
			makeLineWithDataPoints(data_list);
	}

// Drag and Drop to reOrganize Categories
	function dragstart (ev) 
	{
		if (ev.currentTarget.parentElement.id == "menu_categories_list")
		{
			indexListItemsOfList(ev.currentTarget.parentElement);
		}

		ev.dataTransfer.effectAllowed = "move";
		ev.dataTransfer.setData("src_position", ev.currentTarget.getAttribute("data-list-index"));
		ev.dataTransfer.setDragImage(ev.currentTarget, 0, 0);
	}

	function dragenter(ev)
	{
		ev.currentTarget.className = "left_sidebar_tab_li item drag_over";
	}

	function dragleave(ev) 
	{
		ev.currentTarget.className = "left_sidebar_tab_li item";
	}

	function dragover(ev)
	{
		ev.preventDefault();
	}
		
		function indexListItemsOfList(list_element)
		{
			var list_items = list_element.getElementsByTagName("li");

			for (var i = 0; i < list_items.length; i++)
			{
				// get the list item in the list and its position in the list
					var element = list_items[i];
					var element_position = getElementIndex(element);

				// assign the li's data-list-index attribute the value of its current position
					element.setAttribute("data-list-index",element_position);
			}
		}
	function drop(ev)
	{
		var src_position = ev.dataTransfer.getData("src_position");
		var target_position = ev.currentTarget.getAttribute("data-list-index");

		var srcObject = document.querySelectorAll('li[data-list-index="'+src_position+'"]')[0];
		var parent_list = ev.currentTarget.parentElement;

		if (src_position == target_position)
		{
			// pass, its the same element
		}
		else
		{
			parent_list.insertBefore(srcObject, ev.currentTarget);
		}
		
		unselectEveryThing();
		
	}

	function dragend(ev) {
		ev.dataTransfer.clearData("src_position");

		if (ev.currentTarget.parentElement.id == "menu_categories_list") {
			// re-evaluate the values for data-list-index
				indexListItemsOfList(ev.currentTarget.parentElement);

			// update the database with new values
				var categories_list = document.querySelectorAll("#menu_categories_list li");
				var data_object = [];
				for (var i = 0; i < categories_list.length; i++) {
					var category_identifier = categories_list[i].getAttribute("data-category-identifier");
					var menu_position = categories_list[i].getAttribute("data-list-index");

					data_object.push({"category_identifier":category_identifier,
					"menu_position":menu_position});

				}

				function responseFunction(result) {

				}

				var action = 3;
				ajax(action,data_object,responseFunction,"dragend");
		}
	  
	}
// Functions to help with food photo uploads
	// this triggers the folder browser once Change Photo is clicked
		function browsePhotos(element) {
			element.getElementsByClassName("photo_browse_input")[0].click();
		}
	// this submits the form when the user selects a file in their folder browser
		function submitNewFoodPhoto(element) {
			element.parentElement.getElementsByClassName("photo_submit_input")[0].
				click();
			element.parentElement.getElementsByClassName("photo_browse_input")[0].value = "";
		}
	// this sends the file info to the Photo_Uploads.php for processing
		function uploadPhotoToSever() {
			// 1st get the src for the photo just uploaded
			    var iFrameBody = document.getElementById('photo_upload_iframe').
			    	contentDocument.getElementsByTagName('body')[0];
			    var photo_src = JSON.parse(iFrameBody.innerHTML)[0]["file_location"];

				var food_li = document.querySelectorAll(".food_entry.food_selected")[0];
				var food_identifier = food_li.getAttribute("data-food-identifier");

				var data_object = {
					"photo_src":photo_src,
					"food_identifier":food_identifier
				};

				function responseFunction(result) {
					// change the photo src of the right sidebar
						document.getElementById("right_sidebar_image_wrapper").
							getElementsByTagName("img")[0].src = photo_src;
					// change the photo src of the food item
						food_li.getElementsByTagName("img")[0].src = photo_src;
				}

				var action = 10;
				ajax(action,data_object,responseFunction,"uploadPhotoToSever");

		}

	
//Generic Helper Functions
	function escapeHtml(text) {
		var map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
		};

		return text.replace(/[&<>"']/g, function(m) { return map[m]; });
	}
	function hideRightSidebarElements()
	{
		// clear out the inputs in right sidebar category
		document.getElementById("right_sidebar_header").innerHTML = "";
			returnFoodOrCategoryElementForClass("title","category").value = ""
			// returnFoodOrCategoryElementForClass("right_sidebar_textarea","category").value = "";
			// returnFoodOrCategoryElementForClass("price","category").value = "";
			returnFoodOrCategoryElementForClass("from_time","category").value = -1;
			returnFoodOrCategoryElementForClass("until_time","category").value = -1;
			returnFoodOrCategoryElementForClass("food_type_select","category").value = -1;
		displayNoneForClass("right_sidebar_container");
	}
	function unhighlightFoodItems()
	{
		var list = document.getElementsByClassName("food_selected");
		for (var i = 0; i < list.length; i++)
		{
			list[i].className = "food_entry";
		}
	}

	function displayNoneForClass(class_name)
	{
		var list_of_items = document.getElementsByClassName(class_name);
		for (var i = 0; i < list_of_items.length; i++)
		{
			list_of_items[i].style.display = "none";
		} 
	}
	function displayBlockForClass(class_name)
	{
		var list_of_items = document.getElementsByClassName(class_name);
		for (var i = 0; i < list_of_items.length; i++)
		{
			list_of_items[i].style.display = "block";
		}
	}

	function getElementIndex(element)
	{
    	for (var i = 0; element = element.previousElementSibling; i++);
    	return i;
	}

	function hasClass( elem, klass )
	{
	     return (" " + elem.className + " " ).indexOf( " "+klass+" " ) > -1;
	}
	function returnFoodOrCategoryElementForClass(class_name, container_type)
	{
		var right_sidebar_elements = document.getElementsByClassName(class_name);
		for (var i = 0; i < right_sidebar_elements.length; i++)
		{
			if (right_sidebar_elements[i].getAttribute("data-container-type") == container_type)
			{
				return right_sidebar_elements[i];
			}
		}
	}

	function ajax(action,data,postAjaxFunction,functionName)
	{
		if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                //uncomment this to debug
                	// alert("AJAX->" + functionName + " says:\n" + xmlhttp.responseText);
                // return any data sent back here
                	postAjaxFunction(xmlhttp.responseText);
            }
        };

        var JSON_object = {
        	"action":action,
        	"data":data
        }

        xmlhttp.open("POST",phpFile,true);
		xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xmlhttp.send(JSON.stringify(JSON_object));
	}

	function unselectEveryThing()
	{
		// remove all the drag_over class from the category li that was hovered over
			var still_highlighted_categories = document.getElementsByClassName("drag_over");
			if (still_highlighted_categories.length != 0)
			{
				still_highlighted_categories[0].className = "left_sidebar_tab_li item";
			}

			var still_highlighted_foods = document.getElementsByClassName("food_selected");
			if (still_highlighted_foods.length != 0)
			{
				still_highlighted_foods[0].className = "food_entry";
			}

		// reset the right sidebar to blank
			hideRightSidebarElements();

		// clear the center food list
			document.getElementById("category_content_list").innerHTML = "";

	}


	

















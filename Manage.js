//=================================================//
//========Visual and Aesthetic Functions==========//
//=================================================//

//EVENT LISTENERS
	document.addEventListener('click', function(e){
		e = e || window.event;

		var target = e.target || e.srcElement;

		clickedOutside(e,target);
		
	}, false);

	//call this whereever event.stopPropogation() is used to make sure things disappear when they are clicked outside of
		function clickedOutside(e,target)
		{
			var dd_menu;
			//Lower HeadBar Functions
				displayNoneForClass("same_level_dd");
		}



// selecting food AND category items
	//helper functions
		function populatRightSidebarWithCategoryInfo(element)
		{
			// get the name and index (from the left_sidebar categoreis list) of the selected category
				var category_name = element.getElementsByClassName("category_name")[0].innerHTML;
				var category_index = getElementIndex(element);

			// store the category_index number to remember which element populated the right_sidebar
				document.getElementById("right_sidebar_header").setAttribute("data-category-index",category_index);

			// set the right_sidebar_header to the name of the category
				document.getElementById("right_sidebar_header").innerHTML = category_name;
			// set the right_sidebar title input to the name of the category
				returnFoodOrCategoryElementForClass("title","category").value = category_name

		}

	function selectCategory(element)
	{

		var food_container = returnFoodOrCategoryElementForClass("right_sidebar_container","food");
		var category_container = returnFoodOrCategoryElementForClass("right_sidebar_container","category");

		food_container.style.display = "none";
		unhighlightFoodItems();
		category_container.style.display = "block";

		var menu_category_items = document.getElementsByClassName("left_sidebar_tab_li");
		for (var i = 0; i < menu_category_items.length;i++)
		{
			if (menu_category_items[i] == element)
			{
				menu_category_items[i].className = "left_sidebar_tab_li item item_selected";
				if (hasClass(menu_category_items[i].getElementsByTagName("span")[0],"category_name"))
				{
					// showRightSidebarElements();
					populatRightSidebarWithCategoryInfo(element);
				}
				else
				{
					hideRightSidebarElements();
				}
			}
			else
			{
				menu_category_items[i].className = "left_sidebar_tab_li item";
			}

		}
	}

	// helper Functions
		function populatRightSidebarWithFoodInfo(element)
		{
			// set the right_sidebar_header to the food name and the title_element
				var food_name = element.getElementsByClassName("food_entry_name")[0].innerHTML;
				document.getElementById("right_sidebar_header").innerHTML = food_name;
				returnFoodOrCategoryElementForClass("title","food").value = food_name;

			// set the right_sidebar image to appropriate src
				var food_image_src = element.getElementsByTagName("img")[0].src;
				document.getElementById("right_sidebar_image_wrapper").getElementsByTagName("img")[0].src = food_image_src;

			// set the price of the price_input appropriate price
				var food_price = element.getElementsByClassName("food_entry_price")[0].innerHTML;
				returnFoodOrCategoryElementForClass("price","food").value = food_price;

			// set the food_descrtiption to appropriate text
				var food_description = element.getElementsByClassName("food_entry_description")[0].innerHTML;
				returnFoodOrCategoryElementForClass("right_sidebar_textarea","food").value = food_description;

			// store the food_index number to remember which element populated the right_sidebar
				var food_index = getElementIndex(element);
				document.getElementById("right_sidebar_header").setAttribute("data-food-index",food_index);

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
	function createNewMenuCategory()
	{
		var categories_list = document.getElementById("menu_categories_list");
		
		new_category_item =document.createElement("li");
		new_category_item.className = "left_sidebar_tab_li item";
		new_category_item.setAttribute("onclick","selectCategory(this)");
		new_category_item.innerHTML = 	'<div class="menu_icon_container">'+
									  		'<div class="pseudo_content"></div>'+
										  	'<div class="pseudo_content"></div>'+
										  	'<div class="pseudo_content"></div>'+
										  	'<div class="pseudo_content"></div>'+
										  	'<div class="pseudo_content"></div>'+
										'</div>'+
										'<span class="category_name">Untitled Category</span>';
		categories_list.appendChild(new_category_item);
		new_category_item.click();

	}
	function createNewFoodItem()
	{
		var food_items_list = document.getElementById("category_content_list");
		
		new_food_item =document.createElement("li");
		new_food_item.className = "food_entry item";
		new_food_item.setAttribute("onclick","selectFoodObject(this)");
		new_food_item.innerHTML = 	'<img src="images/chicken_wings_hot.jpg">'+
									'<div class="food_info_wrap">'+
										'<span class="food_entry_name">Food Name</span>'+
										'<span class="food_entry_price">$12</span>'+
										'<p class="food_entry_description">This is the descroption of the food. It will go here for the manager to see</p>'+
									'</div>';
		food_items_list.appendChild(new_food_item);
		new_food_item.click();
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
	function deleteMenuCategory()
	{
		// gets the list item that will be deleted
			var categories_list = document.getElementById("menu_categories_list");
			var category_to_delete_index = document.getElementById("right_sidebar_header").getAttribute("data-category-index");
			var category_li = categories_list.getElementsByTagName("li")[category_to_delete_index];

		// removes the category from the ul (menu_categories_list)
			categories_list.removeChild(category_li);

		// hides the right_sidebar AND hides the dropdown menus
			hideRightSidebarElements();
			returnFoodOrCategoryElementForClass("right_sidebar_options_dd","category").style.display = "none";

	}
	function deleteFoodItem()
	{
		// gets the list item that will be deleted
			var food_items_list = document.getElementById("category_content_list");
			var food_to_delete_index = document.getElementById("right_sidebar_header").getAttribute("data-food-index");
			var food_li = food_items_list.getElementsByTagName("li")[food_to_delete_index];

		// removes the category from the ul (menu_categories_list)
			food_items_list.removeChild(food_li);

		// hides the right_sidebar AND hides the dropdown menus
			hideRightSidebarElements();
			returnFoodOrCategoryElementForClass("right_sidebar_options_dd","food").style.display = "none";
	}
	function deleteFeedbackQuestion(element)
	{
		var li_of_question = element.parentElement;
		var index_of_li = getElementIndex(li_of_question);
		var ul_of_li = li_of_question.parentElement;

		ul_of_li.removeChild(li_of_question);
	}



// saving food AND category functions
	// helper Functions
		function extractInfoFromRightSidebar(category_type)
		{
			// collect the data stored in the input elements
				var category_title = returnFoodOrCategoryElementForClass("title", category_type).value;
				var default_description = returnFoodOrCategoryElementForClass("right_sidebar_textarea",category_type).value;
				var default_price = returnFoodOrCategoryElementForClass("price",category_type).value;
				var default_from_time = returnFoodOrCategoryElementForClass("from_time",category_type).value;
				var default_until_time = returnFoodOrCategoryElementForClass("until_time",category_type);
				var default_food_type = returnFoodOrCategoryElementForClass("food_type_select",category_type);

			return {"title":category_title,
					"description":default_description,
					"price":default_price,
					"from_time":default_from_time,
					"until_time":default_until_time,
					"food_type":default_food_type};
		}
	function saveMenuCategory()
	{
		// gets the list item that will be "saved"
			var categories_list = document.getElementById("menu_categories_list");
			var category_to_save_index = document.getElementById("right_sidebar_header").getAttribute("data-category-index");
			var category_li = categories_list.getElementsByTagName("li")[category_to_save_index];
			var category_name_span = category_li.getElementsByTagName("span")[0]

		// change the title of the list item in the category list (menu_categories_list)
			category_name_span.innerHTML = extractInfoFromRightSidebar("category")["title"];

		category_li.click();
	}
	function saveFoodItem()
	{
		var food_items_list = document.getElementById("category_content_list");
		var food_index = document.getElementById("right_sidebar_header").getAttribute("data-food-index");
		var food_item_element = food_items_list.getElementsByTagName("li")[food_index];

		food_item_dict = extractInfoFromRightSidebar("food");
		//update database then just call food_item_element.click()
		food_item_element.getElementsByClassName("food_entry_name")[0].innerHTML = food_item_dict["title"];
		food_item_element.getElementsByClassName("food_entry_price")[0].innerHTML = food_item_dict["price"];
		food_item_element.getElementsByClassName("food_entry_description")[0].innerHTML = food_item_dict["description"];
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
		function insertAfter(newNode, referenceNode)
		{
		    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
		}
	function drop(ev)
	{
		var src_position = ev.dataTransfer.getData("src_position");
		var target_position = ev.currentTarget.getAttribute("data-list-index");

		var srcObject;
		var parent_list = ev.currentTarget.parentElement;


		var li_in_parent_list = parent_list.getElementsByTagName("li");
		for (var i = 0; i < li_in_parent_list.length; i++)
		{
			var list_item = li_in_parent_list[i];
			if (list_item.getAttribute("data-list-index") == src_position)
			{
				srcObject = list_item;
				break;
			}
		}

		if (src_position == target_position)
		{
			// pass, its the same element
		}
		else if (src_position > target_position)
		{
			//moving an item from further down the list upwards--->insertBefore
			parent_list.insertBefore(srcObject, ev.currentTarget);

		}
		else
		{
			// src_position < target_position so moving item from further up the list downwards --->insertAfter
			insertAfter(srcObject, ev.currentTarget);

		}
		
	}

	function dragend(ev)
	{
		ev.dataTransfer.clearData("src_position");

		if (ev.currentTarget.parentElement.id == "menu_categories_list")
		{
			indexListItemsOfList(ev.currentTarget.parentElement);
		}
	  
	}




	
//Generic Helper Functions
	function hideRightSidebarElements()
	{
		document.getElementById("right_sidebar_header").innerHTML = "";
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





















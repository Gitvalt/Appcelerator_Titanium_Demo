// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

//All arguments given to controller
var Reviews = [];

//open user interface
$.defaultTab.open();

//Create database object, that is used to control reading and writing data to database
var db = DB();

//Create the list in the "results" -tab
renderList();

/**
 * For every {interval} seconds we recheck the database  
 */
var interval = 5;
setInterval(renderList, (1000 * interval));




/**
 * Clear the database from all information
 */
function menu_clearDatabase(){
	
	//Create a dialog in order to confirm clearing data
	var alertDialog = Ti.UI.createAlertDialog({
		cancel: 0,
		confirm: 1,
		message: L('clear_confirm'),
		title: L('clear_confirm_title'),
		buttonNames: [L('cancel'), L('confirm')]
	});
	
	//insert eventlisteners to dialog
	alertDialog.addEventListener("click", function(e){
		
		//check which button was pressed
		if(e.index == e.source.cancel){
			console.log("Cancel reset");
		} 
		else 
		{
			//empty the "review"-table
			db.resetReviews();
			
			//redraw the review list
			renderList();
			
			console.log("Cleared the database");	
		}
	}); //ends creating eventlisteners
	
	//show dialog
	alertDialog.show();
}

/**
 * Database object containing methods for insert, select and deletion of data
 * 
 * !Hard coded parameters
 * "Table" as "review"
 * 
 * @function	db.insertReview(header, description)				Add review to database
 * @function	db.selectReviews()						Get all reviews
 * @function	db.resetReviews()						Empty review-table
 * @param	db.table							Table where data is saved
 * @return									returns db-object
 */
function DB(){
	
	var db = new Object();
	db.table = "review";
	
	//insert review
	db.insertReview = function(header, description){
		
		if(header == null || header == undefined || description == undefined || description == null){
			console.error("Review must have a description and a header!");
			return false;
		}
		
		
		var db_builder = Ti.Database.open("review_db");
		db_builder.execute(
			"INSERT INTO \'" + this.table + "\' (header, description) VALUES (\'" +  header + "\', \'" + description + "\');");
		db_builder.close();
		console.log("Insert \'" + header + "\' into table");
	};
	
	//fetch reviews
	db.selectReviews = function(){
		console.info("Begin reading the database");
		var db_builder = Ti.Database.open("review_db");
		var reader = db_builder.execute("SELECT * FROM \'" + this.table + "\'");
		var array = [];
		
		while(reader.isValidRow()){
			var review = new Object();
			review.header = reader.fieldByName('header');
			review.desc = reader.fieldByName('description');
			array.push(review);
			
			console.log(review.header + " " + review.desc);
			reader.next();	
		}
		
		db_builder.close();
		console.log("Reading database completed!");	
		return array;
	};
	
	//clear reviews
	db.resetReviews = function(){
		console.info("Begin reading the database");
		var db_builder = Ti.Database.open("review_db");
		var reader = db_builder.execute("DELETE FROM \'" + this.table + "\'");
		db_builder.close();
	};
	
	//Create table if not exists
	var database_Builder = Ti.Database.open("review_db");
	database_Builder.execute('CREATE TABLE IF NOT EXISTS ' + db.table + ' (_id INTEGER PRIMARY KEY, header TEXT, description TEXT)');
	database_Builder.close();
	
	console.log("DB created");
	
	//palautetaan objekti
	return db;
}


/**
 * Show a toast message with message $message and duration $toast_duration
 * @param	message		Message content
 * @param	toast_duration	Notification time (Ti.UI.NOTIFICATION_DURATION_*)
 */
function showToastMessage(message, toast_duration){
	
	var toast = Ti.UI.createNotification({
		message: message,
		duration: toast_duration
	});
	
	//näytetään viesti
	toast.show();
}

/**
 * Draw the list containing all reviews.
 */
function renderList(){
	
	//Check if list already has items in it
	var count = $.mainSection.items.length;
	
	//if true, remove items
	if(count > 0){
		$.mainSection.deleteItemsAt(0, count);
	}
	
	//get reviews from database
	Reviews = db.selectReviews();
	var nameList = [];
	
	//add reviews to the list
	if(Reviews.length > 0){
		
		/**
		 * Bind list elements to the listTemplate
		 */
		for (var i = 0; i < Reviews.length; i++) {
			nameList.push(
				{
					header: {text: Reviews[i].header},
					description: {text: Reviews[i].desc} ,	
					properties : {
						color: "black"
					}
				}
			);
		}
		
		$.mainSection.appendItems(nameList);
	}
	else {
		console.error("List Render: No reviews available!");
	}
}

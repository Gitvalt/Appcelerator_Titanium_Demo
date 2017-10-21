/**
 * We create a widget form that could be easily reused. 
 */
var args = $.args;
var db = DB();

/**
 * Exit from review system. Confirm with dialog that user understands that the infromation writen in header and description boxes will be lost
 * if user exits.
 */
function exitClick(){
	
	var exit = function(){
		console.log("Exit");
		var windows = Alloy.createController("index").getView();
	};
	
	//if user has started creating the review and tries to exit. Warn about losing writen data
	if($.header.value != null || $.textArea.value != null) {
		//show a simple dialog confirming that user wants to leave the page
		var alertDialog = Ti.UI.createAlertDialog({
			cancel: 0,
			exit: 1,
			buttonNames: [L("cancel"), L("exit")],
			message: L("warning_dataWillBeLost"),
			title: L("confirm_Exit")
		});
		
		alertDialog.addEventListener("click", function(e){
			switch(e.index){
				case e.source.cancel:
					console.log("Cancel");
				break;
				case e.source.exit:
					exit();
				break;
				default:
					console.log("undefined button");
				break;
			}
		});
		
		alertDialog.show();	
	} else {
		exit();
	}
}

/**
 * Get header and description from tab and save them as a object in the Review array. Also clear the form.
 */
function submitClick(){
	var textField = $.header.value;
	var textArea = $.textArea.value;
	
	//save the form data in a review object 
	var review = new Object();
	review.header = textField;
	review.description = textArea;
	
	//clear the form fields
	$.header.setValue(null);
	$.textArea.setValue(null);
	
	//save new review to the database
	db.insertReview(review.header, review.description);
	
	showToastMessage("Review added", Ti.UI.NOTIFICATION_DURATION_SHORT);
	
}

/**
 * Database object that has functions for saving, clearing and inserting reviews to the database.
 * 
 * !Hard coded parameters
 * "Table" as "review"
 * 
 * @function	db.insertReview(header, description)	insert a review to database
 * @function	db.selectReviews()						get all reviews from database
 * @function	db.resetReviews()						clear all existing reviews from table
 */
function DB(){
	var db = new Object();
	db.table = "review";
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
	
	db.resetReviews = function(){
		console.info("Begin reading the database");
		var db_builder = Ti.Database.open("review_db");
		var reader = db_builder.execute("DELETE FROM \'" + this.table + "\'");
		db_builder.close();
	};
	
	var database_Builder = Ti.Database.open("review_db");
	database_Builder.execute('CREATE TABLE IF NOT EXISTS ' + db.table + ' (_id INTEGER PRIMARY KEY, header TEXT, description TEXT)');
	database_Builder.close();
	
	console.log("DB created");
	
	return db;
}

/**
 * Show a toas message with message $message and duration $toast_duration
 */
function showToastMessage(message, toast_duration){
	var toast = Ti.UI.createNotification({
		message: message,
		duration: toast_duration
	});
	toast.show();
}
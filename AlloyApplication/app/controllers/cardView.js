// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

//Contains sent the reviews
var Reviews = [];

//open defaultview
$.defaultTab.open();

var db = DB();
db.insertReview("Hello", "descruotuib");
db.selectReviews();
db.resetReviews();
db.selectReviews();

//rerender the list every minute
setInterval(renderList, (1000 * 60));

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
			"INSERT INTO review (header, description) VALUES (\'" +  header + "\', \'" + description + "\');");
		db_builder.close();
		console.log("Insert \'" + header + "\' into table");
	};
	
	db.selectReviews = function(){
		console.info("Begin reading the database");
		var db_builder = Ti.Database.open("review_db");
		var reader = db_builder.execute("SELECT * FROM review");
		
		while(reader.isValidRow()){
			var header = reader.fieldByName('header');
			var desc = reader.fieldByName('description');
			console.log(header + " " + desc);
			reader.next();	
		}
		
		db_builder.close();
		console.log("Reading database completed!");	
	};
	
	db.resetReviews = function(){
		console.info("Begin reading the database");
		var db_builder = Ti.Database.open("review_db");
		var reader = db_builder.execute("DELETE FROM review");
		db_builder.close();
	};
	
	var database_Builder = Ti.Database.open("review_db");
	database_Builder.execute('CREATE TABLE IF NOT EXISTS review (_id INTEGER PRIMARY KEY, header TEXT, description TEXT)');
	database_Builder.close();
	
	console.log("DB created");
	
	return db;
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
	
	Reviews.push(review);
	
	//clear the form fields
	$.header.setValue(null);
	$.textArea.setValue(null);
	
	showToastMessage("Review added", Ti.UI.NOTIFICATION_DURATION_SHORT);
	
	//render the ReviewList
	renderList();
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

/**
 * Clear the currently rendered list and rerender with the updated values
 */
function renderList(){
	
	//clear the listview only if items exist
	var count = $.mainSection.items.length;
	
	if(count > 0){
		$.mainSection.deleteItemsAt(0, count);
	}
	
	var nameList = [];
	
	if(Reviews.length > 0){
		
		for (var i = 0; i < Reviews.length; i++) {
			nameList.push(
				{
					header: {text: Reviews[i].header},
					description: {text: Reviews[i].description},	
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

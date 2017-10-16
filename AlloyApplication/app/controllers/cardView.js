// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

//Contains sent the reviews
var Reviews = [];

//open defaultview
$.defaultTab.open();

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
	
	//clear the listview
	var count = $.mainSection.items.length;
	$.mainSection.deleteItemsAt(0, count);
	
	
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
		console.log("List Render: No reviews available!");
	}
}

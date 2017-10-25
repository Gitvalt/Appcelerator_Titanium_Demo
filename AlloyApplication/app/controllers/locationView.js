/**
 * @param	args				Arguments pushed to the controller on creation
 * 
 * @param	jsonURL				URL from where the location data is loaded
 * @param	fetchedLocation			Locations loaded from the jsonURL
 * 
 * @param	Map				Link to map module
 * @param	isMapAvailable			Is mapview possible to be shown
 * @param	mapView				Currently open mapview
 */
var args = $.args;
var jsonURL = 'http://student.labranet.jamk.fi/~K1967/androidCourses/dummyJSON.json';
var Map = require("ti.map");
var isMapAvailable = false;	//currently not used in anything
var fetchedLocation = null;
var mapView = null;



//open user interface
$.locationView.open();

//fetch locations from url {jsonURL} and show them in a list 
fetchJSON(jsonURL);




//Functions:

/**
 * When update option is clicked, locations are refetched from internet
 */
function refreshClick(){
	fetchJSON(jsonURL);
}

/**
 * Return's user to the main menu
 */
function toMainMenu(){
	var windows = Alloy.createController("index").getView();
	$.locationView.close();
}

/**
 * Creates and show's a notification
 * @param 	title	header of notification
 * @param	message	text content of notification
 */
function createNotification(title, message){
//show notification with id {notf_id} and content {createNotifications}	
Ti.Android.NotificationManager.notify(notf_id,
    Ti.Android.createNotification({
        contentTitle: title,
        contentText: message,
        icon: "Resources/android/images/default.png",
        contentIntent: Titanium.Android.createPendingIntent({
        	intent: Titanium.Android.createIntent({
        		url: 'app.js'
        	})
        })
    })
	);
	
	notf_id++;
}

/**
 * Handle itemclick of the locations list
 * @param	e	Event created by the click
 */
function handleItemClick(e){
	
	console.info("Handle item click!");
	
	if(e == null){
		console.error("Itemclick 'e' was empty!");
		return;
	}
	
	/**
	 * itemIndex 		- 	index of the selected element
	 * item			-	element with index {itemIndex}
	 */
	var itemIndex = e.itemIndex;
	var item = fetchedLocation[itemIndex];
	
	//get the selected element from the fetched location list
	item = fetchedLocation[itemIndex];

	//For debugging we check the found information
	console.info("Information of click: title, latitude, longitude");
	console.log(item.Title);
	console.log(item.Latitude);
	console.log(item.Longitude);

	//Creating marker for selected location
	var annotation = Map.createAnnotation({
		latitude: item.Latitude,
		longitude: item.Longitude,
		title: item.Title,
		subtitle: item.Description,
		pincolor: Ti.Map.ANNOTATION_GREEN		
	});
	
	//create a map
	var mapView = loadMap();
	
	//check if creating map worked
	if(mapView == null || mapView == undefined){
		console.error("Creating a map has failed. Map is not shown");
	    return;
	}
	
	//add created marker to the map
	mapView.addAnnotation(annotation);
	
	//center the map to the created marker
	mapView.setRegion({
		latitude: item.Latitude,
		longitude: item.Longitude,
		latitudeDelta: 0.1,
		longitudeDelta: 0.1
	});

	//hide the location list and add the map to the view
	$.listView.setVisible(false);
	$.listView_View.add(mapView);
	
	
	//update the status label and unhide the "return to list"-button
	$.returnToList_Button.setVisible(true);
	$.label.setText("Showing location: '" + item.Title + "'");
}

/**
 * Remove the map and show the locations list
 */
function returnToList(){
	//removing map
	$.listView_View.remove(mapView);
	
	//return visibilty of the list to true
	$.listView.setVisible(true);
	
	//hide "return to list"-button
	$.returnToList_Button.setVisible(false);

	//update status label
	$.label.setText("Returning to listview");
}

/**
 * @function	Create and return a map view if possible
 * @return	returns null if something fails
 */
function loadMap(){
		
	try {
		//checking if googleplayservices is enabled on this device
		var isEnabled = Map.isGooglePlayServicesAvailable();
		if(isEnabled != Map.SUCCESS){
			console.error("Not enabled");	
			return;
		}
		
		//check the current device's operation system
		if(Ti.Platform.name == "windows"){
			console.error("Map module is not supported in windows devices");
			return;
		} 
		else 
		{
			//if operation system and google play store are acceptable
			var mapview = Map.createView({
				mapType: Map.NORMAL_TYPE,
			});
		
			//save the view for deletion
			mapView = mapview;
			
			//return results
			return mapview;	
		}
	} 
	catch(error)
	{
		
		console.info("LoadMap has failed. Hint: Emulator cannot use Map module");
		console.error(error.message);
		
		//alert user about the failure
		alert("Opening map failed. Error: " + error.message);
		
	}
}


/**
 * @function	Handle received json data 
 * @desc 	As the loadJSON is a async function, the function will complete before data has been received. Therefor we wait until
 * we receive the data or a false if function fails.
 */
function handleJSON(response){
    switch(response)
    {
        case undefined:
            console.warn("App is still loading items");
        break;
    
        case false:
            console.error("Items were not found from url!");
        break;
    
        default:
			
			//get information as a ListSection
        	var list = createList(response);
        	
            //list.setHeaderTitle("Locations");
           	
           	$.listView_Section.setItems(list);
          	
            //show "completed task" Toast
		$.taskDoneNotf.show();
        break;
    }
}

/**
 * Show a Android Toast notification
 * @param	message		Content of the notification
 * @param	toast_duration	Duration the notification is shown
 */
function showToastMessage(message, toast_duration){
	var toast = Ti.UI.createNotification({
		message: message,
		duration: toast_duration
	});
	toast.show();
}

/**
 * Create a array that is shown as a list
 * @param  items 		All information tha will be added to list
 * @return 			Array containing correctly formated items for listItemTemplate 
 */
function createList(items) {
    
    var array = [];
    console.log("Found items: " + items);

    if(items == undefined){
        console.warn("Items are empty!");
        return;
    }

	if (items.length > 0) {
		for (var i = 0; i < items.length; i++) {
			/**
			 * Creating listitems for template "location_full"
			 * {bindId}: {{datatype}: "data"}
			 */
			array.push({
				header: {text: items[i].Title},
				description: {text: items[i].Description},
				latitude: {text: "Lat: " + items[i].Latitude},
				longitude: {text: "Long: " + items[i].Longitude}, 
				properties : {
					color: "black",
					borderColor: "black",
					borderWidth: "1dp",
					top: "5dp"
				}
			});
		}
    }
    

	console.log("Creating listsection");

	var ItemSection = Ti.UI.createListSection();
	ItemSection.setItems(array);
	
	$.listView.addEventListener('itemclick', function(e){
		handleItemClick(e);
	});
	
	return array;
}

/**
 * @desc			Fetch json data from location {targetURL}
 * @param 	targetURL 	URL From where data is loaded
 */
function fetchJSON(targetURL){
	
	try {
		$.label.setText("Loading locations from url started");
		console.log("Downloading data from url started");
		
        var client = Ti.Network.createHTTPClient({
            onload : function(e) {
                
            },
            onerror : function(e) {
                handleJSON(false);
            },
            onreadystatechange : function(e) {
            
                console.log("state changes!");
                
                //if http successfull, resposeData is a blob
                if (e.readyState == Ti.Network.HTTPClient.DONE) {
    
                    //get response as json
                    var locations = client.responseText;
                    var location_json = JSON.parse(locations);
                    var section;
                    
                    //print results of fetch
                    console.log("loading completed");
                    console.log(location_json);
    
                    //render location
                    var Locations = location_json["Locations"];
					
					//save values to variable
					fetchedLocation = Locations;
					
					
					$.label.setText("Loading locations have been completed");
					handleJSON(Locations);
                }
            }
        });
        client.open("GET", targetURL);
        client.send();
	} 
	catch(err)
	{
		console.error("LoadJSON failed");
		console.error(err.message);
	}
    }
    

/**
 * Avataan index näkymä. (app/views/index.xml)
 */
$.index.open();

function openFetcher(){
	
	//should warn
	
	var dialog = function(title, msg){
		var confirmSettings = Ti.UI.createAlertDialog({
			title: title,
			message: msg,
			cancel: 0,
			buttonNames: [L("cancel")]
		});
		
		confirmSettings.show();
	};
	
	//avataan näkymä locationView
	openView("locationView");
	
	/*
	//TODO!
	if(Ti.Platform.osname == "android"){
		if(Ti.Platform.Android.API_LEVEL < "25"){
			console.log(Ti.Platform.Android.API_LEVEL);
			var Map = require("ti.map");
			
			var isEnabled = Map.isGooglePlayServicesAvailable();
			if(isEnabled != Map.SUCCESS){
				console.error("Not success");	
			}
			
			dialog(L("confirm_api_lvl_title"), L("confirm_api_lvl_content"));
		} 
		else 
		{
			
		}
	} 
	else 
	{
		console.log(Ti.Platform.osname);
		dialog(L("confirm_os_title"), L("confirm_os_content"));
	}
	*/
	
	
}

function openReview(){
	openView("reviewView");
}

/**
 * Avataan uusi näkymä avaamalla kontrolleri. (app/controllers/*)
 * @param	viewName 	Kontrolleri, joka avataan
 */
function openView(viewName){
	
	if(viewName == null || viewName == undefined){
		console.error("View to be opened is undefined or empty!");
	}
	else {
		var windows = Alloy.createController(viewName).getView();
		windows.open();		
	}
}

/**
 * Avataan index näkymä. (app/views/index.xml)
 */
$.index.open();
//openFetcher();

function openFetcher(){
	//avataan näkymä locationView
	openView("locationView");
}

function openCard(){
	openView("cardView");
}

/**
 * @function				Ladataan kartta
 * @param		targetView	näkymä, jonne kartta ladataan
 */
function loadMap(targetView){
	var Map = require("ti.map");
	var mapview = Map.createView({
		mapType: Map.NORMAL_TYPE
	});
	
	targetView.add(mapview);
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
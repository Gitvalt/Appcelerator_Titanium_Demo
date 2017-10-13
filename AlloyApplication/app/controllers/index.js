/**
 * Avataan index näkymä. (app/views/index.xml)
 */
//$.index.open();

//avataan näkymä defaultView
openView("defaultView");

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
	var windows = Alloy.createController(viewName).getView();
	windows.open();
}
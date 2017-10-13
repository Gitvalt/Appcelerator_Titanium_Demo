/**
 * Open the index.xml view
 */
//$.index.open();
openView();




/**
 * @function				Loads the map
 * @param		targetView	The view where map will be loaded
 */
function loadMap(targetView){
	var Map = require("ti.map");
	var mapview = Map.createView({
		mapType: Map.NORMAL_TYPE
	});
	
	targetView.add(mapview);
}

/**
 * Testing opening new view
 */
function openView(){
	var windows = Alloy.createController('defaultView').getView();
	windows.open();
}
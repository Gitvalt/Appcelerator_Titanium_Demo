// Avataan index näkymä. (app/views/index.xml)
$.index.open();

//We open locationView.js controller
function openFetcher(){	openView("locationView");	}

function openReview(){	openView("reviewView");		}

/**
 * Open new controller (app/controllers/*)
 * @param	viewName 	Controller that is to be opened
 */
function openView(viewName){
	try {
		if(viewName == null || viewName == undefined){
			console.error("View to be opened is undefined or empty!");
		}
		else {
			var windows = Alloy.createController(viewName).getView();
			windows.open();		
		}
	} 
	catch(err){
		console.error("Opening new view has failed. viewName: " + viewName);
		console.error(err.message);	
	}
}

// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

var jsonURL = 'http://student.labranet.jamk.fi/~K1967/androidCourses/dummyJSON.json';

//haetut sijainnit
var fetchedLocation = null;

//karttanäkymä
var mapView = null;

//avataan näkymä
$.locationView.open();

/**
 * Haetaan sijaintitietoa "jsonURL" osoitteesta ja luodaan listaelementti näkymään
 */
fetchJSON(jsonURL);



//Funktiot:

/**
 * Kun "päivitys"-painiketta painetaan, ohjelma hakee sijainnit uudestaan internetistä.
 */
function refreshClick(){
	fetchJSON(jsonURL);
}

/**
 * Painike palauttaa käyttäjän aloitusnäkymään.
 */
function toMainMenu(){
	var windows = Alloy.createController("index").getView();
	$.locationView.close();
}

/**
 * Luodaan notifikaatio android laitteelle
 * @param 	title	otsikko notifikaatiolle
 * @param	message	viesti notifikaatiolle
 */
function createNotification(title, message){
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
 * Käsitellään sijaintilistan elementin painaminen
 * @param	e	Sisältää tiedot painikkeesta, jota painettiin
 */
function handleItemClick(e){
	
	if(e == null){
		console.error("Itemclick 'e' was empty!");
		return;
	}
	
	var itemIndex = e.itemIndex;
	var item;
	
	//haetaan sijainneista valittu sijainti
	item = fetchedLocation[itemIndex];
	
	//ladataan kartta
	loadMap($.mapView);
}

/**
 * Poistetaan auki oleva karttanäkymä ja palataan sijaintien listanäkymään. Lista-elementien näkyvyys palautetaan. 
 */
function returnToList(){
	//poistetaan karttanäkymä
	$.listView_View.remove(mapView);
	
	//listanäkymä näkyvyys palautetaan
	$.listView.setVisible(true);
	
	console.log("Removing mapview");
}

/**
 * @function				Ladataan kartta
 * @param		targetView	näkymä, jonne kartta ladataan
 */
function loadMap(targetView){
	
	var Map = require("ti.map");
	
	if(Ti.Platform.Android.API_LEVEL < "25"){
		
		console.log(Ti.Platform.Android.API_LEVEL);
			
		var isEnabled = Map.isGooglePlayServicesAvailable();
		if(isEnabled != Map.SUCCESS){
			console.error("Not enabled");	
		}
		
	} 
	
	var mapview = Map.createView({
		mapType: Map.NORMAL_TYPE
	});
	
	$.listView.setVisible(false);
	$.listView_View.add(mapview);
	
	//save the view for deletion
	mapView = mapview;
}


/**
 * @desc Käsitellään haettu json tiedosto. Esim. kun tietoa aletaan sivun latautuessa hakemaan, niin fetchjson vastaa jo "undefined" vaikka lataus on kesken. 
 * Kun lataus on suoritettu tai se epäonnistuu, suorittaa fetchjson tämän funktion uudestaan, mutta tällä kertää @response oikeasti sisältää vastauksen. 
 * @param {*} response 
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
 * Näytetään toast-viesti puhelimessa
 * @param	message			Toast-viesti
 * @param	toast_duration	Viestin kesto
 */
function showToastMessage(message, toast_duration){
	var toast = Ti.UI.createNotification({
		message: message,
		duration: toast_duration
	});
	toast.show();
}

/**
 * Luodaan array, joka sisältää määritellyt string elementit
 *
 * @param  items 		Kaikki listaan listävävät materiaalit
 * @return {ListView} 	Lista, jossa on luodut osiot
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
 * @desc			Haetaan määritetystä url-osoitteesta "targetURL" json-tiedosto
 * @param {string} 	targetURL 
 */
function fetchJSON(targetURL){
		
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
					
					handleJSON(Locations);
                }
            }
        });
        client.open("GET", targetURL);
        client.send();
    }
    

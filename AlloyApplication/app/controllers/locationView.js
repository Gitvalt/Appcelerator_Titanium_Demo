/**
 * @param	args				Kontrolleriin tuodut argumentit
 * 
 * @param	jsonURL				URL-osoite, josta sijainnit haetaan
 * @param	fetchedLocation		Student-palvelimelta haetut sijainnit
 * 
 * @param	Map					Linkki kartta moduuliin
 * @param	isMapAvailable		Onko karttanäkymä mahdollista
 * @param	mapView				Auki oleva karttanäkymä. Käytetään karttanäkymän sulkemisen yhteydessä
 */
var args = $.args;
var jsonURL = 'http://student.labranet.jamk.fi/~K1967/androidCourses/dummyJSON.json';
var Map = require("ti.map");
var isMapAvailable = false;
var fetchedLocation = null;
var mapView = null;



//avataan käyttöliittymä
$.locationView.open();

//Haetaan sijaintitietoa "jsonURL" osoitteesta ja luodaan listaelementti näkymään
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
	
	console.info("Handle item click!");
	
	if(e == null){
		console.error("Itemclick 'e' was empty!");
		return;
	}
	
	/**
	 * itemIndex 	- 	listan kohta, jota painettiin
	 * item			-	elementti, joka vastaa painettua listan kohtaa
	 */
	var itemIndex = e.itemIndex;
	var item = fetchedLocation[itemIndex];
	
	//haetaan sijainneista valittu sijainti
	item = fetchedLocation[itemIndex];

	//testataan toimiiko tiedon haku
	console.info("Information of click: title, latitude, longitude");
	console.log(item.Title);
	console.log(item.Latitude);
	console.log(item.Longitude);

	//Luodaan merkki, joka vastaa valittua elementtiä
	var annotation = Map.createAnnotation({
		latitude: item.Latitude,
		longitude: item.Longitude,
		title: item.Title,
		subtitle: 'Cupertino, CA',
		pincolor: Ti.Map.ANNOTATION_GREEN		
	});
	
	//luodaan kartta
	var mapView = loadMap(annotation);
	
	//lisätään merkki karttaan
	mapView.addAnnotation(annotation);
	
	//keskitetään näkymä valitun merkin kohdalle
	mapView.setRegion({
		latitude: item.Latitude,
		longitude: item.Longitude,
		latitudeDelta: 0.1,
		longitudeDelta: 0.1
	});

	//laitetaan sijaintilista piilotetuksi ja lisätään karttanäkymä listan sijalle.
	$.listView.setVisible(false);
	$.listView_View.add(mapView);
	
	
	//Päivitetään status ja piilotetaan palautusnappi
	$.returnToList_Button.setVisible(true);
	$.label.setText("Showing location: '" + item.Title + "'");
}

/**
 * Poistetaan auki oleva karttanäkymä ja palataan sijaintien listanäkymään. Lista-elementien näkyvyys palautetaan. 
 */
function returnToList(){
	//poistetaan karttanäkymä
	$.listView_View.remove(mapView);
	
	//listanäkymä näkyvyys palautetaan
	$.listView.setVisible(true);
	
	$.returnToList_Button.setVisible(false);

	//päivitetään status
	$.label.setText("Returning to listview");
}

/**
 * @function				Ladataan kartta
 * @param		targetView	näkymä, jonne kartta ladataan
 */
function loadMap(){
		
	try {
		//checking if googleplayservices is enabled on this device
		var isEnabled = Map.isGooglePlayServicesAvailable();
		
		if(isEnabled != Map.SUCCESS){
			console.error("Not enabled");	
			return;
		}
			
		if(Ti.Platform.name == "windows"){
			console.error("Map module is not supported in windows devices");
			return;
		} 
		else 
		{
			var mapview = Map.createView({
				mapType: Map.NORMAL_TYPE,
			});
		
			//save the view for deletion
			mapView = mapview;
			
			return mapview;	
		}
	} catch(error){
		console.error(error.message);
		alert("Opening map failed. Error: " + error.message);
	}
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
    

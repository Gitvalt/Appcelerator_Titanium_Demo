// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;


/**
 * Haetaan sijaintitietoa "jsonURL" osoitteesta ja luodaan listaelementti näkymään
 */
jsonURL = 'http://student.labranet.jamk.fi/~K1967/androidCourses/dummyJSON.json';

var items = fetchJSON(jsonURL);
console.info("ITEMS!!!");
console.log(items);

//avataan näkymä
$.defaultView.open();

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
            var list = createList(response);
            
            list.class = "list";
            /*
            list.fontSize = "20";
            list.height = "400";
            list.width = "200";
            */
           
            $.listView.add(list);
        break;
    }
}

/**
 * Luodaan array, joka sisältää määritellyt string elementit
 *
 * @param  items 		Kaikki listaan listävävät materiaalit
 * @return {ListView} 	Lista, jossa on luodut osiot
 */
function createList(items) {
	var ItemList = Ti.UI.createListView({
		id : "itemList"
	});
    
    var array = [];
    console.log("Found items: " + items);

    if(items == undefined){
        console.warn("Items are empty!");
        return;
    }


	if (items.length > 0) {
		for (var i = 0; i < items.length; i++) {
			array.push({
				properties : {
					title: items[i],
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

	ItemList.setSections([ItemSection]);
	return ItemList;
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
                    var locs = [];
    
                    for (var item in Locations) {
                        var name = Locations[item]["Title"];
                        console.log("name: " + name);
                        locs.push(name);     
                    }
                    
                    console.log("Locations loaded, returning");
                    console.info(locs);

                    handleJSON(locs);
                }
            }
        });
        client.open("GET", targetURL);
        client.send();
    }
    

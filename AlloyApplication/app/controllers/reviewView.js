// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

//Sisältää kaikki palautteet
var Reviews = [];

//avataan näkymä
$.defaultTab.open();

//määritetään muuttuja tietokannan lukemista varten ja luodaan lista olemassa olevista palautteista
var db = DB();
renderList();

/**
 * Uudelleen luodaan palautelista joka 15 sekuntti --> uudet tietokantaan lisätyt palautteet tulevat näkyviin
 */
setInterval(renderList, (1000 * 5));




/**
 * Tyhjennetään kaikki tieto "palaute" -taulusta
 */
function menu_clearDatabase(){
	
	//luodaan dialogi, jolla varmistetaan tietojen poistaminen
	var alertDialog = Ti.UI.createAlertDialog({
		cancel: 0,
		confirm: 1,
		message: L('clear_confirm'),
		title: L('clear_confirm_title'),
		buttonNames: [L('cancel'), L('confirm')]
	});
	
	//lisätään dialogiin painikkeen painallusta kuunteleva kuuntelija
	alertDialog.addEventListener("click", function(e){
		//tarkistetaan kumpaa painiketta on painettu
		if(e.index == e.source.cancel){
			console.log("Cancel reset");
		} 
		else 
		{
			//tyhjennetään "palaute" -taulu tietokannasta
			db.resetReviews();
			
			//uudelleenpiirretään palautelista
			renderList();
			
			console.log("Cleared the database");	
		}
	});
	
	//näytetään dialogi
	alertDialog.show();
}

/**
 * Tietokanta-objekti, jolle on määritelty metodit tiedon listäämiseen, näyttämiseen ja poistamiseen.
 * 
 * !Hard coded parameters
 * "Table" as "review"
 * 
 * @function	db.insertReview(header, description)	Lisätään palaute tietokantaan
 * @function	db.selectReviews()						Haetaan kaikki palautteet tietokannasta
 * @function	db.resetReviews()						Tyhjennetään "palaute"-taulu
 * @param		db.table								Taulu jonne tiedot tallennetaan
 */
function DB(){
	
	var db = new Object();
	db.table = "review";
	
	//lisätään palaute tietokantaan
	db.insertReview = function(header, description){
		
		if(header == null || header == undefined || description == undefined || description == null){
			console.error("Review must have a description and a header!");
			return false;
		}
		
		
		var db_builder = Ti.Database.open("review_db");
		db_builder.execute(
			"INSERT INTO \'" + this.table + "\' (header, description) VALUES (\'" +  header + "\', \'" + description + "\');");
		db_builder.close();
		console.log("Insert \'" + header + "\' into table");
	};
	
	//palautteiden hakeminen tietokannasta
	db.selectReviews = function(){
		console.info("Begin reading the database");
		var db_builder = Ti.Database.open("review_db");
		var reader = db_builder.execute("SELECT * FROM \'" + this.table + "\'");
		var array = [];
		
		while(reader.isValidRow()){
			var review = new Object();
			review.header = reader.fieldByName('header');
			review.desc = reader.fieldByName('description');
			array.push(review);
			
			console.log(review.header + " " + review.desc);
			reader.next();	
		}
		
		db_builder.close();
		console.log("Reading database completed!");	
		return array;
	};
	
	//tyhjennetään tietokanta
	db.resetReviews = function(){
		console.info("Begin reading the database");
		var db_builder = Ti.Database.open("review_db");
		var reader = db_builder.execute("DELETE FROM \'" + this.table + "\'");
		db_builder.close();
	};
	
	//Luodaan palaute taulu, jos se ei vielä ole olemassa
	var database_Builder = Ti.Database.open("review_db");
	database_Builder.execute('CREATE TABLE IF NOT EXISTS ' + db.table + ' (_id INTEGER PRIMARY KEY, header TEXT, description TEXT)');
	database_Builder.close();
	
	console.log("DB created");
	
	//palautetaan objekti
	return db;
}


/**
 * Show a toast message with message $message and duration $toast_duration
 * Näytetään viesti
 * @param	message			Näytettävä viesti
 * @param	toast_duration	Kauanko viestiä näytetään (Ti.UI.NOTIFICATION_DURATION_*)
 */
function showToastMessage(message, toast_duration){
	
	var toast = Ti.UI.createNotification({
		message: message,
		duration: toast_duration
	});
	
	//näytetään viesti
	toast.show();
}

/**
 * Poistetaan elementit jos niitä on listassa olemassa ja listään tietokannasta saadut palautteet listaan
 */
function renderList(){
	
	//tarkistetaan onko listassa jo elementtejä
	var count = $.mainSection.items.length;
	
	//jos on listassa jo elementtejä, ne poistetaan
	if(count > 0){
		$.mainSection.deleteItemsAt(0, count);
	}
	
	//haetaan palautteita tietokannasta 
	Reviews = db.selectReviews();
	var nameList = [];
	
	//lisätään palautteet näytettävään listaan
	if(Reviews.length > 0){
		
		/**
		 * sidotaan lista elementin pohjaan palautteen otsikko ja sisältö 
		 */
		for (var i = 0; i < Reviews.length; i++) {
			nameList.push(
				{
					header: {text: Reviews[i].header},
					description: {text: Reviews[i].desc} ,	
					properties : {
						color: "black"
					}
				}
			);
		}
		
		$.mainSection.appendItems(nameList);
	}
	else {
		console.error("List Render: No reviews available!");
	}
}

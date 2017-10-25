# Demo application part

Here starts the real application.

Notable information about running the app:
* Module "ti.map" requires a real phone in order to test.
* Location fetcher:
  * If fetcher fails, ensure that application looks for a existing json file. json file should have a array of objects with properties:
     * Title
     * Latitude
     * Longitude
     * Description
 * For testing in "Documents" folder there is a "DummyJSON" file that is a json file used durning application seminar.
* Because of the Indie version of the Appcelerator Studio, there can be issues with running the cloned app from this repository.
   * Solution:
     * Create a new project with appcelerator
     * Copy everything from app folder to new project
     * Add ti.map module to application
     * Add code:
     `<android xmlns:android="http://schemas.android.com/apk/res/android">
        <manifest>
            <application>
                <meta-data android:name="com.google.android.geo.API_KEY" android:value="{YOUR_GOOGLE_APIKEY}"/>
            </application>
        </manifest>
    </android>`
    to tiapp.xml 

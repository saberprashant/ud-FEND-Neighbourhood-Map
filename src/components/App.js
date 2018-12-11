import React, { Component } from 'react';
import ListLocation from './ListLocation';


class App extends Component {

	constructor(props) {
		super(props);							//to use props
		this.state = {						//to set the initial state
			'allLocations': [
				{
					'name': "Setia Stores",
					'type': "Mobile phone shop",
					'latitude': 28.671514,
					'longitude': 77.281244,
					'streetAddress': "Shop No.P-3/242 Bihari Colony, Shahdara, Delhi"
				},
				{
					'name': "Sargam Electronics",
					'type': "Shop",
					'latitude': 28.671438,
					'longitude': 77.280266,
					'streetAddress': "Market Main Road, Kanti Nagar Extension, Shahdara, Delhi"
				},
				{
					'name': "Goel's Snack Hut",
					'type': "Restaurant",
					'latitude': 28.670734,
					'longitude': 77.283892,
					'streetAddress': "2728, Gali Number 4, Block N, Bihari Colony, Shahdara"
				},
				{
					'name': "Shyam Lal College(University Of Delhi)",
					'type': "College",
					'latitude': 28.674089,
					'longitude': 77.281752,
					'streetAddress': "GT Road, Near Metro Sation, Dwarkapuri, Shahdara"
				},
				{
					'name': "DTDC - Vishwas Nagar",
					'type': "Courier Service",
					'latitude': 28.663654,
					'longitude': 77.287656,
					'streetAddress': "27/16, Pandav Rd, M.S Park, Block 17, Vishwas Nagar"
				},
				{
					'name': "Sun Heat Power System",
					'type': "Power Systems",
					'latitude': 28.669843,
					'longitude': 77.284092,
					'streetAddress': "E 699, Gandhi Street, Block N, Babarpur Village"
				},
				{
					'name': "Surya Hospital",
					'type': "Hospital",
					'latitude': 28.662963,
					'longitude': 77.285866,
					'streetAddress': "383/11C, Block E, East Krishna Nagar, Krishna Nagar"
				},
				{
					'name': "Shree Digambar Jain Mandir",
					'type': "Hindu Temple",
					'latitude': 28.670540,
					'longitude': 77.281985,
					'streetAddress': "Goverdhan Behari Colony, Block N, Bihari Colony, Shahdara"
				},
				{
					'name': "Axis Bank ATM",
					'type': "Bank ATM",
					'latitude': 28.671247,
					'longitude': 77.280643,
					'streetAddress': "KantiNagar Ext Rd, Block N, Shahdara, Delhi"
				}
			],
			'map': '',
			'infoBox': '',
			'prevmarker': ''
		};

		// retain object instance when used in the function
		this.initMap = this.initMap.bind(this);
		this.openInfoBox = this.openInfoBox.bind(this);
		this.closeInfoBox = this.closeInfoBox.bind(this);
	}

	componentDidMount() {
		// Connect the initMap() function 
		window.initMap = this.initMap;

		// Asynchronously load the Google Maps script
		loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyDLPmXhc1AvqLDek1t35R8Th9pJQ8Ij29k&callback=initMap');
	}

	/**
	 * Initialize the map when the google map script loaded
	 */
	initMap() {
		var self = this;
		let mapview = document.getElementById('map');
		mapview.style.height = window.innerHeight + "px";
		let map = new window.google.maps.Map(mapview, {
			center: { lat: 28.669801, lng: 77.282257 },
			zoom: 15,
			mapTypeControl: false
		});

		let InfoWindow = new window.google.maps.InfoWindow({});

		window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
			self.closeInfoBox();
		});

		this.setState({
			'map': map,
			'infoBox': InfoWindow
		});

		window.google.maps.event.addDomListener(window, "resize", function () {
			let center = map.getCenter();
			window.google.maps.event.trigger(map, "resize");
			self.state.map.setCenter(center);
		});

		window.google.maps.event.addListener(map, 'click', function () {
			self.closeInfoBox();
		});

		let allLocations = [];
		this.state.allLocations.forEach(function (location) {
			let longname = location.name + ' - ' + location.type;
			let marker = new window.google.maps.Marker({
				position: new window.google.maps.LatLng(location.latitude, location.longitude),
				animation: window.google.maps.Animation.DROP,
				map: map
			});

			marker.addListener('click', function () {
				self.openInfoBox(marker);
			});

			location.longname = longname;
			location.marker = marker;
			location.display = true;
			allLocations.push(location);
		});
		this.setState({
			'allLocations': allLocations
		});
	}

	/**
	 * Open the infoBox for the marker
	 * @param {object} location marker
	 */
	openInfoBox(marker) {
		this.closeInfoBox();
		this.state.infoBox.open(this.state.map, marker);
		marker.setAnimation(window.google.maps.Animation.BOUNCE);
		this.setState({
			'prevmarker': marker
		});
		this.state.infoBox.setContent('Loading Data...');
		this.state.map.setCenter(marker.getPosition());
		this.state.map.panBy(0, -200);
		this.getMarkerInfo(marker);
	}

	/**
	 * Retrive the location data from the foursquare api for the marker and display it in the infoBox
]	 */
	getMarkerInfo(marker) {
		var self = this;
		let clientId = "TPIDDHBKB2QFBWEV2MPDOFGUSWXCXGAA5IVOWEMN5ASR3UJW";
		let cSecret = "4HB1ZZJBVXC3F0BREBPSGXYK0VZ5ALS4XRNJZSBP1JROG0DE";
		let url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + cSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";

		fetch(url)
			.then(
				function (response) {
					if (response.status !== 200) {
						self.state.infoBox.setContent("Sorry, some error occured");
						return;
					}

					// Examine the text in the response
					response.json().then(function (data) {
						let location_data = data.response.venues[0];
						let verified = '<b>Verified Location: </b>' + (location_data.verified ? 'Yes' : 'No') + '<br>';
						let checkinsCount = '<b>Number of CheckIn: </b>' + location_data.stats.checkinsCount + '<br>';
						let usersCount = '<b>Number of Users: </b>' + location_data.stats.usersCount + '<br>';
						let tipCount = '<b>Number of Tips: </b>' + location_data.stats.tipCount + '<br>';
						let readMore = '<a href="https://foursquare.com/v/' + location_data.id + '" target="_blank">Read More on Foursquare Website</a>'
						self.state.infoBox.setContent(checkinsCount + usersCount + tipCount + verified + readMore);
					});
				}
			)
			.catch(function (err) {
				self.state.infoBox.setContent("Sorry data can't be loaded");
			});
	}

	/**
	 * Close the infoBox for the marker
	 */
	closeInfoBox() {
		if (this.state.prevmarker) {
			this.state.prevmarker.setAnimation(null);
		}
		this.setState({
			'prevmarker': ''
		});
		this.state.infoBox.close();
	}


	render() {
		return (
			<div>
				<ListLocation key="100" 
					allLocations={this.state.allLocations} 
					openInfoBox={this.openInfoBox}
					closeInfoBox={this.closeInfoBox} 
				/>
				<div id="map"></div>
			</div>
		);
	}
}

export default App;

/**
 * Load the google maps asynchronously
 */
function loadMapJS(src) {
	let ref = window.document.getElementsByTagName("script")[0];
	let script = window.document.createElement("script");
	script.src = src;
	script.async = true;
	script.onerror = function () {
		document.write("Some error occured. Google Maps can't be loaded");
	};
	ref.parentNode.insertBefore(script, ref);
}


// Made by Prashant Jain(@saberprashant)
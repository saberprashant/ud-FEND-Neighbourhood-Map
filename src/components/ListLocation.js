import React, { Component } from 'react';
import ItemLocation from './ItemLocation';


class ListLocation extends Component {

	constructor(props) {
		super(props);
		this.state = {
			'locations': '',
			'query': '',
			'suggestions': true,
		};

		//binding the functions
		this.filterLocations = this.filterLocations.bind(this);
		this.toggleSuggestions = this.toggleSuggestions.bind(this);
	}

	/**
	 * Filter the locations based on user's query
	 */
	filterLocations(event) {
		this.props.closeInfoBox();
		const { value } = event.target;

		let locations = [];
		this.props.allLocations.forEach(function (location) {
			if (location.longname.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
				location.marker.setVisible(true);
				locations.push(location);
			} else {
				location.marker.setVisible(false);
			}
		});

		this.setState({
			'locations': locations,
			'query': value
		});
	}

	componentWillMount() {
		this.setState({
			'locations': this.props.allLocations
		});
	}

	/**
	 * Show/hide the suggested places
	 */
	toggleSuggestions() {
		this.setState({
			'suggestions': !this.state.suggestions
		});
	}


	render() {
		var locationlist = this.state.locations.map(function (listItem, index) {
			return (
				<ItemLocation key={index} openInfoBox={this.props.openInfoBox.bind(this)} data={listItem} />
			);
		}, this);

		return (
			<div className="search-area">
				<input role="search" aria-labelledby="filter" id="search-field" className="search-box"
				type="text" placeholder="Filter places..." value={this.state.query} onChange={this.filterLocations} />
				<ul>
					{this.state.suggestions && locationlist}
				</ul>
				<button className="button" onClick={this.toggleSuggestions}>Show/Hide Suggestions</button>
			</div>
		);
	}
}

export default ListLocation;
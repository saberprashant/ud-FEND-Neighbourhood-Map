import React from 'react';


class ItemLocation extends React.Component {


	render() {
		return (
			<li role = "button" className = "box" tabIndex = "0" 
			onKeyPress = {this.props.openInfoBox.bind(this, this.props.data.marker)} 
			onClick = {this.props.openInfoBox.bind(this, this.props.data.marker)}
			>
			{this.props.data.longname}
			</li>
		);
	}
}

export default ItemLocation;
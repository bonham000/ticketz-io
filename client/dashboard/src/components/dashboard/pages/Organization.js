import React, { Component } from 'react';
import $ from 'jquery';
import '../css/Organization.css';

class Organization extends Component {
    render(){
    	return(
    		<div>
				<div className="flex-card-half">
					<h3>General</h3>
					Your organization's unique URL: <br/>
					{'ticketz.io/new-ticket' + this.props.organization.url}
				</div>

				<div className="flex-card-half">
					<h3>Users</h3>

				</div>


            </div>
        )
    }
}

export default Organization;
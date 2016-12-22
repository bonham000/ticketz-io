import React, { Component } from 'react';
import $ from 'jquery';
import '../css/Organization.css';

class Organization extends Component {
    render(){
    	return(
    		<div>
				<div className="flex-card-half">
					<h3>General</h3>
					<p style={{textAlign: "left"}}>
					Tickets may be submitted with your organization's unique information.<br />
					<b>URL: </b> {'ticketz.io/new-ticket' + this.props.organization.url}<br />
					<b>Submittal Password: </b> {this.props.organization.orgPassword}
					</p>
					
					<div className="card-divider" />


				</div>

				<div className="flex-card-half">
					<h3>Users</h3>

				</div>


            </div>
        )
    }
}

export default Organization;
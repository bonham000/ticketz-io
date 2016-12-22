import React, { Component } from 'react';
import $ from 'jquery';
import '../css/Organization.css';

class Organization extends Component {
	handleAddUserClick(){
		console.log('Im being handled')
	}

    render(){
    	var editMode = (this.props.user.role === 'owner' || this.props.user.role === 'manager') ? true : false
    	let o = this.props.organization;

    	return(
    		<div>
				<div className="flex-card-half">
					<h3>General</h3>
					<div className="card-divider" />
					<div style={{textAlign: "left"}}>
						<b>{o.orgName}</b>
						<br />
						<b>Joined: </b>{o.date}
						<br />
						<b>URL: </b> {'ticketz.io/new-ticket' + o.url}
						<br />
						<b>Submittal Password: </b> {o.orgPassword}
					</div>
				</div>



				<div className="flex-card-half">
					<h3>Sites</h3>
					<div className="card-divider" />
					{this.props.organization.sites &&
						this.props.organization.sites.map(function(site){
						return <div>{site}</div>
					})}
					{editMode &&
						<form onSubmit={(e)=>{this.props.handleAddSite(e)}}>
							<input id="site-input" type="text" placeholder="add site" />
							<button type="submit">Submit</button>
						</form>
					}
				</div>



				<div className="flex-card-half">
					<h3>Users</h3>
					<div className="card-divider" />

					{editMode && <div className="round-blue-btn" onClick={this.handleAddUserClick}>+</div>}
				</div>


            </div>
        )
    }
}

export default Organization;
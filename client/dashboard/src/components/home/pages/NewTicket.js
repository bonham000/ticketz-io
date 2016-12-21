import React from 'react';
import $ from 'jquery'

export default class NewTicket extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			organizations: []
		}
	}
	componentDidMount() {
		$.ajax({
			method: 'get',
			url: '/api/organizations/',
			success: (res) => {
				let organizations;
				if (res.length > 0) {
				 	organizations = res.reduce((orgs, org) => {
						return (orgs.indexOf(org.orgName) == -1) ? orgs.concat(org.orgName) : orgs;
					}, new Array());
				}
				this.setState({ organizations });
				console.log(this.state.organizations);
			},
			error: (res) => {
				console.log('error');
			}
		});
	}
	selectOrganization = (event) => {
		console.log(event.target.value);
		// dispatch action to load new ticket for that organization?
		// or allow user to submit the ticket here?
	}
	render() {
		return (
			<div className="form-container">
				<h1>Submit a New Ticket</h1>
				<p>Choose Your Organization Below:</p>
				{ this.state.organizations.length > 0 &&
					<select className="form-control" onChange={this.selectOrganization}>
					{this.state.organizations.map((org, idx) => {
						return <option key={idx} value={org}>{org}</option>
					})}
				</select> }
			</div>
		);
	}
};
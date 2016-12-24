import React from 'react';
import { browserHistory } from 'react-router';
import axios from 'axios';

import '../css/Find-Organization.css';

export default class NewTicketSearch extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			input: '',
			error: false,
			organizations: []
		};
	}
	componentDidMount() {
		axios.get('/api/organizations').then(response => {
			this.setState({ organizations: response.data.urls });
		}).catch(err => console.error(err));
	}
	handleChange = (event) => {
		this.setState({
			input: event.target.value,
			error: false
		});
	}
	submitRequest = (event) => {
		event.preventDefault();
		let { input, organizations } = this.state;
		if (organizations.indexOf(input) !== -1) {
			browserHistory.push(`/new/${input}`);
		} else {
			this.setState({
				error: true
			});
		}
	}
	render() {
		return (
			<div className="find-organization">
				<h3>Type in Your Organization Name Here:</h3>
				<form onSubmit={this.submitRequest} className="form-group find-organization-form">
					<input
						type="text"
						placeholder="Your Organization's Name"
						className="form-control hm-input"
						value={this.state.input}
						onChange={this.handleChange} />
					{ this.state.error && 
						<div className="alert alert-danger">
  						<strong>This organization is not entered in the system.</strong> <br />
  						Did you type the name correctly?
						</div> }
					<button type="submit" className="btn-primary hm-btn find-org-btn">Submit</button>
				</form>
			</div>
		);
	}
};
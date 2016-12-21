import React from 'react';
import { browserHistory } from 'react-router';
import axios from 'axios';

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
			let organizations = response.data.reduce((orgs, org) => {
				return (orgs.indexOf(org.orgName) === -1) ? orgs.concat(org.orgName) : orgs;
			}, []);
			this.setState({ organizations });
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
			browserHistory.push(`/new-ticket/${this.state.input}`);
		} else {
			this.setState({
				error: true
			});
		}
	}
	render() {
		return (
			<div className="form-container">
				<h3>Type in Your Organization Name Here:</h3>
				<form onSubmit={this.submitRequest} className="form-group">
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
					<button type="submit" className="btn-success hm-btn">Submit</button>
				</form>
			</div>
		);
	}
};
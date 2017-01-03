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
			<div className="small-card">
				<h3>Organization Search</h3>
				<div className="card-divider" />
				<form onSubmit={this.submitRequest} className="form-group find-organization-form">
					<input
						type="text"
						placeholder="Your Organization's Name"
						className="form-control hm-input"
						value={this.state.input}
						onChange={this.handleChange} />
					{ this.state.error && 
						<div className="error-message" style={{margin: "0 auto 10px auto"}}>
  						<strong>This organization is not entered in the system.</strong> <br />
  						Did you type the name correctly?
						</div> }
					<button type="submit" className="hm-btn find-org-btn">Submit</button>
				</form>
			</div>
		);
	}
};
import React from 'react';
import axios from 'axios';
import classnames from 'classnames';
import validator from 'email-validator';

import '../css/Ticket-Submission.css';

export default class NewTicket extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			success: false,
			complete: {},
			errors: {},
			name: '',
			email: '',
			phone: '',
			site: '',
			room: '',
			description: '',
			password: ''
		}
	}
	validateEmail = () => {
		if (!validator.validate(this.state.email)) {
			let { errors } = this.state;
			errors['email'] = true;
			this.setState({ errors });
		} else {
			let { complete } = this.state;
			complete['email'] = true;
			let { errors } = this.state;
			errors['email'] = false;
			this.setState({ errors, complete });
		};
	}
	completed = (event) => {
		if (event.target.value.length > 0) {
			let { complete } = this.state;
			complete[event.target.name] = true;
			this.setState({
				complete
			});
		}
	}
	checkInput = (event) => {
		let { errors, complete } = this.state;
		if (event.target.value.length == 0) {
			errors[event.target.name] = true;
			this.setState({ errors });
		} else if (event.target.value.length > 0) {
			errors[event.target.name] = false;
			complete[event.target.name] = true;
			this.setState({ errors, complete });
		};
	}
	handleChange = (event) => {		
		this.setState({
			[event.target.name]: event.target.value
		});
	}
	submitTicket = (event) => {
		event.preventDefault();
		let { complete } = this.state;
		let keys = Object.keys(complete);
		if (keys.length === 7) {
			let data = Object.assign({}, this.state);
			delete data.success;
		  delete data.complete;
			delete data.emailError;
			axios.post('/api/new-ticket', data).then(response => {
				console.log('success');
				this.setState({ success: true });
			}).catch(err => console.error(err));
		}
	}
	render() {
		let { complete, errors } = this.state;
		return (
			<div>
				{this.state.success ? <h1>Submission Success!</h1> :
					<div className="new-ticket">
						<h1 className="newTicketTitle">New Ticket Page for {this.props.params.organization}</h1>
						<form onSubmit={this.submitTicket} className="form-group">

							<div className={classnames("form-group", { 'has-error': errors.name, 'has-success': complete.name })}>
								<label className="ticketLabel" htmlFor="name">Your Name:</label>
								<input
									name="name"
									onBlur={this.checkInput}
									value={this.state.name}
									onChange={this.handleChange}
									className="form-control hm-input ticket-input"
									placeholder="Your Name"/>
							</div>

							{ errors.name && 
								<div className="alert alert-danger error-message">
		  						<strong>This field is required.</strong>
								</div> }
							
							<div className={classnames("form-group", { 'has-error': errors.email, 'has-success': complete.email })}>
								<label className="ticketLabel" htmlFor="email">Your Email:</label>
								<input
									name="email"
									onBlur={this.validateEmail}
									value={this.state.email}
									onChange={this.handleChange}
									className="form-control hm-input ticket-input"
									placeholder="Your Email"/>
							</div>

							{ errors.email && 
								<div className="alert alert-danger error-message">
		  						<strong>Your email is invalid.</strong>
								</div> }

							<div className={classnames("form-group", { 'has-success': complete.phone })}>
								<label className="ticketLabel" htmlFor="phone">Your Phone:</label>
								<input
									name="phone"
									onBlur={this.completed}
									value={this.state.phone}
									onChange={this.handleChange}
									className="form-control hm-input ticket-input"
									placeholder="Your Phone"/>
							</div>
							
							<div className={classnames("form-group", { 'has-success': complete.site })}>
								<label className="ticketLabel" htmlFor="site">Your Work Site:</label>
								<input
									name="site"
									onBlur={this.completed}
									value={this.state.site}
									onChange={this.handleChange}
									className="form-control hm-input ticket-input"
									placeholder="Site"/>
							</div>
							
							<div className={classnames("form-group", { 'has-success': complete.room })}>
								<label className="ticketLabel" htmlFor="room">Room:</label>
								<input
									name="room"
									onBlur={this.completed}
									value={this.state.room}
									onChange={this.handleChange}
									className="form-control hm-input ticket-input"
									placeholder="Room"/>
							</div>
							
							<div className={classnames("form-group", { 'has-error': errors.description, 'has-success': complete.description })}>
								<label className="ticketLabel" htmlFor="description">Please Describe Your Problem:</label>
								<textarea
									name="description"
									onBlur={this.checkInput}
									value={this.state.description}
									onChange={this.handleChange}
									className="form-control problem-description"
									id="description"
									placeholder="Problem Description">
								</textarea>
							</div>

							{ errors.description && 
								<div className="alert alert-danger error-message">
		  						<strong>This field is required.</strong>
								</div> }						

							<div className={classnames("form-group", { 'has-error': errors.password, 'has-success': complete.password })}>
								<label className="ticketLabel" htmlFor="room">Enter Your Organization's Password:</label>
								<input
									name="password"
									onBlur={this.checkInput}
									value={this.state.password}
									onChange={this.handleChange}
									className="form-control hm-input ticket-input"
									placeholder="Organization Password"/>
							</div>

							{ errors.password && 
								<div className="alert alert-danger error-message">
		  						<strong>You must enter your organization's password.</strong>
								</div>}

							<button type="submit" className="btn-primary hm-btn btn-lg" id="btn-submit">Submit Ticket</button>
						</form>
				</div>}
				
			</div>
		);
	}
};
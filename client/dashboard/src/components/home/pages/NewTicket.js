import React from 'react';
import axios from 'axios';
import classnames from 'classnames';
import validator from 'email-validator';
import $ from 'jquery';

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
			select: 'default',
			sites: [],
			room: '',
			description: '',
			password: ''
		}
	}
	componentDidMount() {
		axios.post('/api/organization-sites', {org: this.props.params.organization}).then(response => {
			let sites = (response.data.sites.length > 0) ? response.data.sites : ['Default Site'];
			this.setState({ sites });
		}).catch(err => console.log(err));
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
		let { errors } = this.state;
		errors[event.target.name] = false;
		this.setState({
			[event.target.name]: event.target.value,
			errors
		});
	}
	handleSelect = (event) => {
		let { errors, complete } = this.state;
		if (event.target.value !== 'default') {
			errors.site = false;
			complete.site = true;
		};
		this.setState({
			select: event.target.value,
			errors,
			complete
		});
	}
	reset = () => {
		this.setState({
			success: false,
			complete: {},
			errors: {},
			name: '',
			email: '',
			phone: '',
			select: 'default',
			room: '',
			description: '',
			password: ''
		});
	}
	submitTicket = (event) => {
		event.preventDefault();
		let { errors, complete } = this.state;
		let state = Object.assign({}, this.state);
		if (state.name == '') errors.name = true;
		if (state.email == '') errors.email = true;
		if (state.phone == '') errors.phone = true;
		if (state.select == 'default') errors.site = true;
		if (state.room == '') errors.room = true;
		if (state.description == '') errors.description = true;
		if (state.password == '') errors.password = true;
		this.setState({ errors });

		let keys = Object.keys(complete);
		if (keys.length === 7) {
			let data = Object.assign({}, this.state);
			delete data.success;
		  delete data.complete;
			delete data.errors;
			delete data.sites;
			let site = data.select;
			data.site = site;
			delete data.select;
			axios.post(`/api/new-ticket/${this.props.params.organization}`, data).then(response => {
				this.setState({ success: true });
				$("html, body").animate({ scrollTop: 0 }, "slow");	
			}).catch(error => {
				errors.authorized = true;
				this.setState({ errors });
			});
		}
	}
	render() {
		let { complete, errors } = this.state;
		return (
			<div>
				{this.state.success ? <div className='small-card'>
					<h3>Your ticket was submitted!</h3>
					<div className="card-divider" />
					<button className='hm-btn' id='ticket_reset' onClick={this.reset}>Submit Another Ticket</button>
				</div> :
					<div className="small-card">
						<h3 className="newTicketTitle">New Ticket</h3>
						<div className="card-divider" />
						<form onSubmit={this.submitTicket} className="form-group">

							<div className={classnames("form-group", { 'has-error': errors.name, 'has-success': complete.name })}>
								<input
									name="name"
									onBlur={this.checkInput}
									value={this.state.name}
									onChange={this.handleChange}
									className="form-control hm-input"
									placeholder="Your Name"/>
							</div>

							{ errors.name && 
								<div className="error-message">
		  						<strong>This field is required.</strong>
								</div> }
							
							<div className={classnames("form-group", { 'has-error': errors.email, 'has-success': complete.email })}>
								<input
									name="email"
									onBlur={this.validateEmail}
									value={this.state.email}
									onChange={this.handleChange}
									className="form-control hm-input"
									placeholder="Your Email"/>
							</div>

							{ errors.email && 
								<div className="error-message">
		  						<strong>Your email is invalid.</strong>
								</div> }

							<div className={classnames("form-group", { 'has-success': complete.phone })}>
								<input
									name="phone"
									onBlur={this.checkInput}
									value={this.state.phone}
									onChange={this.handleChange}
									className="form-control hm-input"
									placeholder="Your Phone"/>
							</div>

							{ errors.phone && 
								<div className="error-message">
		  						<strong>Your phone is required.</strong>
								</div> }
							
							<div className={classnames("form-group", { 'has-success': complete.site })}>
								<select value={this.state.select} onChange={this.handleSelect} name="siteSelecter" className="form-control hm-input site-selector">
									<option value="default">Select Your Work Site</option>
									{this.state.sites.map((site, i) => <option value={site} key={i}>{site}</option> )}
								</select>
							</div>

							{ errors.site && 
								<div className="error-message">
		  						<strong>You must select a site.</strong>
								</div> }
							
							<div className={classnames("form-group", { 'has-success': complete.room })}>
								<input
									name="room"
									onBlur={this.checkInput}
									value={this.state.room}
									onChange={this.handleChange}
									className="form-control hm-input"
									placeholder="Room"/>
							</div>

							{ errors.room && 
								<div className="error-message">
		  						<strong>Your room is required.</strong>
								</div> }
							
							<div className={classnames("form-group", { 'has-error': errors.description, 'has-success': complete.description })}>
								<textarea
									name="description"
									onBlur={this.checkInput}
									value={this.state.description}
									onChange={this.handleChange}
									className="form-control hm-input"
									id="description"
									placeholder="Please describe your problem.">
								</textarea>
							</div>

							{ errors.description && 
								<div className="error-message">
		  						<strong>This field is required.</strong>
								</div> }						

							<div className={classnames("form-group", { 'has-error': errors.password, 'has-success': complete.password })}>
								<input
									name="password"
									onBlur={this.checkInput}
									value={this.state.password}
									onChange={this.handleChange}
									className="form-control hm-input"
									placeholder="Organization Password"/>
							</div>

							{ errors.password && 
								<div className="error-message">
		  						<strong>You must enter your organization's password.</strong>
								</div>}

							{ errors.authorized && 
								<div className="error-message">
		  						<strong>Your password was incorrect.</strong>
								</div>}

							<button type="submit" className="hm-btn submit-ticket-btn-pad" id="btn-submit">Submit Ticket</button>
						</form>
				</div>}
				
			</div>
		);
	}
};
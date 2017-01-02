import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import $ from 'jquery';
import axios from 'axios'

class Signup extends Component {
	constructor(){
		super();
		this.state = {
			valid: false,
			domain: '',
			emailRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		}
	}
	checkDomain(e){
		//ownerEmail
		if (!e.target.value.match(this.state.emailRegex)) {
			$('#org-email-flash').html('Invalid email address').css('color', 'red')
			this.setState({valid: false})
		} else {
			var domain = e.target.value.slice(e.target.value.indexOf('@') + 1)
			$('#org-email-flash').html('<i class="fa fa-circle-o-notch fa-spin"></i>').css('color', 'black');
			axios.get('/api/checkdomain/' + e.target.value).then((response) => {
					this.setState({valid: true, domain: domain});
					$('#org-email-flash').html('<i class="fa fa-check" /> Email is available!').css('color', 'green');
			}).catch((err) => {
				this.setState({valid: false});
				$('#org-email-flash').html('<i class="fa fa-times" /> Email is taken.').css('color', 'red');
			});
		}
	}
	handleSubmit(e){
		e.preventDefault();
		let markInvalid = (el) => document.getElementById(el).style.border = "1px solid red";

		//puts all the form data into an object
		let data = {}
		function valOf(id) {return document.getElementById(id).value}
		const fields = ['ownerName', 'ownerEmail', 'ownerPassword', 'confirmPassword', 'orgName', 'orgPassword']
		for (let i = 0; i < fields.length; i++) {
			data[fields[i]] = (valOf(fields[i]))
			document.getElementById(fields[i]).style.border = '1px solid #273135'
		}

		//form validation
		if (!this.state.domain) {
			markInvalid('ownerEmail')
			return;
		}

		//ownerName
		if (!data.ownerName) {
			markInvalid('ownerName')
			return;
		}

		//ownerEmail
		if (!data.ownerEmail.match(this.state.emailRegex)) {
			markInvalid('ownerEmail')
			return;
		}
		//ownerPassword
		if (data.ownerPassword.length < 8) {
			markInvalid('ownerPassword')
			markInvalid('confirmPassword')
			return;
		}
		//confirmPassword
		if (data.confirmPassword !== data.ownerPassword){
			markInvalid('ownerPassword')
			markInvalid('confirmPassword')
			return;
		}
		//orgName
		if (!data.orgName) {
			markInvalid('orgName')
			return;
		}
		//orgPassword
		if (!data.orgPassword) {
			markInvalid('orgPassword')
			return;
		}

		axios.post('/api/createorg', data).then((response) => {
			document.getElementById('signup-form').reset()
			$('.error-flash').html('Registering successful! You are being redirected...').css('color', 'green')
			axios.post('/api/login', { username: data.ownerEmail, password: data.ownerPassword }).then(res => {
				browserHistory.push('/dashboard');
			}).catch(err => console.log(err));
		}).catch((err) => {
			$('.error-flash').html('Server Unavailable.').css('color', 'red')
		});

	}
	render(){
		return (
			<div className="form-container">
				<form method="post" id="signup-form" onSubmit={(e)=>this.handleSubmit(e)}>
					<h3>Make work easier now.</h3>
					<input type="text" id="ownerName" className="hm-input" placeholder="Account owner's name" />
					<input type="text" id="ownerEmail" className="hm-input" placeholder="Account owner's email" onBlur={(e)=>this.checkDomain(e)}/>
					<h6 id="org-email-flash">Must be a unique domain</h6><br />

					<input type="password" id="ownerPassword" className="hm-input" placeholder="Password" />
					<input type="password" id="confirmPassword" className="hm-input" placeholder="Confirm password" />
					<h6>Must contain at least 8 characters</h6><br />

					<input type="text" id="orgName" className="hm-input" placeholder="Name of organization" />
					<input type="text" id="orgPassword" className="hm-input" placeholder="Organization password" />
					<h6>For security, this password will be required every time someone attempts to submit a ticket</h6>
					<button className="hm-btn" type="submit" id="authenticate-btn">Submit</button>
					<div className="error-flash"></div>
				</form>
			</div>
		)
	}
}

export default Signup
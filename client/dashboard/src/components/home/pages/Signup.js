import React, { Component } from 'react';
import $ from 'jquery';

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
		$('#org-email-flash').html('<i class="fa fa-circle-o-notch fa-spin"></i>').css('color', 'black')
		$.ajax({
			method: 'get',
			url: '/api/checkdomain/' + e.target.value,
			success: (res)=>{
				this.setState({valid: true, domain: domain})
				$('#org-email-flash').html('<i class="fa fa-check" /> Email is available!').css('color', 'green')
			},
			error: (res)=>{
				this.setState({valid: false})
				$('#org-email-flash').html('<i class="fa fa-times" /> Email is taken.').css('color', 'red')
			}
			})
		}
	}
	handleSubmit(e){
		e.preventDefault();
		function markInvalid(el){
			document.getElementById(el).style.border = "1px solid red";
		}

		//puts all the form data into an object
		let data = {}
		function valOf(id) {return document.getElementById(id).value}
		const fields = ['ownerName', 'ownerEmail', 'ownerPassword', 'confirmPassword', 'orgName', 'orgPassword']
		for (let i = 0; i < fields.length; i++) {
			data[fields[i]] = (valOf(fields[i]))
			document.getElementById(fields[i]).style.border = '1px solid #273135'
		}


		//form validation
		if (this.state.domain){
			this.setState({valid: true})
		} else {
			markInvalid('ownerEmail')
		}
		//ownerName
		if (!data.ownerName) {
			markInvalid('ownerName')
			this.setState({valid: false})
		}

		//ownerEmail
		if (!data.ownerEmail.match(this.state.emailRegex)) {
			markInvalid('ownerEmail')
			this.setState({valid: false})
		}
		//ownerPassword
		if (data.ownerPassword.length < 8) {
			this.setState({valid: false})
			markInvalid('ownerPassword')
			markInvalid('confirmPassword')
		}
		//confirmPassword
		if (data.confirmPassword !== data.ownerPassword){
			this.setState({valid: false})
			markInvalid('ownerPassword')
			markInvalid('confirmPassword')
		}
		//orgName
		if (!data.orgName) {
			this.setState({valid: false})
			markInvalid('orgName')
		}
		//orgPassword
		if (!data.orgPassword) {
			this.setState({valid: false})
			markInvalid('orgPassword')
		}

		if (this.state.valid){

			$.ajax({
				method: 'post',
				url: '/api/createorg',
				data: data,
				success: (res)=>{
					document.getElementById('signup-form').reset()
					$('.error-flash').html('Success! You can now log in.').css('color', 'green')
				},
				error: (res)=>{
					$('.error-flash').html('Server Unavailable.').css('color', 'red')
				}
			});

			$('#org-email-flash').html('Must be a unique domain').css('color', 'black');
		}
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
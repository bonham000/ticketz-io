import React, { Component } from 'react';
import '../css/Settings.css';
import $ from 'jquery';


class Settings extends Component {
	handleClick(){
		$('.error-flash').html('<i class="fa fa-circle-o-notch fa-spin" />').css('color', 'black')
		let p1 = document.getElementById('new-password').value;
		let p2 = document.getElementById('confirm-password').value;
		if (p1 !== p2) $('.error-flash').text('Passwords do not match.').css('color', 'red');
		else {
			$.ajax({
				method: 'PUT',
				url: '/api/updatepassword',
				contentType: 'application/json',
				data: JSON.stringify({password: p2}),
				success: ()=>{
					$('.error-flash').text('Successfully Updated.').css('color', 'green');
				}
			})
		}
	}
	render(){
		return (
			<div className="small-card">
				<h3>Settings</h3>
				<h4>Reset Password</h4>
				<input type="password" id="new-password" className="form-control" placeholder="New Password" />
				<input type="password" id="confirm-password" className="form-control" placeholder="Confirm Password" />
				<button type="submit" id="reset-password-btn" className="btn btn-success" onClick={this.handleClick}>Reset</button>
				<div className="error-flash" />
			</div>
		)
	}
}

export default Settings;
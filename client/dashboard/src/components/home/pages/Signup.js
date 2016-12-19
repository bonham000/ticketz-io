import React, { Component } from 'react';

class Signup extends Component {
	render(){
		return (
	<div className="form-container">
		<form method="post" action="/api/signup" id="signup-form">
			<h3>Sign up</h3>
			<input type="text" id="ownerName" className="hm-input" placeholder="Account owner's name" />
			<input type="text" id="ownerEmail" className="hm-input" placeholder="Account owner's email" />
			<input type="password" id="ownerPassword" className="hm-input" placeholder="Password" />
			<input type="password" id="confirmrPassword" className="hm-input" placeholder="Confirm password" />
			<h6>Please use at least 6 characters</h6><br />

			<input type="text" id="orgName" className="hm-input" placeholder="Name of organization" />
			<input type="text" id="orgPassword" className="hm-input" placeholder="Organization password" />
			<h6>For security, this password will be required every time someone attempts to submit a ticket</h6>
			<button className="hm-btn" type="submit" id="authenticate-btn">Submit</button>
		</form>
	</div>
		)
	}
}

export default Signup
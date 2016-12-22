import React, { Component } from 'react';

class Login extends Component {
	render(){
		return (
        <div className="form-container">

            <h3>Login</h3>
            <form action="/api/login" method="post">
                <input type="text" name="username" className="hm-input" placeholder="email" />
                <input type="password" name="password" className="hm-input" placeholder="password" />
                <button className="hm-btn" type="submit">Log in</button>
            </form>

            <br />

            <p style={{"textAlign": "center"}}>
            <b>DEMO login</b><br />
            username: demo.user@live.com<br />
            password: password
            </p>

        </div>
		)
	}
}

export default Login
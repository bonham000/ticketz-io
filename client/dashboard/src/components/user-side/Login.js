import React, { Component } from 'react';

class Login extends Component {
    render(){
        return (
            <div id="form-container">
                <h4 className="heading">Admin Login</h4>
                <form id='login-form' action="/api/login" method="post">
                    <div className="form-group">
                        <div className="input-group">
                            <div className="input-group-addon">
                                <i className="fa fa-user" />
                            </div>
                            <input type="text" name="username" className="form-control" placeholder="username" />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-group">
                            <div className="input-group-addon">
                                <i className="fa fa-key" />
                            </div>
                            <input type="password" name="password" className="form-control" placeholder="password" />
                        </div>
                    </div>
                    <input className="btn btn-success form-submit" type="submit" value="Log in" id="authenticate-btn" />
                </form>
                <br />
                <p style={{"text-align": "center"}}>
                <b>DEMO login</b><br />
                username: admin<br />
                password: admin
                </p>
            </div>
        )
    }
}

export default Login;
import React, { Component } from 'react';
import {Link} from 'react-router';
import './css/App.css';

class App extends Component {
	render(){
	   return (
    		<div>
    			<div id="hm-navbar">
            		<Link to="/" id="topbar-logo"><img src="/images/logo.svg" id="topbar-logo-img" className="hm-logo"/></Link>
    			</div>
    			<div className="hm-container">
    				{this.props.children}
    			</div>



                <div className="footer-container">
                    <div>
                        <div><b>Ticket Actions</b></div>
                        <Link to="/new">New Ticket</Link><br/>
                        <Link to="/status">Check Status</Link>
                    </div>

                    <div>
                        <div><b>Admin Actions</b></div>
                        <Link to="/dashboard">Dashboard</Link><br/>
                        <Link to="/dashboard/tickets">Tickets</Link><br/>
                        <Link to="/dashboard/organization">Organization</Link>
                    </div>

                    <div>
                        <b><Link to="/signup">Sign Up!</Link></b><br/><br/>
                    </div>

                    <div>
                        <b>Ticketz.io</b><br/>
                        <a href="https://www.linkedin.com/in/ethanrose0/" target="_blank">Ethan Rose</a><br/>
                        Sean Smith<br/><br/>
                        &copy;2016-2017
                    </div>

                </div>    		

    		</div>
		);
	}
};



export default App
import React, { Component } from 'react';
import {Link} from 'react-router';
import './css/App.css';

class App extends Component {
	render(){
	   return (
    		<div>
    			<div id="hm-navbar">
            		<Link to="/"><div className="hm-btn" id="hm-home-btn"><i className="fa fa-home" /></div></Link>
                    <button className="hm-btn" id="hm-track-ticket-btn">Track Ticket</button>
                    <Link to="/new-ticket" className="hm-btn" id="hm-new-ticket-btn">New Ticket</Link>
            		<Link to="/signup"><div className="hm-btn" id="signup-btn">Sign Up</div></Link>
            		<Link to="/dashboard"><div className="hm-btn" id="hm-dashboard-btn">Login</div></Link>
    			</div>
    			<div className="hm-container">
    				{this.props.children}
    			</div>
    			<div className="footer-container">This is a footer... ~ Captain Obvious</div>
    		</div>
		);
	}
};

export default App
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
                <div className="footer-container">This is a footer... ~ Captain Obvious</div>    			
    		</div>
		);
	}
};



export default App
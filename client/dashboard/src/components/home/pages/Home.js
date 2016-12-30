import React, { Component } from 'react';
import { Link } from 'react-router';

class Home extends Component {
	render(){
		return (
	    <div id="home-text-container">
	   		<h1 className="home-big-text">Ticketz.io</h1>
	      	<h1 className="home-medium-text">The [modern] work order system for IT, Maintenance, Contractors, and more. We designed <i>ticketz</i> to make YOU more productive. And it's <b>free</b>.</h1>
        	<Link to="/signup"><div className="hm-btn" id="signup-btn">Sign Up</div></Link>
        	<img src="/images/logo.svg" className="hm-logo"/>
	  	</div>
		)
	}
}

export default Home
import React, { Component } from 'react';
import { Link } from 'react-router';

class Home extends Component {
	render(){
		return (
	    <div id="home-text-container">
	    	<div id="home-buttons-columns">
	    	<Link to="/new"><div className="hm-btn-quad">Submit A Ticket</div></Link>
	    	<Link to="/status"><div className="hm-btn-quad">Check A Ticket's Status</div></Link>
	    	<Link to="/dashboard"><div className="hm-btn-quad">Go to Dashboard</div></Link>
	    	<Link to="/signup"><div className="hm-btn-quad" id="signup-btn">Sign up</div></Link>
	    	</div>
	    	<div className="card-divider" />
	   		<h1 className="home-big-text">Ticketz.io</h1>
	      	<h1 className="home-medium-text">
	      		The [modern] work order system for IT, Maintenance, Contractors, and more. 
	      		We designed <i>ticketz</i> to make YOU more productive. And it's <b>free</b>.
	      	</h1>
	  	</div>
		)
	}
}

export default Home
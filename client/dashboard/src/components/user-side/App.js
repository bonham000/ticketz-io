import React, { Component } from 'react';
import { Link } from 'react-router';
import './css/App.css'
import $ from 'jquery';

class App extends Component {
    componentDidMount(){
			var src = $('body').css('background-image');
			var url = src.match(/\((.*?)\)/)[1].replace(/('|")/g,'');
	
			var img = new Image();
			img.onload = function() {
				img.src = ''
			}
			img.src = url;
			if (img.complete) img.onload();
    }
    render(){
        return (
            <div id="app">

            <div className="row">

                <div className="col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1" id="card">
                    <div id="navbar">
                        <Link to="/app/login"><div id="auth-btn" className="btn"><i className="fa fa-lock" /> Login</div></Link>
                        <Link to="/app/"><div id="home-btn" className="btn"><i className="fa fa-home" /> Home</div></Link>
                    </div>
                    <div id="card-content">
                        <div id="logo">
                            <Link to="/app/"><img className="img-responsive" src="/images/pesd-logo.png" alt="Pendergast"/></Link>
                        </div>
                        <h3 className="heading">Helpnet</h3>
                        {this.props.children}
                    </div>
                </div>

            </div>


            </div>
        )
    }
}

export default App;
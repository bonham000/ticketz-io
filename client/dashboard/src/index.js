//react, react-router
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

//home components
import App from './components/home/App.js';
import NewTicketSearch from './components/home/pages/NewTicketSearch.js';
import NewTicket from './components/home/pages/NewTicket.js';
import Home from './components/home/pages/Home.js';
import Signup from './components/home/pages/Signup.js';
import Login from './components/home/pages/Login.js';


//dashboard components
import AppAdmin from './components/dashboard/AppAdmin';
import Dashboard from './components/dashboard/pages/Dashboard';
import Tickets from './components/dashboard/pages/Tickets';
import Organization from './components/dashboard/pages/Organization';
import Settings from './components/dashboard/pages/Settings';
import Tasks from './components/dashboard/pages/Tasks';
import PageNotFound from './components/dashboard/pages/PageNotFound';



class Index extends Component {
	render() {
		return (
			<Router history={browserHistory}>
				<Route path="/" component={App}>
					<IndexRoute component={Home} />
					<Route path="/new-ticket" component={NewTicketSearch} />
					<Route path="/new-ticket/:organization" component={NewTicket} />
					<Route path="/login" component={Login} />
					<Route path="/signup" component={Signup} />
				</Route>
				<Route path="/dashboard" component={AppAdmin}>
					<IndexRoute component={Dashboard} />
					<Route path="tickets" component={Tickets} />
					<Route path="organization" component={Organization} />
					<Route path="settings" component={Settings} />
				</Route>
				<Route path="*" component={PageNotFound} />
			</Router>
		)
	}
}



ReactDOM.render(<Index />, document.getElementById('root'));
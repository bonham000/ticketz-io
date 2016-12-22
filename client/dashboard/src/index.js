//react, react-router
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import axios from 'axios';

//home components
import App from './components/home/App.js';
import FindOrganization from './components/home/pages/FindOrganization.js';
import NewTicket from './components/home/pages/NewTicket.js';
import Home from './components/home/pages/Home.js';
import Signup from './components/home/pages/Signup.js';
import Login from './components/home/pages/Login.js';


//dashboard components
import AppAdmin from './components/dashboard/AppAdmin';
import Dashboard from './components/dashboard/pages/Dashboard';
import Tickets from './components/dashboard/pages/Tickets';
import EditUsers from './components/dashboard/pages/EditUsers';
import Settings from './components/dashboard/pages/Settings';
import Tasks from './components/dashboard/pages/Tasks';
import PageNotFound from './components/dashboard/pages/PageNotFound';


let redirect =(path) => browserHistory.push(path);

function checkTicket(nextState, replace, redirect) {
	let requestedOrganization = nextState.params.organization.toLowerCase();
	axios.get('/api/organizations').then(response => {
		let organizations = response.data.reduce((orgs, org) => {
			return (orgs.indexOf(org.orgName) === -1) ? orgs.concat(org.orgName.toLowerCase()) : orgs;
		}, []);
		if (organizations.indexOf(requestedOrganization) === -1) {
			replace('/new-ticket');
			redirect('/new-ticket');
		} else {
			redirect(nextState);
		}
	}).catch(err => console.error(err));
};


class Index extends Component {
	render() {
		return (
			<Router history={browserHistory}>
				<Route path="/" component={App}>
					<IndexRoute component={Home} />
					<Route path="/new-ticket" component={FindOrganization} />
					<Route path="/new-ticket/:organization" component={NewTicket} onEnter={checkTicket} />
					<Route path="/login" component={Login} />
					<Route path="/signup" component={Signup} />
				</Route>
				<Route path="/dashboard" component={AppAdmin}>
					<IndexRoute component={Dashboard} />
					<Route path="tickets" component={Tickets} />
					<Route path="editusers" component={EditUsers} />
					<Route path="settings" component={Settings} />
					<Route path="tasks" component={Tasks} />
				</Route>
				<Route path="*" component={PageNotFound} />
			</Router>
		)
	}
}



ReactDOM.render(<Index />, document.getElementById('root'));
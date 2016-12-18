import React, { Component } from 'react';
import $ from 'jquery';
import TicketTemplate from '../modules/TicketTemplate';
import '../css/Dashboard.css';

class Dashboard extends Component {
	constructor(){
		super();
		this.state = {
			loading: <div className="center"><i className="fa fa-circle-o-notch fa-spin fa-2x" /></div>,
			tickets: []
		}
	}
	componentWillMount(){
			let data = {assignedto: true, status: "New"};
			$.post('/api/querytickets', data, (tickets)=>{
				if (tickets.length) {
					this.setState({tickets: tickets, loading: <div></div>})
				} else {
					this.setState({loading: <div>You don't have any tickets assigned to you!</div>})
				}
			})
	}
	render() {
		return (
			<div>
					<div className="card" id="dash-task">
						<b>Task:</b> {this.props.user.task}
					</div>
				
				<div className="card">
				{this.state.loading}
				{this.state.tickets.map((ticket)=>{
						return <TicketTemplate ticket={ticket} admins={this.props.admins} key={ticket._id}/>
					}
				)}
				</div>
			</div>
		)
	}
}

export default Dashboard;
import React, { Component } from 'react';
import $ from 'jquery';
import TicketTemplate from '../modules/TicketTemplate';
import '../css/Dashboard.css';

class Dashboard extends Component {
	constructor(){
		super();
		this.state = {
			loading: <div id="loader-sm" />,
			details: [],
			tickets: []
		}
	}
	componentDidMount() {
		if (this.props.user) {
			let data = { status: "New", assignedto: this.props.user.name };
			$.post('/api/querytickets', data, (tickets) => {
				if (tickets.length) {
					this.setState({tickets: tickets, loading: <div />})
				} else {
					this.setState({loading: <div>You don't have any tickets assigned to you!</div>})
				}
			});
		};
	}
	render() {
		return (
			<div>
				<div className="masonry">

					<div className="flex-card-half">
					This could be just some general info about the user...
					</div>

					<div className="flex-card-half">
						<b>Task:</b> {this.props.user.task}
					</div>

					<div className="flex-card-half">
					This is a chart... or at least it will be!
					</div>

					<div className="flex-card-half">
					This could probably be another chart
					</div>

				</div>


				<div className="card">
					{this.state.loading}
					{this.state.tickets.map((ticket)=>{
						return (
							<TicketTemplate
								ticket={ticket}
								admins={this.props.admins}
								key={ticket._id} />
						)
					})}
				</div>
			</div>
		)
	}
}

export default Dashboard;
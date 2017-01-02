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
	setDetail = (id) => {
		let details = this.state.details.concat(id);
		let unique = details.reduce((uniq, item) => {
			return (uniq.indexOf(item) == -1) ? uniq.concat(item) : uniq;
		}, []);
		this.setState({ details: unique });
	}
	closeDetails = (id) => {
		let details = this.state.details.filter(item => item !== id);
		this.setState({ details });
	}
	render() {
		let { details } = this.state;
		return (
			<div>
				<div className="card" id="dash-task">
					<b>Task:</b> {this.props.user.task}
				</div>
				<div className="card">
					{this.state.loading}
					{this.state.tickets.map((ticket)=>{
						let showDetails = null;
						if (details.indexOf(ticket._id) !== -1) showDetails = true;
						return (
							<TicketTemplate
								showDetails={showDetails}
								setDetail={this.setDetail}
								closeDetails={this.closeDetails}
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
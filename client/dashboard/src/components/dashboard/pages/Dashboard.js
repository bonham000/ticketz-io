import React, { Component } from 'react';
import $ from 'jquery';
import TicketTemplate from '../modules/TicketTemplate';
import ReactHighcharts from 'react-highcharts'; 
import '../css/Dashboard.css';

class Dashboard extends Component {
	constructor(){
		super();
		this.state = {
			loading: <div id="loader-sm" />,
			details: [],
			tickets: [],
			configUsers: {},
			configSites: {},
			todaysTickets: []
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
			$.get('/api/querytodaystickets', (tickets)=>{
				console.log(tickets)
				this.setState({todaysTickets: tickets})
			})
		};
	}
	render() {
		let configUsers = {
			chart: {
    	        type: 'column'
        	},
	        title: {
    	        text: 'Ticket Completion'
        	},
	        xAxis: {
	            categories: ['This Month', 'All Time']
    	    },
    	    yAxis: {
    	    	title: 'Completed',
    	    	min: 0
    	    },
        	series: []
    	}
        for (var i in this.props.admins) {
        	configUsers.xAxis.categories.push(this.props.admins[i].name)
        	configUsers.series.push({ name: this.props.admins[i].name, data: [this.props.admins[i].monthCount, this.props.admins[i].allTimeCount] })
        }



        let configSites = {
        	chart: {
            	plotBackgroundColor: null,
	            plotBorderWidth: null,
    	        plotShadow: false,
        	    type: 'pie'
        	},
	        title: {
    	        text: 'New Tickets Today (by Location)'
        	},
	        plotOptions: {
    	        pie: {
        	        allowPointSelect: true,
            	    cursor: 'pointer',
                	dataLabels: {
                    	enabled: false
                	}
            	}
        	},
	        series: [{
    	        name: 'Submitted',
        	    colorByPoint: true,
            	data: []
        	}]
    	}
    	for (var i in this.props.organization.sites) {
    		let count = 0;
    		this.state.todaysTickets.forEach((ticket)=>{
    			if (ticket.site === this.props.organization.sites[i]) count++
    		})
    		configSites.series[0].data.push({ name: this.props.organization.sites[i], y: count })
    	}



		return (
			<div>
				<div className="masonry">

					<div className="flex-card-half">
						<h3>{this.props.user.name}</h3>
						<div className="card-divider" />
						{this.props.user.task || "You have not been assigned a task."}
					</div>

					<div className="flex-card-half">
						<ReactHighcharts config={configUsers}></ReactHighcharts>
					</div>

					<div className="flex-card-half">
						<ReactHighcharts config={configSites}></ReactHighcharts>
					</div>

				</div>

				<div className="card" style={{marginTop: "10px"}}>
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
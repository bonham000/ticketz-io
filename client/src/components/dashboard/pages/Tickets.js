import React, { Component } from 'react';
import $ from 'jquery';
import TicketTemplate from '../modules/TicketTemplate';
import SearchBox from '../modules/SearchBox';
import '../css/Tickets.css';


//this.props.admins available, and this.props.username, passed down from appadmin.js
class Tickets extends Component {
	constructor(){
		super();
		this.state = {
			loading: <div id="loader-sm" />,
			details: [],
			tickets: [],
			searchBox: <div />
		}
	}
	loadActive(){
		$.post('/api/querytickets', {status: "New"}, (tickets)=>{
			var loading = "No tickets to display."
			if (tickets.length) loading = <div />
			this.setState({tickets: tickets, loading: loading})
		})
	}
	loadArchive(){
		$.post('/api/querytickets', {status: "Complete"}, (tickets)=>{
			var loading = "No tickets to display."
			if (tickets.length) loading = <div />
			this.setState({tickets: tickets, loading: loading})
		})
	}
	advancedSearch(){
		console.log(this.props.organization)
		this.setState({tickets: [], loading: <div />, searchBox: <SearchBox 
			admins={this.props.admins} 
			organization={this.props.organization}
			submitSearch={(query)=>this.submitSearch(query)}/>})
	}
	submitSearch(query){
		console.log(query)
		this.setState({
			tickets: [],
			loading: <div id="loader-sm" />
		})
		$.post('/api/querytickets', query, (tickets)=>{
			var loading = "No tickets to display."
			if (tickets.length) loading = <div />
			this.setState({tickets: tickets, loading: loading})
		})
	}
	
	componentDidMount(){
		this.loadActive();
		$('.tk-topbtn').click((e)=>{
			this.setState({
				tickets: [],
				loading: <div id="loader-sm" />,
				searchBox: <div />
			})
			$('.tk-topbtn').css('background-color', '#273135')
			$('#' + e.target.id).css('background-color', '#fa7252')
			if (e.target.id === 'active-tickets-btn') this.loadActive();
			if (e.target.id === 'advanced-search-btn') this.advancedSearch();
			if (e.target.id === 'archive-tickets-btn') this.loadArchive();
			
		})
	}
	render() {
		let { details } = this.state;
		return (
			<div>
				<div className="card">

				<div id="top-select-bar">
					<div id="active-tickets-btn" className="tk-topbtn">Active</div>
					<div id="advanced-search-btn" className="tk-topbtn">Search</div>
					<div id="archive-tickets-btn" className="tk-topbtn">Archive</div>
				</div>
				{this.state.searchBox}
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

export default Tickets;
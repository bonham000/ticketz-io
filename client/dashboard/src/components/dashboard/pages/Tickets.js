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
			loading: <div className="center"><i className="fa fa-circle-o-notch fa-spin fa-2x" /></div>,
			tickets: [],
			searchBox: <div></div>
		}
	}
	loadActive(){
		$.post('/api/querytickets', {status: "New"}, (tickets)=>{
			this.setState({tickets: tickets, loading: <div></div>})
		})
	}
	loadArchive(){
		$.post('/api/querytickets', {status: "Complete"}, (tickets)=>{
			this.setState({tickets: tickets, loading: <div></div>})
		})
	}
	advancedSearch(){
		this.setState({tickets: [], loading: <div></div>, searchBox: <SearchBox admins={this.props.admins} submitSearch={(query)=>this.submitSearch(query)}/>})
	}
	submitSearch(query){
		console.log(query)
		this.setState({
			tickets: [],
			loading: <div className="center"><i className="fa fa-circle-o-notch fa-spin fa-2x" /></div>
		})
		$.post('/api/querytickets', query, (tickets)=>{
			this.setState({tickets: tickets, loading: <div></div>})
		})
	}
	
	componentDidMount(){
		this.loadActive();
		$('.tk-topbtn').click((e)=>{
			this.setState({
				tickets: [],
				loading: <div className="center"><i className="fa fa-circle-o-notch fa-spin fa-2x" /></div>,
				searchBox: <div></div>
			})
			$('.tk-topbtn').css('background-color', '#273135')
			$('#' + e.target.id).css('background-color', '#fa7252')
			if (e.target.id === 'active-tickets-btn') this.loadActive();
			if (e.target.id === 'advanced-search-btn') this.advancedSearch();
			if (e.target.id === 'archive-tickets-btn') this.loadArchive();
			
		})
	}//get ready for some mad react templating skills
	
	
	render() {
		return (
			<div>
				<div id="top-select-bar">
					<div id="active-tickets-btn" className="tk-topbtn">Active</div>
					<div id="advanced-search-btn" className="tk-topbtn">Search</div>
					<div id="archive-tickets-btn" className="tk-topbtn">Archive</div>
				</div>
				<div className="card">
				{this.state.searchBox}
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

export default Tickets;
import React, { Component } from 'react';
import '../css/TicketTemplate.css';
import $ from 'jquery';

class TicketTemplate extends Component {
	setAssignee(e){
		$.get('/api/updateassignee/' + this.props.ticket._id + '/' + e.target.value);
	}
	setNote(e){
		var data = {id: this.props.ticket._id, note: e.target.value}
		$.ajax({
			method: 'PUT',
			url: '/api/updatenote/',
			contentType: 'application/json',
			data: JSON.stringify(data)
		});
	}
	route(e){
		let newdpt = this.props.ticket.dpt === 'IT' ? 'Maintenance' : 'IT';
		$.get('/api/routeticket/' + this.props.ticket._id + '/' + newdpt);
		$('#'+this.props.ticket._id).fadeOut();
	}
	complete(e){
		$.get('/api/completeticket/' + this.props.ticket._id);
		$('#'+this.props.ticket._id).fadeOut();
	}
	render() {
		return (
			<div className="ticket-wrapper">
			<div className="ticket-container" key={this.props.ticket._id} id={this.props.ticket._id}>
				
				<div className="sub-container c1">
					<b>Ticket #{this.props.ticket._id}, Status: {this.props.ticket.status}</b><br />
					<b>Submitted On: </b><i>{this.props.ticket.date}</i><br />
					<b>User Email:</b> {this.props.ticket.email} <br />
					<b>User Phone: </b>(x{this.props.ticket.phone}) <br />
					<b>Workplace: </b>{this.props.ticket.site}, {this.props.ticket.room}
				</div>
				
				<div className="sub-container c2">
					<b>{this.props.ticket.name}:</b> {this.props.ticket.description}
				</div>
				
				<div className="sub-container c3">
					<div><b>Actions:</b></div>
					<div className="route-btn tk-btn" onClick={this.props.setDetail.bind(this, this.props.ticket._id)}>Show Details</div>
					<div className="route-btn tk-btn" onClick={(e)=>this.route(e)}>Route</div>
					<div className="complete-btn tk-btn" onClick={(e)=>this.complete(e)}>Complete</div>
				</div>

			</div>
				{this.props.showDetails && <div className="c4">
					<select className="ticket-assign" onChange={(e)=>this.setAssignee(e)}>
						<option style={{"display": "none"}}>{this.props.ticket.assignedto || "Assign Ticket"}</option>
						{!this.props.admins ? '' : this.props.admins.map((admin, i)=>{
							return <option key={i}>{admin.username}</option>
						})
						}
					</select>
					<textarea className="ticket-notes" defaultValue={this.props.ticket.note} onBlur={(e)=>this.setNote(e)} />
					<button className="btn btn-primary" onClick={this.props.closeDetails.bind(this, this.props.ticket._id)}>Hide Details</button>
				</div> }
			</div>
		)
	}
}

export default TicketTemplate;
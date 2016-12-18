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
			<div className="ticket-container" key={this.props.ticket._id} id={this.props.ticket._id}>
				
				<div className="sub-container c1">
					<b>#{this.props.ticket._id} {this.props.ticket.status}</b><br />
					<i>{this.props.ticket.date}</i><br />
					{this.props.ticket.email} (x{this.props.ticket.phone}) <br />
					{this.props.ticket.site}, {this.props.ticket.room}
				</div>
				
				<div className="sub-container c2">
					{this.props.ticket.description} <br />
					{this.props.ticket.name}
				</div>
				
				<div className="sub-container c3">
					<textarea maxLength="200" defaultValue={this.props.ticket.note} onBlur={(e)=>this.setNote(e)} />
					<select className="assignee" onChange={(e)=>this.setAssignee(e)}>
						<option style={{"display": "none"}}>{this.props.ticket.assignedto || "Assign to"}</option>
						{!this.props.admins ? '' : this.props.admins.map((admin, i)=>{
							return <option key={i}>{admin.username}</option>
						})
						}
					</select>
				</div>
				
				<div className="sub-container c4">
					<div className="route-btn tk-btn" onClick={(e)=>this.route(e)}>Route</div>
					<div className="complete-btn tk-btn" onClick={(e)=>this.complete(e)}>Complete</div>
				</div>
			</div>
		)
	}
}

export default TicketTemplate;
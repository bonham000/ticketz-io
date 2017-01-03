import React, { Component } from 'react';
import '../css/TicketTemplate.css';
import $ from 'jquery';
import axios from 'axios';

class TicketTemplate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			note: this.props.ticket.note,
			flash: false
		}
	}
	setAssignee(e){
		$.get('/api/updateassignee/' + this.props.ticket._id + '/' + e.target.value);
	}
	setNote = () => {
		var data = {id: this.props.ticket._id, note: this.state.note }
		axios.post('/api/updatenote/', data).then(res => {
			this.setState({ flash: true });
		}).catch(err => console.log(err));
	}
	handleChange = (e) => {
		this.setState({ note: e.target.value });
	}
	closeFlash = () => this.setState({ flash: false })
	complete(e){
		$.get('/api/completeticket/' + this.props.ticket._id);
		$('#'+this.props.ticket._id).fadeOut();
	}
	render() {
		return (
			<div className="ticket-wrapper" key={this.props.ticket._id} id={this.props.ticket._id}>
				
				<div className="sub-container c1">
					<b>Ticket #{this.props.ticket._id} - {this.props.ticket.status}</b><br />
					<i>{this.props.ticket.date}</i><br />
					<div className="card-divider" />
					<i className="fa fa-user" /><b> {this.props.ticket.name}</b><br />
					<i className="fa fa-envelope" /> {this.props.ticket.email} <br />
					<i className="fa fa-phone" /> {this.props.ticket.phone} <br />
					<i className="fa fa-compass" /> {this.props.ticket.site}, {this.props.ticket.room}
				</div>
				
				<div className="sub-container c2">
					{this.props.ticket.description}
				</div>
				
				<div className="sub-container c3">
					<div id="notes-wrapper">
						<textarea className="ticket-notes" value={this.state.note} onChange={this.handleChange} onBlur={this.setNote} placeholder="Leave a note here! It will save automatically." />
						
						<select className="ticket-assign" onChange={(e)=>this.setAssignee(e)}>
							<option style={{"display": "none"}}>{this.props.ticket.assignedto || "Assign Ticket"}</option>
							{!this.props.admins ? '' : this.props.admins.map((admin, i)=>{
								return <option key={i}>{admin.name}</option>
							})
							}
						</select>

						{this.props.ticket.status !== "Complete" &&
							<div className="hm-btn complete-tk-btn" onClick={(e)=>this.complete(e)}>Complete</div>
						}

					</div>
				</div>
			</div>
		)
	}
}

export default TicketTemplate;
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
					<div className='btn-wrapper'>
						<div className="route-btn tk-btn" onClick={this.props.setDetail.bind(this, this.props.ticket._id)}>Show Details</div>
						<div className="route-btn tk-btn" onClick={(e)=>this.route(e)}>Route</div>
						<div className="complete-btn tk-btn" onClick={(e)=>this.complete(e)}>Complete</div>
					</div>
				</div>

			</div>
				{this.props.showDetails && <div className="c4">
					<div className='detail_1'>
						<label>Assign Notes</label>
						<textarea className="ticket-notes" value={this.state.note} onChange={this.handleChange}/>
					</div>
					<div className='detail_2'>
						<label className='detail-assign'>Assign Ticket</label>
						<select className="ticket-assign" onChange={(e)=>this.setAssignee(e)}>
							<option style={{"display": "none"}}>{this.props.ticket.assignedto || "Assign Ticket"}</option>
							{!this.props.admins ? '' : this.props.admins.map((admin, i)=>{
								return <option key={i}>{admin.username}</option>
							})
							}
						</select>	
						<button className="btn btn-save-notes" onClick={this.setNote}>Save Notes</button>
						<button className="btn btn-primary btn-detail" onClick={this.props.closeDetails.bind(this, this.props.ticket._id)}>Close Details View</button>
					</div>
				</div> }
				{ this.state.flash && <div className='success-flash'>
					<h4>Note saved!</h4>
					<i className="fa fa-times close-notes" onClick={this.closeFlash} aria-hidden="true"></i>
				</div> }
			</div>
		)
	}
}

export default TicketTemplate;
import React, { Component } from 'react';
import $ from 'jquery';
import '../css/Tasks.css';

class Tasks extends Component {
	constructor(){
		super();
		this.state = {i: 0}
	}
	componentDidMount(){
		if (this.props.admins.length) document.getElementById('task-box').value = this.props.admins[0].task;
	}
	componentDidUpdate(){
			document.getElementById('task-box').value = this.props.admins[this.state.i].task
	}
	handleChange(e){
		this.setState({i: e.target.options.selectedIndex})
		document.getElementById('task-box').value = this.props.admins[this.state.i].task
	}
	saveChanges(){
		$('.error-flash').html('<i class="fa fa-circle-o-notch fa-spin" />')
		var data = {}
		data.username = $('select').val();
		data.task = $('#task-box').val() || ' ';
		data.index = this.state.i;
		this.props.updateAdmins(data)
		$.ajax({
			method: "PUT",
			url: "/api/updatetask",
			contentType: "application/json",
			data: JSON.stringify(data),
			success: ()=>{
				$('.error-flash').text('Successfully updated.').css('color', 'green');
			},
			error: ()=>{
				$('.error-flash').text('Server Unavailable.').css('color', 'red');
			}
		})
	}
	render(){
		return (
			<div className="small-card">
				<h4>Assign Tasks</h4>
				<select id="selecteduser" className="form-control" onChange={(e)=>this.handleChange(e)}>
					{this.props.admins.map(function(admin, i){
						return <option id={i} key={i}>{admin.username}</option>
					})}
				</select>
				<textarea id="task-box" />
				<button id="save-task-btn" className="btn btn-success" onClick={()=>this.saveChanges()}>Save</button>
				<div className="error-flash" />
			</div>
		)
	}
}

export default Tasks;
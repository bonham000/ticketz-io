import React, { Component } from 'react';
import $ from 'jquery';
import '../css/Organization.css';

class Organization extends Component {
	constructor(){
		super();
		this.state = {
			editIndex: '',
			editName: '',
			editEmail: '',
			editPassword: '',
			editRole: ''
		}
	}
	handleAddUserClick(){
		$('#add-user-popup').fadeIn(140)
	}
	handleCancelUserClick(){
		$('.popup').fadeOut(140)
	}
	handleEditUserClick(e){
		$('#edit-user-popup').fadeIn(140)
		let a = this.props.admins[e.target.id];
		this.setState({
			editIndex: e.target.id,
			editName: a.name,
			editEmail: a.username,
			editPassword: '',
			editRole: a.role
		})
	}
	submitNewUser(){
		function p(id) {return document.getElementById(id)}
		const fields = ['create-name', 'create-email', 'create-password', 'create-role']
		let valid = true
		const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		for (var i in fields) {
			if (!p(fields[i]).value) {
				p(fields[i]).style.border = "1px solid red"
				valid = false
			} else {
				p(fields[i]).style.border = "1px solid rgba(0,0,0,.2)"
			}
		}
		if (!p('create-email').value.match(emailRegex)) {
			valid = false
			p('create-email').style.border = "1px solid red"
		}
		console.log(document.getElementById('create-name').value)
		if (valid) {
			let data = {
				name: document.getElementById('create-name').value,
				username: document.getElementById('create-email').value,
				password: document.getElementById('create-password').value,
				role: document.getElementById('create-role').value,
				organization: this.props.organization.orgName
			}
			$.ajax({
				method: 'post',
				contentType: 'application/json',
				url: '/api/createadmin',
				data: JSON.stringify(data),
				success: (res)=>{
					$('.popup').fadeOut(140)
					this.props.createAdmin(data)
				},
				failure: (res)=>{console.log(res)}
			})
		}
	}
	changeName(e){this.setState({editName: e.target.value})}
	changeEmail(e){this.setState({editEmail: e.target.value})}
	changePassword(e){this.setState({editPassword: e.target.value})}
	changeRole(e){this.setState({editRole: e.target.value})}
	submitEditUser(){
		let data = {
			index: this.state.editIndex,
			name: this.state.editName,
			username: this.state.editEmail,
			role: this.state.editRole
		}
		if (this.state.editPassword) {data.password = this.state.editPassword}
		$.ajax({
			method: 'put',
			contentType: 'application/json',
			url: '/api/editadmin',
			data: JSON.stringify(data),
			success: (res)=>{
				$('.popup').fadeOut(140)
				this.props.submitEditUser(data);
			},
			failure: (res)=>{console.log(res)}
		})
	}
	deleteUser(){
		let username = this.state.editEmail
		if (this.state.editRole === "owner") {
			alert('You cannot delete the owner')
		} else {
			$.ajax({
				method: 'delete',
				url: '/api/deleteadmin',
				contentType: 'application/json',
				data: JSON.stringify({username: username}),
				success: (res)=>{
					$('.popup').fadeOut(140)
					this.props.deleteAdmin(username)
				},
				failure: (res)=>{console.log(res)}
			})
		}
	}
    render(){
    	var editMode = (this.props.user.role === 'owner' || this.props.user.role === 'manager') ? true : false
    	let o = this.props.organization;

    	return(
    		<div className="masonry">
    			<div className="popup" id="edit-user-popup">
    				<h4>{this.state.editName}</h4>
    				<div className="card-divider" />
					<input type="text" className="hm-input form-control" placeholder="Name" value={this.state.editName} onChange={(e)=>this.changeName(e)} />
					<input type="text" className="hm-input form-control" placeholder="Email" value={this.state.editEmail} onChange={(e)=>this.changeEmail(e)} />
					<input type="password" className="hm-input form-control" placeholder="Password" onChange={(e)=>this.changePassword(e)} />
					{this.state.editRole === "owner" ? <select id="create-role"className="hm-input form-control"><option>owner</option></select> :
					<select className="hm-input form-control" onChange={(e)=>this.changeRole(e)}>
						<option style={{display: "none"}}>{this.state.editRole}</option>
						<option>technician</option>
						<option>manager</option>
					</select>
					}
					<div className="card-footer">
						<div className="card-link" style={{color: "red"}} onClick={()=>this.deleteUser()}>Delete</div>
						<div className="card-link" onClick={()=>this.handleCancelUserClick()}>Cancel</div>
						<div className="card-link" onClick={()=>this.submitEditUser()}>Submit</div>
					</div>
    			</div>

    			<div className="popup" id="add-user-popup">
					<h4>Add User</h4>
					<div className="card-divider" />
					<input type="text" id="create-name" className="hm-input form-control" placeholder="Name" />
					<input type="text" id="create-email" className="hm-input form-control" placeholder="Email" />
					<input type="password" id="create-password" className="hm-input form-control" placeholder="Password" />
					<select id="create-role" className="hm-input form-control">
						<option>technician</option>
						<option>manager</option>
					</select>
					<div className="card-footer">
						<div className="card-link" onClick={()=>this.handleCancelUserClick()}>Cancel</div>
						<div className="card-link" onClick={()=>this.submitNewUser()}>Submit</div>
					</div>
    			</div>

				<div className="flex-card-half">
					<h3>General</h3>
					<div className="card-divider" />
					<div style={{textAlign: "left"}}>
						<b>{o.orgName}</b>
						<br />
						<b>Joined: </b>{o.date}
						<br />
						<b>URL: </b> <a href={'http://www.ticketz.io/new/' + o.url} target="_blank" style={{color: "#66B"}}>{'http://www.ticketz.io/new/' + o.url}</a>
						<br />
						<b>Submittal Password: </b> {o.orgPassword}
					</div>
				</div>



				<div className="flex-card-half">
					<h3>Sites</h3>
					<div className="card-divider" />
					{this.props.organization.sites && 
						<div style={{position: "absolute", top: "10px", right: "10px", fontWeight: "bold"}}>Total Sites: {this.props.organization.sites.length}</div>
					}
					{this.props.organization.sites &&
						this.props.organization.sites.map((site, i)=>{
						return <div key={i}>
							{editMode &&
								<i 	className="fa fa-times-circle"
								id={site}
								style={{color: "red", cursor: "pointer"}}
								onClick={(e)=>{this.props.handleDeleteSite(e)}}/>}
								&emsp;{site}
							</div>
					})}
					{editMode &&
						<form onSubmit={(e)=>{this.props.handleAddSite(e)}}>
							<input id="site-input" className="hm-input" type="text" placeholder="add site" />
						</form>
					}
				</div>



				<div className="flex-card-half">
					<h3>Users</h3>
					<div className="card-divider" />
					{this.props.admins && 
						<div style={{position: "absolute", top: "10px", right: "10px", fontWeight: "bold"}}>Total Users: {this.props.admins.length}</div>
					}
					{(this.props.admins && editMode) ?
						this.props.admins.map((admin, i)=>{
							var initials = admin.name[0] + admin.name[admin.name.indexOf(' ') + 1]
							return(
								<div id={i} className="org-user-box org-user-box-edit-hover" key={i} onClick={(e)=>this.handleEditUserClick(e)}>
									<div id={i} className="avatar-circle">{initials}</div>
									<div id={i} className="org-user-box-text">
										<b id={i}>{admin.name}</b><br />
										{admin.role}
									</div>
								</div>
							)
						})

						:
						this.props.admins.map((admin, i)=>{
							var initials = admin.name[0] + admin.name[admin.name.indexOf(' ') + 1]
							return(
								<div id={i} className="org-user-box" key={i}>
									<div id={i} className="avatar-circle">{initials}</div>
									<div id={i} className="org-user-box-text">
										<b id={i}>{admin.name}</b><br />
										{admin.role}
									</div>
								</div>
							)
						})
					}

					{editMode && <div className="round-blue-btn" onClick={this.handleAddUserClick}>+</div>}
				</div>


            </div>
        )
    }
}

export default Organization;
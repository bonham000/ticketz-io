import React, { Component } from 'react';
import $ from 'jquery';
import '../css/Organization.css';

class Organization extends Component {
	handleAddUserClick(){
		$('#add-user-popup').fadeIn(140)
	}
	handleCancelUserClick(){
		$('.popup').fadeOut(140)
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
				p(fields[i]).style.border = "1px solid black"
			}
		}
		if (!p('create-email').value.match(emailRegex)) {
			valid = false
			p('create-email').style.border = "1px solid red"
		}
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

    render(){
    	var editMode = (this.props.user.role === 'owner' || this.props.user.role === 'manager') ? true : false
    	let o = this.props.organization;
    	console.log(this.props.admins)

    	return(
    		<div className="masonry">
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
						<div className="card-link" onClick={this.handleCancelUserClick}>Cancel</div>
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
						<b>URL: </b> {'ticketz.io/' + o.url}
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
					{this.props.admins &&
						this.props.admins.map((admin, i)=>{
							var initials = admin.name[0] + admin.name[admin.name.indexOf(' ') + 1]
							return (<div className="org-user-box" key={i}>
								<div className="avatar-circle">{initials}</div>
								<div className="org-user-box-text">
									<b>{admin.name}</b><br />
									{admin.role}
								</div>
							</div>)
						})
					}

					{editMode && <div className="round-blue-btn" onClick={this.handleAddUserClick}>+</div>}
				</div>


            </div>
        )
    }
}

export default Organization;
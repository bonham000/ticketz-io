import React, { Component } from 'react';
import $ from 'jquery';
import '../css/EditUsers.css';

class EditUsers extends Component {
		constructor(){
			super();
			this.state = {tab: 'create-user-btn'}
		}
		formData(){
			return {
				username: document.getElementById('username').value,
				password: document.getElementById('password').value,
				dpt: document.getElementById('dpt').value,
				rights: document.getElementById('rights').value
			}
		}
    createAdmin(){
        var data = this.formData();
        data.task = '';
        if (!data.username || !data.password || !data.dpt || !data.rights){
        	$('.error-flash').text('Please fill in all fields.').css('color', 'red')
				} else {
					$.ajax({
						method: 'POST',
						url: '/api/createadmin',
						data: JSON.stringify(data),
						contentType: 'application/json',
						success: () => {
							$('input, select').val('')
							$('.error-flash').text('Success! Created user ' + data.username).css('color', 'green')
							this.props.createAdmin(data)
						},
						error: (res) => {
							$('.error-flash').text(res.responseText).css('color', 'red')
						}
					})
				}
    }
    
    editAdmin(){
    	var data = this.formData();
    	if (!data.password) delete data.password;
    	if (!data.dpt) delete data.dpt;
    	if (!data.rights) delete data.rights;
    	if (data.username) {
				$.ajax({
					method: 'PUT',
					url: '/api/editadmin',
					data: JSON.stringify(data),
					contentType: 'application/json',
					success: () => {
						$('input, select').val('')
						$('.error-flash').text('Success! Updated user ' + data.username).css('color', 'green')
					},
					error: (res) => {
						$('.error-flash').text('Server Unavailable.').css('color', 'red')
					}
				})
			} else {
    		$('.error-flash').text('Please select a user.')
			}
		}
		
		deleteAdmin(){
    	var data = {username: document.getElementById('username').value};
    	if (data.username) {
				$.ajax({
					method: "DELETE",
					url: '/api/deleteadmin',
					data: JSON.stringify(data),
					contentType: "application/json",
					success: (res)=>{
						$('input, select').val('');
						$('.error-flash').text('Success! ' + data.username + ' was deleted.').css('color', 'green')
						this.props.deleteAdmin(data)
					},
					error: (res)=>{
						$('.error-flash').text('Server Unavailable.').css('color', 'red')
					}
				})
			} else {
    		$('.error-flash').text('Please select a user.').css('color', 'red')
			}
		}
    
    componentDidMount(){
			$('.tk-topbtn').click((e)=>{
				$('.error-flash').text('')
				$('.tk-topbtn').css('background-color', '#273135')
				$('#' + e.target.id).css('background-color', '#fa7252')
				var newState = e.target.id === "edit-user-btn" ? "edit-user-btn" : "create-user-btn"
				this.setState({tab: newState})
			})
		}
    
    render(){
    	//if the edit tab is selected show this html
			var edit = (
				<div className="small-card">
					<h4 className='editUserTitle'>Edit Existing User</h4>
					<h5>Username</h5>
					<select id="username" className="form-control">
						<option value="" style={{display: "none"}}></option>
						{this.props.admins ? this.props.admins.map(function(admin, i){
							return <option key={i}>{admin.username}</option>
						}) : ''}
					</select>
					<h5>New Password</h5>
					<input id="password" type="password" className="form-control" />
					<h5>Department</h5>
					<select id="dpt" className="form-control">
						<option value="" style={{display: "none"}}></option>
						<option>IT</option>
						<option>Maintenance</option>
					</select>
					<h5>Rights</h5>
					<select id="rights" className="form-control">
						<option value="" style={{display: "none"}}></option>
						<option>Admin</option>
						<option>Superadmin</option>
					</select>
					<div id="user-btn-container">
						<button onClick={()=>this.editAdmin()} id="submit-edit-account" className="btn btn-success">Submit</button>
						<button onClick={()=>this.deleteAdmin()} id="submit-delete-account" className="btn btn-danger">Delete</button>
					</div>
					<div className="error-flash" />
				</div>
			)
			
			//if the create tab is selected show this html
			var create = (
				<div className="small-card">
					<h4 className='editUserTitle'>Create New User</h4>
					<h5>Username</h5>
					<input type="text" id="username" className="form-control" />
					<h5>Password</h5>
					<input type="password" id="password" className="form-control" />
					<h5>Department</h5>
					<select id="dpt" className="form-control">
						<option value="" style={{display: "none"}}></option>
						<option>IT</option>
						<option>Maintenance</option>
					</select>
					<h5>Rights</h5>
					<select id="rights" className="form-control">
						<option value="" style={{display: "none"}}></option>
						<option>Admin</option>
						<option>Superadmin</option>
					</select>
					<button onClick={()=>this.createAdmin()} id="submit-create-account" className="btn btn-success">Submit</button>
					<div className="error-flash" />
				</div>
			)
			
        return (
            <div>
							<div id="top-select-bar">
								<div id="create-user-btn" className="tk-topbtn">Create</div>
								<div id="edit-user-btn" className="tk-topbtn">Edit</div>
							</div>
							{this.state.tab === "edit-user-btn" ? edit : create}
            </div>
        )
    }
}

export default EditUsers;
import React, { Component } from 'react';
import { Link } from 'react-router';
import './css/App.css'; //need to clean this stylesheet!!!!
import './css/AppAdmin.css';
import $ from 'jquery';

//to access the admins from any child component
//this.props.admins[0].username
class AppAdmin extends Component {
    constructor(){
      super();
      this.state = {admins: [], username: <i className="fa fa-spinner fa-pulse" />, user: {}}
    }
    updateAdmins(data){
			let updatedAdmins = this.state.admins;
			let updatedUser = this.state.user;
			
    	if (data.task) {
				updatedAdmins[data.index].task = data.task;
    		updatedUser.task = data.task;
			}
			this.setState({admins: updatedAdmins, user: updatedUser})
		}
		createAdmin(data){
    	let admins = this.state.admins;
    	admins.push(data);
			this.setState({admins: admins});
		}
		deleteAdmin(username){
			let admins = this.state.admins;
			let index = admins.map(function(admin){return admin.username}).indexOf(username);
			admins.splice(index, 1)
			this.setState({admins: admins});
		}
    handleLogout(){
      $.get('/api/logout', function(res){
        if (res){window.location.href = '/'}
      })
    }
	componentWillMount(){
		$('body').css('background', 'none');
		$('#admin-portal').hide();
		$.get('/api/validateAuth', (user)=>{
			if (user) {
				$.get('/api/initialData', (data)=>{
					this.setState({admins: data, username: user.username, user: user});
					$('#admin-portal').show()
				})
			}
			else window.location.href = '/app/login';
		})
	}
	animateNavbar(){
		if (document.getElementById('admin-navbar').style.left == '-200px') {
			document.getElementById('admin-navbar').style.left = '0'
		} else {
			document.getElementById('admin-navbar').style.left = '-200px'
		}
	}
    render(){
        return (
            <div id="admin-portal">
							
							<div id="profile-box">
								<div id="menu-btn-box" className="prof-box-btn" onClick={this.animateNavbar}><i className="fa fa-bars" /></div>
								<div id="profile-box-name"><Link to="/admin">{this.state.username}</Link></div>
								<div className="prof-box-btn"><Link to="/admin/settings"><i className="fa fa-cogs" /></Link></div>
								<div className="prof-box-btn" onClick={()=>this.handleLogout()}><i className="fa fa-lock" /></div>
							</div>
							
							
                <div id="admin-navbar">
									<Link to="/admin"><div className="navbtn">Dashboard</div></Link>
									<Link to="/admin/tickets"><div className="navbtn">Tickets</div></Link>
									<Link to="/admin/editusers"><div className="navbtn">Users</div></Link>
									<Link to="/admin/tasks"><div className="navbtn">Tasks</div></Link>
                </div>
							
                    <div id="admin-content">
											{this.props.children &&
												React.cloneElement(
													this.props.children,
													{admins: this.state.admins,
														user: this.state.user,
														username: this.state.username,
														updateAdmins: (data)=>this.updateAdmins(data),
														createAdmin: (data)=>this.createAdmin(data),
														deleteAdmin: (data)=>this.deleteAdmin(data)
													}
												)}
                    </div>
            </div>
        )
    }
}

export default AppAdmin;
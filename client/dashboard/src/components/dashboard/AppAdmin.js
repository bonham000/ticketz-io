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
  	this.state = {
  		user: {},
    	admins: [],
  		organization: {},
  		showNav: true
  	};
	}
	handleAddSite(e){
		e.preventDefault()
		let org = this.state.organization
		let el = document.getElementById('site-input')
		org.sites.push(el.value)
		el.value = '';
		$.ajax({
			method: 'put',
			url: '/api/update-organization',
			contentType: 'application/json',
			data: JSON.stringify(org)
		})
		this.setState({organization: org})
	}
	handleDeleteSite(e){
		let org = this.state.organization;
		org.sites.splice(org.sites.indexOf(e.target.id), 1)
		$.ajax({
			method: 'put',
			url: '/api/update-organization',
			contentType: 'application/json',
			data: JSON.stringify(org)
		})
		this.setState({organization: org})
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
  submitEditUser(data){
  	console.log(data)
  	let newAdmins = this.state.admins
  	newAdmins[data.index] = data
  	this.setState({admins: newAdmins})
  }
	componentDidMount(){
		window.addEventListener('resize', this.handleResize);
		$('body').css('background', 'none');
		$('#admin-portal').hide();
		$('#loader').show();
		//validates that user is logged in, then fetches their inital data: user, admins, organization
		$.get('/api/validateAuth', (user)=>{
			if (user) {
				$.getJSON('/api/initialData', (data)=>{
  				let initials = user.name[0] + user.name[user.name.indexOf(' ') + 1]
					this.setState({admins: data.admins, user: user, organization: data.organization, initials: initials});
					$('#admin-portal').show();
					$('#loader').hide();
				})
			}
			else window.location.href = '/login';
		});
	}
	componentWillUnmount(){
		window.removeEventListener('resize', this.handleResize);
	}
	handleResize = () => {
  	if (!this.state.showNav && window.innerWidth >= 768) {
			document.getElementById('admin-navbar').style.left = '0';
			this.setState({ showNav: true });
  	} else if (this.state.showNav && window.innerWidth <= 767) {
  		document.getElementById('admin-navbar').style.left = '-200px';
  		this.setState({ showNav: false });
  	};
  }
	animateNavbar(){
		let elem = document.getElementById('admin-navbar');
		(elem.style.left === '-200px') ? elem.style.left = '0' : elem.style.left = '-200px';
	}
	componentDidUpdate() {

		//handle styling for navbtns
		$('.navbtn').removeClass('activeNavbtn')
		var active = ''
		switch (this.props.location.pathname.toLowerCase()) {
			case '/dashboard': 
				active = 'Dashboard';
				break;
			case '/dashboard/tickets':
				active = 'Tickets';
				break;
			case '/dashboard/organization':
				active = 'Organization';
				break;
		}
		if (active) $('#' + active).addClass('activeNavbtn')

	}
  render(){
    return (
    	<div>

    		<div id="loader"></div>
    		<img src="/images/logo.svg" className="loader-logo"/>

      	<div id="admin-portal">
				
					<div id="profile-box">
						<div id="menu-btn-box" className="prof-box-btn" onClick={this.animateNavbar}><i className="fa fa-bars" /></div>
						<div id="avatar-circle-box"><Link to="/dashboard/settings"><div className="avatar-circle">{this.state.initials}</div></Link></div>
						<div id="profile-box-name"><Link to="/dashboard/settings">{this.state.user.name}</Link></div>
						<div className="prof-box-btn">
							<Link to="/">
								<i className="fa fa-external-link-square" />
								<i className="hide-mobile"> Home</i>
							</Link>
						</div>
						<div className="prof-box-btn" onClick={()=>this.handleLogout()}><i className="fa fa-lock" /><i className="hide-mobile"> Logout</i></div>
					</div>
			
	    		<div id="admin-navbar">
						<Link to="/dashboard"><div className="navbtn" id="Dashboard">Dashboard</div></Link>
						<Link to="/dashboard/tickets"><div className="navbtn" id="Tickets">Tickets</div></Link>
						<Link to="/dashboard/organization"><div className="navbtn" id="Organization">Organization</div></Link>
	    		</div>

	    		<div id="admin-content">
						{this.props.children &&
							React.cloneElement(
								this.props.children,
								{admins: this.state.admins,
									user: this.state.user,
									organization: this.state.organization,
									initials: this.state.initials,
									handleAddSite: (e)=>this.handleAddSite(e),
									handleDeleteSite: (e)=>this.handleDeleteSite(e),
									updateAdmins: (data)=>this.updateAdmins(data),
									createAdmin: (data)=>this.createAdmin(data),
									deleteAdmin: (data)=>this.deleteAdmin(data),
									submitEditUser: (data)=>this.submitEditUser(data)
								}
						)}
	    		</div>

      	</div>
      </div>
    )
  }
}

export default AppAdmin;
import React, { Component } from 'react';

//ids are: search-site, search-status, search-description, search-email, search-assignedto
class SearchBox extends Component {
	handleSubmit(){
		function p(id) {return document.getElementById(id).value}
		var query = {}
			if (p('search-site')) query.site = p('search-site')
			if (p('search-status')) query.status = p('search-status')
			if (p('search-description')) query.description = p('search-description')
			if (p('search-email')) query.email = p('search-email')
			if (p('search-assignedto')) query.assignedto = p('search-assignedto')
		this.props.submitSearch(query)
	}
	render(){
		return(
		<div id="search-container">
			
			
			<div className="form-horizontal">
				<div className="col-xs-6">
					<div className="form-group">
						<div className="input-group">
							<div className="input-group-addon">
								<i className="fa fa-compass" />
							</div>
							<select className="form-control" id="search-site">
								<option value="">Site</option>
								{this.props.organization.sites.map(function(site){
									return <option>{site}</option>
								})}
							</select>
						</div>
					</div>
				</div>
				
				<div className="col-xs-6">
					<div className="form-group">
						<div className="input-group">
							<div className="input-group-addon">
								<i className="fa fa-check-square-o" />
							</div>
							<select className="form-control" id="search-status" required>
								<option value="">Status</option>
								<option>New</option>
								<option>Complete</option>
							</select>
						</div>
					</div>
				</div>
			</div>
			
			
			
				<div className="form-group">
					<div className="input-group">
						<div className="input-group-addon">
							<i className="fa fa-pencil-square-o" />
						</div>
						<input type="text" id="search-description" className="form-control" placeholder="Description" />
					</div>
				</div>
			
				<div className="form-group">
					<div className="input-group">
						<div className="input-group-addon">
							<i className="fa fa-envelope" />
						</div>
						<input type="email" className="form-control" id="search-email" placeholder="Email" />
					</div>
				</div>
			
			
			<div className="form-group">
				<div className="input-group">
					<div className="input-group-addon">
						<i className="fa fa-user" />
					</div>
					<select id="search-assignedto" className="form-control">
						<option value="">Assigned To</option>
						{this.props.admins && 
							this.props.admins.map((admin)=>{
							return <option>{admin.username}</option>
						})}
					</select>
				</div>
				
			</div>
			
			<div className="form-group">
				<button className="btn btn-success form-submit" id="search-submit" onClick={()=>this.handleSubmit()}>Search</button>
			</div>
			
		</div>
		)
	}
}


export default SearchBox;
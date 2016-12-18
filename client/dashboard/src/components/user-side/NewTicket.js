import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';
import $ from 'jquery';
import './css/NewTicket.css';

class NewTicket extends Component {
    handleSubmit(e){
        e.preventDefault();
        function p(id){return document.getElementById(id).value}
        $('.error-flash')
            .html('<i class="fa fa-circle-o-notch fa-spin fa-fw"></i>')
            .css({color: 'black'})
        $.ajax({
            method: 'POST',
            url: '/api/newticket',
            data: JSON.stringify({
                dpt: p('dpt'),
                name: p('name'),
                email: p('email'),
                phone: p('phone'),
                site: p('site'),
                room: p('room'),
                description: p('description')
            }),
            contentType: 'application/json',
            success: function(res){
                browserHistory.push('/app/success')
            },
            error: function(err){
                $('.error-flash')
                    .text('Error! Server unavailable.')
                    .css({color: 'red'})
            },
            timeout: 1000
        })
    }

    render(){
        return (
            <div>
                <h4 className="heading">Create a new ticket</h4>
                <h5 className="error-flash" />
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <i className="fa fa-wrench" />
                                    </div>
                                    <select className="form-control" id="dpt" required>
                                        <option value="" style={{display: "none"}}>IT or Maintenance</option>
                                        <option>IT</option>
                                        <option>Maintenance</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <i className="fa fa-user" />
                                    </div>
                                    <input type="text" className="form-control" id="name" placeholder="Name" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <i className="fa fa-envelope" />
                                    </div>
                                    <input type="email" pattern="^\w+(@pesd92.org)$" className="form-control" id="email" placeholder="Email (example@pesd92.org)" title="Please use your work email" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <i className="fa fa-phone" />
                                    </div>
                                    <input type="tel" pattern="^\d{4}$" className="form-control" id="phone" placeholder="Ext. (1234)" title="xxxx" required />
                                </div>
                            </div>
                            <div className="form-horizontal">
                                <div className="col-xs-6">
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon">
                                                <i className="fa fa-compass" />
                                            </div>
                                            <select className="form-control" id="site" required>
                                                <option value="" style={{display: "none"}}>School Site</option>
                                                <option>Amberlea</option>
                                                <option>Canyon Breeze</option>
                                                <option>Copper King</option>
                                                <option>Desert Horizon</option>
                                                <option>Desert Mirage</option>
                                                <option>District Office</option>
                                                <option>Garden Lakes</option>
                                                <option>Pendergast Community Center</option>
                                                <option>Pendergast Elementary</option>
                                                <option>Pendergast Learning Center</option>
                                                <option>Rio Vista</option>
                                                <option>Sonoran Sky</option>
                                                <option>Sunset Ridge</option>
                                                <option>Villa De Paz</option>
                                                <option>Westwind</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-6">
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon">
                                                <i className="fa fa-home" />
                                            </div>
                                            <input type="text" className="form-control" id="room" placeholder="Room Number" required />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <textarea className="form-control" maxLength="400" id="description" rows="5" placeholder="Please describe your problem" required />
                            <div className="form-group">
                                <button className="btn btn-success form-submit" id="submit">Submit</button>
                            </div>
                        </form>
                <div className="heading" id="check-status-link"><Link to="/app/status">Or, check on an existing ticket.</Link></div>
            </div>
        )
    }
}

export default NewTicket;
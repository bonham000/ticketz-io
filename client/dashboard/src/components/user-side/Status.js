import React, { Component } from 'react';
import $ from 'jquery';
import TicketTemplate from './TicketTemplate';
import './css/Status.css';

class Status extends Component {
    constructor(){
        super();
        this.state = {tickets: []}
    }
    handleSubmit(e){
        e.preventDefault();
        $('.error-flash')
            .html('<i class="fa fa-circle-o-notch fa-spin fa-2x fa-fw"></i>')
            .css({color: 'black'})
        $.ajax({
            method: 'GET',
            url: '/api/check/' + document.getElementById('statusemail').value,
            success: (res)=>{
                $('.error-flash')
                    .text('')
                this.setState({tickets: res})
            },
            error: ()=>{
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
                <h4 className="heading">Check the status of an existing ticket</h4>
                    <form id="status-form" onSubmit={(e)=>this.handleSubmit(e)}>
                        <div className="form-group">
                            <div className="input-group">
                                <div className="input-group-addon">
                                    <i className="fa fa-envelope" />
                                </div>
                                <input type="email" pattern="^\w+(@pesd92.org)$" className="form-control" id="statusemail" placeholder="Email (example@pesd92.org)" title="Please use your work email" required />
                            </div>
                        </div>
                        <button className="btn btn-success form-submit">Submit</button>
                    </form>
                <h5 className="error-flash" />
                <div id="ticket-box">{this.state.tickets.map(function(data){
                    return <TicketTemplate key={data._id} data={data}/>
                })}</div>
            </div>
        )
    }
}


export default Status;
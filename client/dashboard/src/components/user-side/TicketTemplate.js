import React from 'react';

export default function TicketTemplate(props){
    return (
        <div id="ticket">

            <div className="ticket-sub-container-id">Ticket #:<br />{props.data._id}</div>
            <div className="ticket-sub-container-date">
                <div><i>{props.data.date}</i></div>
                <div><b>{props.data.dpt}</b></div>
                <div>{props.data.status}</div>
            </div>

            <div className="ticket-sub-container-note">{props.data.description}<br />
                <i className="green-text">{props.data.note}</i></div>
        </div>
    )
}
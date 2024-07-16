import React from 'react';

const Card = (props: any) => <div className={`card ${props.className ? props.className : ''}`}> {props.children} </div>
Card.Header = (props: any) => <div className={`card-header d-flex justify-content-between ${props.className ? props.className : ''}`}> {props.children} </div>
Card.Body = (props: any) => <div className={`card-body ${props.className ? props.className : ''}`}> {props.children} </div>
Card.Footer = (props: any) => <div className="card-footer"> {props.children} </div>
// Card.Header.Title = (props: any) => <div className={`header-title ${props.className ? props.className : ''}`}> {props.children} </div>
// Card.Header.Action = (props: any) => <div className={`header-action ${props.className ? props.className : ''}`}> {props.children} </div>

export default Card;
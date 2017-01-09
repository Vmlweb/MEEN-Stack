//Modules
import * as express from 'express'

//! Interfaces

export interface IEndpoint{
	
	url: string
	method: Method
	execute: express.RequestHandler | express.RequestHandler[]
	
	title?: string
	description?: string
	
	body?: IEndpointLayout
	example?: IEndpointLayout
}

export interface IEndpointLayout{
	
	request?: Object
	response?: Object
}

//! Class and Enum

export enum Method{
	Get, Post, Put, Delete
}

export class Endpoint{
	
	url: string
	method: Method
	execute: express.RequestHandler | express.RequestHandler[]
	
	title: string | null
	description: string | null
	
	body: IEndpointLayout | null
	example: IEndpointLayout | null
	
	constructor(options: IEndpoint){
		
		this.url = options.url
		this.method = options.method
		this.execute = options.execute
		
		this.title = options.title || null
		this.description = options.description || null
		
		this.body = options.body || null
		this.example = options.example || null
	}
	
}
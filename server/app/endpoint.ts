//Modules
import * as express from 'express'

//! Interfaces

export interface IEndpoint{
	
	url: string
	method: Method
	execute: express.RequestHandler | express.RequestHandler[]
	
	title?: string
	description?: string
	errors?: Object
	
	parameters?: {
		request?: string | Object
		response?: string | Object
	}
	example?: {
		request?: string | Object
		response?: string | Object
	}
}

//! Class

export enum Method{
	Get, Post, Put, Delete
}

export class Endpoint{
	
	url: string
	method: Method
	execute: express.RequestHandler | express.RequestHandler[]
	
	title: string | null
	description: string | null
	errors: Object | null
	
	parameters: {
		request: string | Object | null
		response: string | Object | null
	}
	example: {
		request: string | Object | null
		response: string | Object | null
	}
	
	constructor(options: IEndpoint){
		
		this.url = options.url
		this.method = options.method
		this.execute = options.execute
		
		this.title = options.title || null
		this.description = options.description || null
		this.errors = options.errors || null
		
		this.parameters = {
			request: options.parameters ? options.parameters.request || null : null,
			response: options.parameters ? options.parameters.response || null : null
		}
		
		this.example = {
			request: options.example ? options.example.request || null : null,
			response: options.example ? options.example.response || null : null
		}
	}
}
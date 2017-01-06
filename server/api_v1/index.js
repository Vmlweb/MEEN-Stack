//Modules
import express from 'express'
const router = express.Router()

//! Routes

import * as time from './time'
router.use('/time', time.router)

import * as users from './users'
router.use('/users', users.router)

export { router }
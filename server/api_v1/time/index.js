//Modules
import express from 'express'
const router = express.Router()

//! Routes

import time_get from './time.get'
router.get('/', time_get)

export { router }
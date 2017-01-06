//Modules
import express from 'express'
const router = express.Router()

//! Routes

import insert_post from './insert.post'
router.post('/', insert_post)

import remove_delete from './remove.delete'
router.delete('/:userId', remove_delete)

import update_put from './update.put'
router.put('/:userId', update_put)

import user_get from './user.get'
router.get('/', user_get)

export { router }
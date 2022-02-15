import express from 'express'
const router = express.Router()

import * as userCtrl from '../controllers/user'

router.route('/').get(userCtrl.list).post(userCtrl.create)
router
  .route('/:id')
  .get(userCtrl.read)
  .put(userCtrl.update)
  .delete(userCtrl.destroy)
router.param('id', userCtrl.getById)

export default router

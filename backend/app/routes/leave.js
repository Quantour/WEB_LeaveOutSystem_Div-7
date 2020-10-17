const controller = require('../controllers/leave')
const validate = require('../controllers/leave.validate')
const AuthController = require('../controllers/auth')
const router = require('express').Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

/*
 * 내 출타 조회
 */
router.get(
  '/available',
  requireAuth,
  AuthController.roleAuthorization(['user', 'moderator', 'admin']),
  trimRequest.all,
  controller.getAvailables
)

/*
  내 출타 기록 조회
*/

router.get(
  '/apply',
  requireAuth,
  AuthController.roleAuthorization(['user', 'moderator', 'admin']),
  trimRequest.all,
  validate.getLeaves,
  controller.getLeaves
)
/**
 * 내 출타 신청
 */
router.post(
  '/apply',
  requireAuth,
  AuthController.roleAuthorization(['user', 'moderator', 'admin']),
  trimRequest.all,
  validate.applyLeave,
  controller.applyLeave
)

router.get(
  '/admin/apply',
  requireAuth,
  AuthController.roleAuthorization(['moderator', 'admin']),
  trimRequest.all,
  validate.adminGetApplies,
  controller.adminGetApplies
)

router.post(
  '/admin/decide',
  requireAuth,
  AuthController.roleAuthorization(['moderator', 'admin']),
  trimRequest.all,
  validate.adminDecideApply,
  controller.adminDecideApply
)

// 대시보드

// 사용 가능한 출타토큰 개수 조회
router.get(
  '/dashboard/token-count',
  requireAuth,
  AuthController.roleAuthorization(['user', 'moderator', 'admin']),
  trimRequest.all,
  controller.dashboardGetAvailableCount
)

// 출타 현황 개수 조회
router.get(
  '/dashboard/leave-count',
  requireAuth,
  AuthController.roleAuthorization(['user', 'moderator', 'admin']),
  trimRequest.all,
  controller.dashboardGetLeaveCount
)

// 출타 히스토리 개수 조회
router.get(
  '/dashboard/leave-history-count',
  requireAuth,
  AuthController.roleAuthorization(['user', 'moderator', 'admin']),
  trimRequest.all,
  controller.dashboardGetLeaveHistory
)

module.exports = router

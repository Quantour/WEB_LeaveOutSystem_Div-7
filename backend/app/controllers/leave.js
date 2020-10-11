const LeaveToken = require('../models/leaveToken')
const Leave = require('../models/leave')
const utils = require('../middleware/utils')
const { matchedData } = require('express-validator')
const parse = require('date-fns/parse')

/*********************
 * Private functions *
 *********************/

/********************
 * Public functions *
 ********************/

exports.getAvailables = utils.asyncRoute(async (req, res) => {
  const data = await LeaveToken.find({ target: req.user.username })
  res.status(200).json(data)
})

exports.applyLeave = utils.asyncRoute(async (req, res) => {
  const data = matchedData(req)

  data.tokens.forEach(async (tokenId) => await utils.isIDGood(tokenId))

  const newleave = new Leave()

  newleave.user = req.user._id
  newleave.startDate = parse(data.departure, 'yyyy-MM-dd', new Date())
  newleave.division = req.user.division

  for (const tokenId of data.tokens) {
    newleave.tokens.push(tokenId)
  }

  await newleave.save()

  res.status(201).json(newleave)
})

exports.adminGetApplies = utils.asyncRoute(async (req, res) => {
  const leaves = await Leave.find({ division: req.user.division }).populate(
    'tokens'
  )

  res.status(200).json(leaves)
})

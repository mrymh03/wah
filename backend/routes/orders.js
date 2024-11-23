/*
    FILE: orders.js [COMPLETE]
    DEPENDENCIES: mongoose, express, orderModel
    INITIALIZING: express router, order
*/
const requireAuth = require('../middleware/requireAuth')
const Order = require('../models/orderModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
router.use(requireAuth)

/*
    STATUS: [FUNCTIONAL]
    AUTH: [CONSUMERS]
    DESCRIPTION:
    Controller for querying for orders from food banks 
    that a user has subscribed to.
*/
router.get('/subscribed', async (request, response) => {
    const uID = request.user._id

    try {
        const sublist = await User.find({  _id: uID }, 'subscriptions').limit(1)
        const subs = sublist.at(0).subscriptions
        const orders = await Order.find({bank_id: {$in: subs}}).sort({ date: -1 })
        console.log(orders)
        response.status(200).json(orders)

    } catch (error) {
        response.status(400).json('Unable to search')
    }
})

/*
    STATUS: [FUNCTIONAL]
    AUTH: [FOOD BANKS]
    DESCRIPTION:
    Controller for getting all orders attributed to the
    current (food bank) user that are not marked as complete.
*/
router.get('/current', async (request, response) => {
    const uID = request.user._id
    
    //Query for all orders that have not been completed
    try {
        const orders = await Order.find({
            bank_id: uID,
            completed: false
        }, 'date content').sort({ date: -1 })
        response.status(200).json(orders)

    } catch (error) {
        response.status(400).json('Failed to query.')
    }
})

/*
    STATUS: [FUNCTIONAL]
    AUTH: [FOOD BANKS]
    DESCRIPTION:
    Controller for getting all orders attributed to the
    current (food bank) user that are marked as complete.
*/
router.get('/previous', async (request, response) => {
    const uID = request.user._id

    //Query for all orders that have been completed
    try {
        const orders = await Order.find({
            bank_id: uID,
            completed: true
        }).sort({ date: -1 })
        response.status(200).json(orders)

    } catch (error) {
        response.status(400).json('Failed to query.')
    }
})

/*
    STATUS: [FUNCTIONAL]
    AUTH: [FOOD BANKS]
    DESCRIPTION:
    Controller for creating a new order in the database.
*/
router.post('/create', async (request, response) => {
    const uID = request.user._id
    const {date, content, completed} = request.body
    console.log(uID)

    //Verify all fields have been checked
    if (!date || !content) {
        return response.status(400).json('Fill all fields.')
    }
    
    //Attempt to create a new order entry in the DB
    try {
        const order = await Order.create({bank_id: uID, date, content, completed})
        response.status(200).json(order)
    } catch(error) {
        response.status(400).json('Failed to create')
    }
})

/*
    STATUS: [FUNCTIONAL]
    AUTH: [FOOD BANKS]
    DESCRIPTION:
    Controller for editing an order already present
    in the database.
*/
router.patch('/update/:id', async (request, response) => {
    const { id } = request.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({error: 'Order does not exist'})
    }

    const { completed } = request.body
    const order = await Order.findOneAndUpdate({_id: id},{$set: {completed: completed}})
    response.status(200).json(order)
})

/*
    STATUS: [FUNCTIONAL]
    AUTH: [FOOD BANKS]
    DESCRIPTION:
    Controller for manually deleting an order from
    the database.
*/
router.delete('/delete/:id', async (request, response) => {
    const { id } = request.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({error: 'Order does not exist'})
    }

    const order = await Order.findOneAndDelete({_id: id})
    response.status(200).json(order)
})

module.exports = router
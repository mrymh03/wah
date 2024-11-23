/*
    FILE: foodbanks.js [IN PROGRESS]
    DEPENDENCIES: mongoose, express, userModel
    INITIALIZING: express router, user
*/
const requireAuth = require('../middleware/requireAuth')
const mongoose = require('mongoose')
const User = require('../models/userModel')
const Order = require('../models/orderModel');
const express = require('express')
const router = express.Router()
router.use(requireAuth)

/*
    STATUS: [FUNCTIONAL]
    AUTH: [CONSUMERS]
    DESCRIPTION:
    Controller for querying specific food banks from the database
    based on some search term.  Designed for search bar component

    FORMAT: /searchFood?searchTerm=<term>
*/
router.get('/searchFood', async (request, response) => {
    try {
        const searchTerms = request.query['searchTerm']
            .split(',')
            .map(term => term.trim())
            .filter(term => term.length > 0) 

        const banks = await User.find({
            foodlist: { $in: searchTerms }
        }, 'title foodlist desc address city state')
        .sort({ foodlist: -1 })
        .limit(10)

        response.status(200).json(banks)

    } catch (error) {
        response.status(400).json('Unable to search')
    }
})

/*
    STATUS: [FUNCTIONAL]
    AUTH: [CONSUMERS]
    DESCRIPTION:
    Controller for querying specific food banks from the database
    based on some search term.  Designed for search bar component

    FORMAT: /searchTitle?searchTerm=<term>
*/
router.get('/searchTitle', async (request, response) => {
    try {
        const searchTerms = request.query['searchTerm']
            .split(',')
            .map(term => term.trim())
            .filter(term => term.length > 0) 

        const banks = await User.find({
            title: { $in: searchTerms }
        }, 'title foodlist desc address city state')
        .sort({ title: -1 })
        .limit(10)

        response.status(200).json(banks)

    } catch (error) {
        response.status(400).json('Unable to search')
    }
})

/*
    STATUS: [FUNCTIONAL]
    AUTH: [CONSUMERS]
    DESCRIPTION:
    Controller for querying specific food banks from the database
    based on some search term.  Designed for search bar component

    FORMAT: /searchLocation?searchTerm=<term>
*/
router.get('/searchLocation', async (request, response) => {
    try {
        const searchTerms = request.query['searchTerm']
            .split(',')
            .map(term => term.trim())
            .filter(term => term.length > 0) 

        const banks = await User.find({
            $or:[
                {city:{$in :searchTerms}},
                {state:{$in :searchTerms}},
                {address:{$in :searchTerms}}
            ]
        }, 'title foodlist desc address city state')
        .sort({ foodlist: -1 })
        .limit(10)

        response.status(200).json(banks)

    } catch (error) {
        response.status(400).json('Unable to search')
    }
})

/*
    STATUS: [FUNCTIONAL]
    AUTH: [CONSUMERS]
    DESCRIPTION:
    Controller for subscribing to a given food bank.
*/
router.patch('/subscribe/:id', async (request, response) => {
    const uID = request.user._id
    const { id: bankID } = request.params

    if (!mongoose.Types.ObjectId.isValid(bankID)) {
        return response.status(404).json({error: 'Food Bank does not exist'})
    }

    const checkSubscription = await User.find({_id: uID, subscriptions: {$in: bankID}})
    console.log(checkSubscription.length == 0)
    if (checkSubscription.length != 0) {
        return response.status(400).json({error: 'Already subscribed'})
    }

    const profile = await User.findOneAndUpdate({_id: uID}, {
        $push: { subscriptions: bankID }
    })

    await User.findOneAndUpdate({_id: bankID}, {
        $push: { subscriptions: uID }
    })

    response.status(200).json(profile)
})

/*
    STATUS: [CHECK]
    AUTH: [CONSUMERS]
    DESCRIPTION:
    Controller for unsubscribing to a given food bank.
*/
router.patch('/unsubscribe/:id', async (request, response) => {
    const uID = request.user._id
    const { id: bankID } = request.params

    if (!mongoose.Types.ObjectId.isValid(bankID)) {
        return response.status(404).json({error: 'Food Bank does not exist'})
    }

    const profile = await User.findOneAndUpdate({_id: uID}, {
        $pull: { subscriptions: bankID }
    })

    await User.findOneAndUpdate({_id: bankID}, {
        $pull: { subscriptions: uID }
    })

    response.status(200).json(profile)
})

/*
    STATUS: [CHECK]
    AUTH: [CONSUMERS]
    DESCRIPTION:
    Controller for querying for food banks that a user has
    subscribed to.
*/
router.get('/subscribed', async (request, response) => {
    const uID = request.user._id
    console.log("ATTEMPT")
    try {
        const sublist = await User.find({  _id: uID }, 'subscriptions').limit(1)
        const subs = sublist.at(0).subscriptions
        const banks = await User.find({  _id: {$in: subs} })
        console.log(banks)
        response.status(200).json(banks)

    } catch (error) {
        response.status(400).json('Unable to search')
    }
})


/*
    STATUS: [IN PROGRESS]
    AUTH: [CONSUMERS]
    DESCRIPTION:
    Controller for querying the locations of all food banks to
    be used by the map API.
*/
router.patch('/map', async (request, response) => {})

/*
    STATUS: [FUNCTIONAL]
    AUTH: [FOOD BANKS]
    DESCRIPTION:
    Controller for querying and updating specific food bank
    in the database.  Currently basic and requires all fields
    be updated.
*/
router.patch('/profile/', async (request, response) => {
    const uID = request.user._id
    const { title, address, city, state, zip, foodlist, desc } = request.body
    console.log(foodlist)
    const preplist = foodlist.replace(/\s/g, "").split(",")
    console.log(preplist)

    if (!mongoose.Types.ObjectId.isValid(uID)) {
        return response.status(404).json({error: 'Profile does not exist'})
    }
    const profile = await User.findOneAndUpdate({_id: uID}, {
        title: title,
        address: address,
        city: city,
        state: state,
        zip: zip,
        foodlist: preplist,
        desc: desc
    })
    response.status(200).json(profile)
})

module.exports = router
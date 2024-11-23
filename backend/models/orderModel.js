/*
    FILE: orderModel.js [COMPLETED]
    DEPENDENCIES: mongoose
    INITIALIZING: schema
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema

/*
    MODEL: users (consumer, donor, food bank)
    GLOBAL FIELDS: <STRING> bank_id
                   <DATE>   date 
                   <STRING> content
                   <BOOL>   completed
*/
const orderSchema = new Schema({
    bank_id: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    }
}, [])

module.exports = mongoose.model('Order', orderSchema)
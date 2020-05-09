const mongoose = require('mongoose')

const Schema = mongoose.Schema

const WorkerSchema = Schema({
    _id: String,
    rate: Number
})

const EmployerSchema = Schema({
    _id: String,
    rate: Number
})

const PointSchema = Schema({
    lat: Number,
    lng: Number
})

const JobsSchema = Schema({
    _id:{
        type:String
    },
    name: { type: String },
    publishDate: { type: String },
    startedDate: { type: String },
    finishedDate: { type : String }, 
    dueDate: { type: String },
    isActive: { type: Boolean },
    workers: { type: [WorkerSchema]},
    description: { type: String },
    employer: { type: [EmployerSchema]},
    amountPayment: { type: Number },
    description_img: { type: [String] },
    category: { type: String },
    point: { type: PointSchema },
    maxWorkers: { type: Number },
    done: { type: Boolean }
})

module.exports = mongoose.model('JobsModel', JobsSchema)
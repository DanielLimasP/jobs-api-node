module.exports = {
    getAllJobs,
    getOneJob,
    createJob,
    updateJob,
    toUpdateJob,
    deleteJob,
    getJobsByPage,
    uploadJobPhoto
}

// CLOUDINARY_URL=cloudinary://874717479975763:I2uZYCzyRbb3Iyz3_lNOR2RN-7k@dz6pgtx3t
const JobsSub = require('../models/Jobs')
const fs = require('fs')
const cloudinary = require('cloudinary').v2
Random = require('meteor-random')
cloudinary.config({
    cloud_name:'perlapi',
    api_key: '756782136451731',
    api_secret: 'aeFULXGDNT6dgnf2qxkOSrklUm0'
})
/*
// Cloudinary config for profe's cloud
cloudinary.config({
    cloud_name:'ravenegg',
    api_key: '173273979277351',
    api_secret: 'zGjYH6vwUSalJPm2sgSevqUMNaM'
})
*/ 

async function getAllJobs(req, res){
    await JobsSub.find({}).sort({publishDate: 'asc'}).then(concepts =>{
        const ctx = {
            items: concepts.map(concept => {
                return {
                    _id: concept._id,
                    description_img: concept.description_img,
                    name: concept.name,
                    publishDate: concept.publishDate,
                    finishedDate: concept.finishedDate,
                    startedDate: concept.startedDate,
                    dueDate: concept.dueDate,
                    isActive: concept.isActive,
                    workers: concept.workers,
                    description: concept.description,
                    employer: concept.employer,
                    amountPayment: concept.amountPayment,
                    category: concept.category,
                    address: concept.address,
                    maxWorkers: concept.maxWorkers,
                    done: concept.done
                }
            })
        }
        res.status(200).render('jobs/alljobsview', {jobs: ctx.items})
    })
}

function getJobsByPage(req, res){
    const perPage = parseInt(req.body.perPage)
    const page = parseInt(req.body.page)
    let jobConcepts = null;

    let searchData = req.query.search
    let query = {}

    if(searchData){
        query.$or = [
            {category: {$regex: new RegExp(searchData), $options: 'i'}},
            {address: {$regex: new RegExp(searchData), $options: 'i'}},
        ]
    }

    JobsSub.find(query).skip((page-1)* perPage).limit(perPage).sort({
        publishDate: -1
    }).exec()
    .then((concepts)=>{
        res.set('X-limit', perPage)
        res.set('X-page', page)
        jobConcepts = concepts
        return JobsSub.count()
    }).then((total)=>{
        res.set('X-total', total)
        res.status(200).send({total: total, reqJobs: jobConcepts.length, jobs: jobConcepts})
    }).catch((err)=>{
        res.status(500).send({ message: `Error in the request ${err}` })
    })
}

function getOneJob(req, res){
    let  jobID = req.body._id
    JobsSub.findById(jobID, (err, concept)=>{
        if(err) return res.status(500).send({message: `Problem with the searching request ${err}`})
        if(!concept) return res.status(404).send({message: `Job not exist`})

        res.status(200).send({message: 'Request successful', job: concept})
    })
}

async function createJob(req, res){
    const {name, startedDate, dueDate, description, _id, amountPayment, description_img, category, address, maxWorkers} = req.body
    var date = new Date();
    const publishDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    const finishedDate = ""
    const isActive = true
    const rate = 0
    const workers = JSON.parse('{"workers":{}}')
    const employerData = {"_id":_id,"rate":rate}
    const done = false
    var imgUrl
    if (description_img != null){
        console.log(_id)
        const path = description_img
        const uniqueFilename = Random.id()
        const cloudinary = require('cloudinary').v2;
        await cloudinary.uploader.upload(path, { public_id: `jobs/${uniqueFilename}`, tags: `jobs` }, (err, result)=> { 
            if (err) return res.send(err)
            //console.log("Cloudinary result", result)
            console.log(result.url)
            imgUrl = result.url
            console.log(imgUrl)
            //updateDescImages(_id, imgUrl)
            fs.unlinkSync(path)
        });
    } else {
        console.log("is nothing")
        imgUrl = ""
    }
    console.log("here is imgUrl")
    console.log(imgUrl)
    const newJob = new JobsSub({_id:Random.id(), name, publishDate, finishedDate, startedDate, dueDate, 
        isActive, workers, description, employer:employerData, amountPayment, description_img:imgUrl,
        category, address, maxWorkers, done})
    newJob.save((err, jobStored)=>{
        if(err) return res.status.send({message: `Error on model ${err}`})
        req.flash('success_msg', 'Job inserted Successfully')
        res.status(200).redirect('/jobs/getalljobs')
    });
}

function toUpdateJob(req, res){
    const {_id, name, description_img, startedDate, dueDate, workers, description, 
        employer, amountPayment, address, maxWorkers} = req.body
    res.status(200).render('jobs/editjobview', {_id, name, description_img, 
        startedDate, dueDate, workers, description, employer, amountPayment, address, maxWorkers})
}

async function updateJob(req, res){
    const {name, description_img, startedDate, dueDate, isActive, description, 
        _employer, amountPayment, category, address, maxWorkers} = req.body
    console.log(_employer)
    var employerArray = _employer.replace(",","").split(" ")
    const employerID = employerArray[2].replace("'","").replace("'","")
    const employerRate = employerArray[4]
    console.log(employerID)
    console.log(employerRate)
    const employerData = {"_id":employerID,"rate":employerRate}
    console.log(employerData)
    await JobsSub.findByIdAndUpdate(req.params.id, {name, description_img, startedDate, dueDate, 
        isActive, description, employer:employerData, amountPayment, category, address, maxWorkers})
    req.flash('success_msg', 'Job uptdated Successfully')
    res.status(200).redirect('/jobs/getalljobs')
}

async function deleteJob(req, res){
    let jobID = req.body._id
    JobsSub.remove({_id: jobID}, (err, concept)=>{
        if (err) return res.status(500).send({ message: `Error in the request ${err}` })
        req.flash('success_msg', 'Job deleted Successfully')
        res.status(200).redirect('/jobs/getalljobs')
    })
}

function updateDescImages(id, update){
    const jobID = id
    const imgs = update
    console.log("id", jobID)
    console.log("update", imgs)

    JobsSub.findOneAndUpdate({_id: jobID}, 
        {"$push": {"description_img": imgs}}, 
        {"new": true, "upsert":true}, 
        (err, conceptUpdated)=>{
            if(err) res.status(500).send({message: `Error in request ${err}`})
            console.log("jobRequest", conceptUpdated);
            /*res.status(200).send({message: `Update Completed`, job: conceptUpdated})*/
        })
}

function uploadJobPhoto(req, res){
    const path = req.body.path
    const jobID = req.body._id
    console.log(jobID)
    const uniqueFilename = Random.id()
    const cloudinary = require('cloudinary').v2;
    cloudinary.uploader.upload(path, { public_id: `jobs/${uniqueFilename}`, tags: `jobs` }, (err, result)=> { 
        if (err) return res.send(err)
        console.log("Cloudinary result", result)
        // "url": "http://res.cloudinary.com/dz6pgtx3t/image/upload/v1585857527/jobs/38Mr7jtkz6HCWn5kk.gif",

        let urlString = result.url
        //let finalString = urlString.replace("http://res.cloudinary.com/dz6pgtx3t/image/upload/", "")

        //console.log("Final Url", finalUrl)
        //updateDescImages(jobID, result.path)
        updateDescImages(jobID, urlString)
        fs.unlinkSync(path)
        res.status(200).send({message: "upload image success", imageData: result})
    });
}
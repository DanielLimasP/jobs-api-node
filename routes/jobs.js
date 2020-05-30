let router = require('express').Router();

const multipart = require('connect-multiparty')

router.use(multipart({
    uploadDir: 'tmp'
}))

let JobsController = require('../controllers/Jobs');

router.get('/getalljobs', JobsController.getAllJobs)

router.get('/fetchalljobs', JobsController.fetchAllJobs)

router.post('/getjob', JobsController.getOneJob)

router.post('/addjob', JobsController.createJob)

router.put('/updatejob/:id', JobsController.updateJob)

router.post('/dataToUpdatejob', JobsController.toUpdateJob)

router.post('/deletejob', JobsController.deleteJob)

router.post('/jobsbypage', JobsController.getJobsByPage)

router.post('/addjobphoto', JobsController.uploadJobPhoto)

router.get('/addjobview', (req, res)=>{
    res.render('jobs/addjobview')
})

router.get('/editjobview', (req, res)=>{
    res.render('jobs/editjobview')
})

module.exports = router;

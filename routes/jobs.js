let router = require('express').Router();

const multipart = require('connect-multiparty')

router.use(multipart({
    uploadDir: 'tmp'
}))

let JobsController = require('../controllers/Jobs');

router.get('/getalljobs', JobsController.getAllJobs)

router.post('/getjob', JobsController.getOneJob)

router.post('/addjob', JobsController.createJob)

router.patch('/updatejob', JobsController.updateJob)

router.post('/deletejob', JobsController.deleteJob)

router.post('/jobsbypage', JobsController.getJobsByPage)

router.post('/addjobphoto', JobsController.uploadJobPhoto)

module.exports = router;

const mongoose = require('mongoose')

const url = 'mongodb://localhost/jobs-db'
mongoose.connect(url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(db => console.log('DB connected'))
.catch(err => console.log(err))
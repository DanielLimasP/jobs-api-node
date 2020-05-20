const mongoose = require('mongoose')

const Schema = mongoose.Schema

const AddressSchema = Schema({
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String }
})

const DocumentsSchema = Schema({
    INE: { type: String },
    certificate: { type: String }, //Agregar solo el ultimo cursado
    residenceProof: { type: String }
})

const ProfileSchema = Schema({
    name: { type: String, optional:false },
    lastname: { type:String, optional:false },
    email: { type: String, optional:false },
    password: { type: String, optional:false },// TODO use SHA256 to encrypt
    phone: { type: String, optional:false },
    birthDate: { type: String, optional:false },
    address: { type: AddressSchema, optional: true},
    gender: { type: String, optional:true },
    maritalStatus: {  type: String, optional:true }, //TODO agregar arreglo de status
    profileImg: { type: String, optional:true },
    degree: { type: String, optional:true },
    roles: { type:[String], allowedValues: ['admin', 'developer', 'manager'] },
    requiredDocuments: { type: DocumentsSchema, optional: true}
})

const UserSchema = Schema({
    displayName: { type: String},
    profile : { type: ProfileSchema },
    terms: {type: Boolean, optional: false}
}, { collection: 'Users'})

UserSchema.methods.encryptPassword = async (password)=>{
    const salt = await bcrypt.genSalt(10)
    const hash = bcrypt.hash(password, salt)
    return hash
}

UserSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}


module.exports = mongoose.model('UserModel', UserSchema)
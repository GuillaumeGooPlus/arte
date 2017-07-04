var mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema,
    Form                    = require('../models/form.model'),

    mongooseUniqueValidator = require('mongoose-unique-validator')

var user = new Schema({
    email: {type: String, unique: true, required: true, lowercase: true},
    password: {type: String, required: true},
    forms: [{type: Schema.Types.ObjectId, ref: 'Form'}],
    paiement: {
      stripe:{
        cusId:{type: String},
        cardId:{type: String},
        subId:{type: String},
      }
    },
    resetPasswordToken: String,
    resetPasswordExpires: String,
    // trackinPage : {
    //   lastVisitPageVideo: {type: Date, default: ['']},
    //   lastVisitPagePress: {type: Date, default: ['']}
    // },
    // lastVisit: Date,
    role: {type: Array, default: ['client']},
    type: {type: Array},
    companies: [{type: Schema.Types.ObjectId, ref: 'Companie'}],
    profile : {
      _profilePicture : [{type: Schema.Types.ObjectId, ref: 'Form'}],
      // parentUser: [{type: Schema.Types.ObjectId, ref: 'User'}],
      name: {type: String, default: ['']},
      // isFeatured: {type: Boolean, default: ['false']},
      // title: {type: String, default: ['']},
      lastName: {type: String, default: ['']},
      phoneNumber:{type: String, default: ['']},
      colorCalendar:{type: String, default: ['#ad2121']},
      // hair : {
      //   hairCondition : {type: String, default: ['Normal']},
      //   scalpCondition : {type: String, default: ['Healthy']},
      //   hairTexture : {type: String, default: ['Fine']}
      // }
    }
  },
  {
    timestamps: true
  })

user.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', user);

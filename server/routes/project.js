var express = require('express'),
    router  = express.Router(),
    config  = require('../config/config'),
    User    = require('../models/user.model'),
    Project    = require('../models/project.model'),
    Form    = require('../models/form.model'),
    fs      = require('fs'),
    jwt     = require('jsonwebtoken'),
    shared = require('./shared.js'),
    nameObject = 'project'

// this process does not hang the nodejs server on error
process.on('uncaughtException', function (err) {
  console.log(err)
})

router.use('/', function (req, res, next) {
  var token = req.headers['authorization']
  jwt.verify(token, config.secret, function (err, decoded) {
    if (err) {
      return res.status(401).json({
        message: 'Authentication failed',
        error: err
      })
    }
    if (!decoded) {
      return res.status(404).json({
        title: 'Authentication Failed',
        error: {message: 'Authentication failed, malformed jwt'}
      })
    }
    if (decoded) {
      User
      .findById(decoded.user._id)
      .populate({ path: 'rights', model: 'Right'})
      .exec(function (err, doc) {
        if (err) {
          return res.status(500).json({
            message: 'Fetching user failed',
            err: err
          })
        }
        if (!doc) {
          return res.status(404).json({
            title: 'User not found',
            error: {message: 'The user was not found'}
          })
        }
        if(!shared.isCurentUserHasAccess(doc.rights, nameObject, 'read')) {
          return res.status(404).json({
            title: 'No rights',
            error: {message: 'No rights'}
          })
        }
        if (doc) {
          req.user = doc
          next()
        }
      })
    }
  })
})



router.put('/:id', function (req, res, next) {
  if(!shared.isCurentUserHasAccess(req.user.rights, nameObject, 'write')) {
    return res.status(404).json({ title: 'No rights', error: {message: 'No rights'} })
  }
  Project.findById(({_id: req.params.id}), function (err, item) {
    if (err) {
      return res.status(404).json({
        message: '',
        err: err
      })
    } else {
      //console.log(req.body)
        item.ownerCompanies = req.user.companies
        item.details = req.body.details
        item.forms = req.body.forms
        item.status = req.body.status
        item.embed = req.body.embed
        item.categories = req.body.categories
        item.clients = req.body.clients
        item.quotes = req.body.quotes
        item.categorie = req.body.categorie
        item.assignedTos = req.body.assignedTos
        item.bucketTasks = req.body.bucketTasks
        item.dateProject = req.body.dateProject



        item.save(function (err, result) {
          if (err) {
            return res.status(404).json({
              message: 'There was an error, please try again',
              err: err
            })
          }
          res.status(201).json({
            message: 'Updated successfully',
            obj: result
          })
        })

    }
  })
})

router.post('/', function (req, res, next) {
  if(!shared.isCurentUserHasAccess(req.user.rights, nameObject, 'write')) {
    return res.status(404).json({ title: 'No rights', error: {message: 'No rights'} })
  }
  if(!req.user.companies.length) {
    return res.status(404).json({
      message: 'You must belong to a companie',
      err: ''
    })
  }


  var project = new Project(req.body)
  project.ownerCompanies = req.user.companies

  project.save(function (err, result) {
    if (err) {
      console.log(err)
      return res.status(403).json({
        title: 'There was an issue',
        error: {message: 'Error'}
      })
    }
    res.status(200).json({
      message: 'Registration Successfull',
      obj: result
    })
  })
})




// get all forms from database
router.get('/page/:page', function (req, res, next) {
  var itemsPerPage = 6
  var currentPage = Number(req.params.page)
  var pageNumber = currentPage - 1
  var skip = (itemsPerPage * pageNumber)

  let searchQuery = {

  }

  if(req.query.search)
    searchQuery['details.name'] = new RegExp(req.query.search, 'i')


  if(req.query.userId)
    searchQuery['clients'] = mongoose.Types.ObjectId(req.query.userId)

  // console.log(hasWhatsNewCateg)
  // console.log(searchQuery)

  Project
  .find(searchQuery)
  .sort('-createdAt')
  .populate({path: 'clients', model: 'User'})

  .populate({ path: 'assignedTos', model: 'User'})

  // .populate({path: 'quotes', model: 'Quote'})
  // .populate(
  //   {
  //     path: 'bucketTasks.tasks.assignedTos',
  //     model: 'User',
  //   })
  .limit(itemsPerPage)
  .skip(skip)
  .exec(function (err, item) {
    if (err) {
      return res.status(404).json({
        message: 'No results',
        err: err
      })
    } else {
      Project
      .find(searchQuery)
      .count()
      .exec(function (err, count) {
      res.status(200).json({
          paginationData : {
            totalItems: count,
            currentPage : currentPage,
            itemsPerPage : itemsPerPage
          },
          data: item
        })
      })
    }
  })
})









router.get('/unwind', function (req, res, next) {
  let searchQuery = {}
  let dateBegin = req.params.year*1 + '-01-01'
  let dateEnd = req.params.year*1 +1 + '-01-01'

  let aggregate = []
  if(req.query.idProject)
    aggregate.push({ $match: {_id: mongoose.Types.ObjectId(req.query.idProject)}})


  aggregate.push({ $unwind : "$bucketTasks" })
  aggregate.push({ $unwind : "$bucketTasks.tasks" })


  if(req.query.myTasks === 'true')
    aggregate.push({ $match: {'bucketTasks.tasks.assignedTos': mongoose.Types.ObjectId(req.user._id)}})

  aggregate.push({ $lookup: {from: 'users', localField: 'bucketTasks.tasks.assignedTos', foreignField: '_id', as: 'bucketTasks.tasks.assignedTos'} })


  Project
  .aggregate(aggregate)
  .exec(function (err, item) {
   if (err) {
     return res.status(404).json({
       message: '',
       err: err
     })
   } else {
     res.status(200).json({
       message: 'Success',
       item: item
     })
   }
 })

})





// getting user forms to display them on front end
router.get('/:id', function (req, res, next) {


  Project.findById((req.params.id), function (err, obj) {
    if (err) {
      return res.status(500).json({
        message: 'An error occured',
        err: err
      })
    }
    if (!obj) {
      return res.status(404).json({
        title: 'No obj found',
        error: {message: 'Obj not found!'}
      })
    }


    Project
    .findById({_id: req.params.id})
    .populate({path: 'clients', model: 'User'})
    .populate({path: 'forms', model: 'Form'})
    .populate({path: 'assignedTos', model: 'User'})
    .populate(
      {
        path: 'bucketTasks.tasks.assignedTos',
        model: 'User',
      })
    .exec(function (err, item) {
      if (err) {
        return res.status(404).json({
          message: '',
          err: err
        })
      } else {
        res.status(200).json({
          message: 'Success',
          item: item
        })
      }
    })
  })
})

//
//
// // getting user forms to display them on front end
// router.get('/countNewItemForUser/:id', function (req, res, next) {
//   User
//   .findOne({_id: req.params.id})
//   .exec(function (err, user) {
//     if (err) {
//       return res.status(403).json({
//         title: 'There was a problem',
//         error: err
//       });
//     } else {
//       Project
//       .find({createdAt:{"$gt": user.trackinPage.lastVisitPageProject}})
//       .exec(function (err, item) {
//         if (err) {
//           return res.status(404).json({
//             message: '',
//             err: err
//           })
//         } else {
//           res.status(200).json({
//             message: 'Success',
//             item: item
//           })
//         }
//       })
//     }
//   })
// })


router.delete('/:id', function (req, res, next) {
  if(!shared.isCurentUserHasAccess(req.user.rights, nameObject, 'write')) {
    return res.status(404).json({ title: 'No rights', error: {message: 'No rights'} })
  }
  Project.findById((req.params.id), function (err, item) {
    if (err) {
      return res.status(500).json({
        message: 'An error occured',
        err: err
      })
    }
    if (!item) {
      return res.status(404).json({
        title: 'No form found',
        error: {message: 'Form not found!'}
      })
    }

    // deleting the form from the database
    item.remove(function (err, result) {
      if (err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
        })
      }
      res.status(200).json({
        message: 'Item is deleted',
        obj: result
      })
    })
  })
})



module.exports = router

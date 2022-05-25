const express = require('express');
const controller = require('../controllers/eventController');
const {isLoggedIn, isAuthor} = require('../middlewares/auth');
const {validateId, validateevent} = require('../middlewares/validator');

const router = express.Router();

//GET /events: send all events to the user
router.get('/', controller.index);

//GET /events/new: send html form for creating a new event
router.get('/new', isLoggedIn, controller.new);

//POST /events: create a new event
router.post('/', isLoggedIn,  validateevent, controller.create);

//GET /events/:id: send details of event identified by id
router.get('/:id', validateId, controller.show);

//GET /events/:id/edit: send html form for editing an exising event
router.get('/:id/edit', validateId, isLoggedIn, isAuthor, controller.edit);

//PUT /events/:id: update the event identified by id
router.put('/:id', validateId, isLoggedIn, isAuthor, controller.update);

//DELETE /events/:id, delete the event identified by id
router.delete('/:id', validateId, isLoggedIn, isAuthor, controller.delete);

//rsvp
router.put("/:id/:answer", validateId, isLoggedIn, controller.rsvp);

module.exports = router;
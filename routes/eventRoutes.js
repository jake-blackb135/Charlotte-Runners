const express = require('express');
const controller = require('../controllers/eventController');
const {fileUpload} = require('../middleware/fileUpload');
const {validateId, validateEvent, validateResult, validateRsvp} = require('../middleware/validate');
const {isLoggedIn, isAuthor, notHost} = require('../middleware/auth');

const router = express.Router();

router.get('/', controller.index);

router.get('/new', isLoggedIn, controller.new);

router.get('/:id',validateId, controller.show);

router.get('/:id/edit', isLoggedIn, isAuthor, validateId, controller.edit);

router.post('/:id/rsvp', isLoggedIn, notHost, validateId, validateRsvp, controller.rsvp);

router.put('/:id', isLoggedIn, isAuthor, validateId, fileUpload, validateEvent, validateResult, controller.update);

router.delete('/:id',isLoggedIn, isAuthor, validateId, controller.delete);

router.post('/', isLoggedIn, fileUpload,validateEvent,validateResult, controller.create);

module.exports = router;
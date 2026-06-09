const express = require('express');

const router = express.Router();

const {createToDo} = require('../controller/createToDo');
const {getToDo, getToDoById} = require('../controller/getToDo');
const {updateToDo} = require('../controller/updateToDo');
const {deleteToDo} = require('../controller/deleteToDo');

const {auth} = require('../middleware/auth')

router.post('/create', auth, createToDo);
router.get('/', auth, getToDo);
router.get('/:id', auth, getToDoById);
router.put('/:id', auth, updateToDo);
router.delete('/:id', auth, deleteToDo);

module.exports = router;
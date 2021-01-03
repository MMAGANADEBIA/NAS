const express = require('express');
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });

const router = express.Router();
const fileUpload = require('express-fileupload');

const { index } = require('../../controllers/user.js');
router.get('/', index);

const { filesU } = require('../../controllers/user.js');
router.get('/filesU', filesU);

const { download } = require('../../controllers/user.js');
router.post('/download/:file2D', download);

router.use(fileUpload());

const { upload } = require('../../controllers/user.js');
router.post('/upload', upload);

const { remove } = require('../../controllers/user.js');
router.post('/remove/:file2R', urlencodedParser, remove);

const { deleteRedirect } = require('../../controllers/user.js');
router.get('/deleteRedirect', urlencodedParser, deleteRedirect);

const { newFolder } = require('../../controllers/user.js');
router.post('/newFolder', urlencodedParser, newFolder);

const { surf } = require('../../controllers/user.js');
router.post('/:folder', urlencodedParser, surf); //'/surf/:folder'

module.exports = router;

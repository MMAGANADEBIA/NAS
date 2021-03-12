const express = require('express');
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });

const router = express.Router();
const fileUpload = require('express-fileupload');

const { index, home, recoverPassword, passwordInfo, infoGiven} = require('../../controllers/user.js');
router.get('/', index);
router.post('/home', urlencodedParser, home)
router.get('/recoverPassword', recoverPassword);
router.post('/passwordInfo', urlencodedParser, passwordInfo);
router.post('/infoGiven', urlencodedParser, infoGiven);

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

/*const { surf } = require('../../controllers/user.js');
router.post('/:folder', urlencodedParser, surf);*/

const { back } = require('../../controllers/user.js');
router.post('/back', back);

/*const { login, logeado } = require('../../controllers/user.js');
router.get('/login', login);
router.post('/logeado', urlencodedParser, logeado);*/

const { createAccount, deleteAccount } = require('../../controllers/user.js');
router.get('/createaccount', createAccount);
router.post('/deleteAccount', deleteAccount)

const { writeData } = require('../../controllers/user.js');
router.post('/writeData', urlencodedParser, writeData);


module.exports = router;

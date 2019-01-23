const express = require('express');
const router = express.Router();

//라우터 연결
const mainRouter = require('./main/index');
router.use('/main',mainRouter);

const electRouter = require('./electricity/index');
router.use('/electricity',electRouter);

const waterRouter = require('./water/index');
router.use('/water',waterRouter);

const useRouter = require('./usage/index');
router.use('/usage',useRouter);

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Express' });
});

module.exports = router;

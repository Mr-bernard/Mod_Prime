const router = require('express').Router()
const {indexGet, aboutGet, contactGet, principalGet, serviceGet, projectGet}  = require('../controllers/defaultController')

router.get('/', indexGet)
router.get('/about', aboutGet)
router.get('/contact', contactGet)
router.get('/principal', principalGet)
router.get('/services', serviceGet)
router.get('/project', projectGet)


module.exports = router


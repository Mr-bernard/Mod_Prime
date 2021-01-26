const express = require('express')
const router = express.Router()
const {loginPost, loginGet, indexGet, aboutGet, add_servicesGet, principalGet, servicesPost, delete_services, add_projectGet, logout, projectPost, all_projectsGet, delete_project,profile_updateGet, profile_updatePost, all_servicesGet,  about_servicesPost, aboutPost, principalPost, forgot_password, reset_password,reset_passwordPOST, forget_passwordGET}  = require('../controllers/adminController')
const auth = require("../config/auth");
const isUser = auth.isUser;
const {upload} = require('../config/configurations')




// LOGIN,LOGOUT ROUTES
router.route('/login')
.get(loginGet)
.post(loginPost)
router.get('/logout', logout)

// INDEX ROUTES
router.get('/index',isUser,  indexGet)


// ABOUT ROUTES
router.get('/about', isUser, aboutGet)
router.post('/aboutMP', isUser, aboutPost)
router.post('/aboutCEO', upload.single('profileImage'), isUser,principalPost )



// PRINCIPAL ROUTES
router.get('/principal', isUser, principalGet)

// SERVICES ROUTES
router.get('/services', isUser, all_servicesGet)
router.get('/add-services', isUser, add_servicesGet)
router.post('/services-about',  about_servicesPost)
router.post('/all-services', upload.single('servicesImage'), servicesPost)
router.get("/delete_services/:servicesId", isUser, delete_services);


// PROFILE ROUTES
router.get('/update-profile', isUser, profile_updateGet)
router.post("/profile-update", isUser, upload.single('avatar'), profile_updatePost)

// PROJECT ROUTES
router.get('/add-project', isUser, add_projectGet)
router.post('/project', upload.single('projectImage'), projectPost)
router.get('/all-projects', isUser, all_projectsGet)
router.get("/delete-project/:projectId", isUser, delete_project);

// RESET PASSWORD
router.get('/reset-password-get',forget_passwordGET)
router.put('/forgot-password', forgot_password)
router.get('/reset-password/:token', reset_password)
router.put('/resetting-password',reset_passwordPOST)




module.exports = router









const mongoose =  require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const {Admin} = require('../models/admin')
const {Home} = require('../models/home')
const {Project} = require('../models/projectCatalogue')
const {Services} = require('../models/serviceCatalogue')
const {whatWeDo} = require('../models/servicesAbout')
const {AboutUs} = require('../models/aboutModelPrime')
const {AboutCEO} = require('../models/aboutCEO')
const passport = require("passport");
const cloudinary = require('../config/cloudinary')
const smtpTransport = require('../config/mailer')
const mail = require('../config/mail');
const { vision } = require('googleapis/build/src/apis/vision');



module.exports = {
    indexGet:async (req, res) => {
      let name = req.user.fullName
      let email = req.user.email
      let phone  = req.user.phone
      let avatar =  req.user.avatar
      let pageTitle = "Profile"
      res.render('admin/index', { pageTitle, layout: "admin", name, email, avatar, phone});
    },


    homeGet: async(req, res) =>{
      let pageTitle = 'Home'
      const home = await Home.find({})
      let recentHome = home[home.length-1]
      res.render('admin/home', {pageTitle, recentHome, layout: "admin"});
    },


    homePost: async(req, res) =>{
      const {homeSide, homeHead, mission, vision, homeMain } = req.body
      const homeImage = req.file
     if(!homeImage || !homeSide ||!homeHead || !vision || !mission){
       console.log("All field required")
    }else{
       await cloudinary.v2.uploader.upload(req.file.path, async(err, result)=>{
       let homeUpdate =await new Home({
         homeHead: homeHead.toUpperCase(),
         homeSide,
         mission,
         vision,      
         homeImage:await result.secure_url
       })
       homeUpdate.save()
       req.flash(
        'success_msg','Home Updated successfully');
       res.redirect('/admin/index')
      })
     }
    },

    aboutGet: (req, res) =>{
      let pageTitle = 'About'
      res.render('admin/about', {pageTitle, layout: "admin"});
    },


    aboutPost: async(req, res) =>{
     const {aboutSide, aboutMain} = req.body
     console.log(req.body)
    if(!aboutSide || !aboutMain){
      console.log("Both field required")
    }else{
      let aboutsUs =await new AboutUs({
        aboutMain,
        aboutSide
      })
      aboutsUs.save()
      req.flash(
        'success_msg','About Updated successfully');
      req.flash('success', 'reg sucessful')
      res.redirect('/admin/index')
      console.log('saved')
    }
    },

    principalGet: (req, res) =>{
      AboutCEO.find({}).then((allCeo)=>{
        let mostRecentCeo = allCeo[allCeo.length-1]
        let pageTitle = 'Principal'
        res.render('admin/principal', {pageTitle, mostRecentCeo, layout: "admin"})
      })
    },

    principalPost: async(req, res) =>{
      const {ceoSide, ceoMain, ceoName, ceoTitle, ceoPosition} = req.body
      const profileImage = req.file
     if(!profileImage || !ceoSide ||!ceoMain || !ceoName || !ceoTitle || !ceoPosition){
       console.log("All field required")
     }else{
       await cloudinary.v2.uploader.upload(req.file.path, async(err, result)=>{
       let aboutCeo =await new AboutCEO({
         ceoMain,
         ceoSide,
         ceoName: ceoName.toUpperCase(),
         ceoTitle,
         ceoPosition: ceoPosition.toUpperCase(),
         profileImage:await result.secure_url
       })
       aboutCeo.save()
       res.redirect('/admin/index')
      })
     }
    },


    add_projectGet: (req, res) => {
      let pageTitle = "Project"
        res.render('admin/add-project',  {pageTitle, layout: "admin"});
    },


    projectPost: async(req, res)=>{
      const {projectName, projectDescription} = req.body
      const projectImage = req.file
      // console.log('file::::::::::',req.file)
      // console.log('body::::::::::',req.body)
      if(!projectImage || !projectName){
        console.log('Upload an image please')
      }
      else{
        await cloudinary.v2.uploader.upload(req.file.path, async(err, result)=>{
          console.log('upload image', result)
          const newProject = await new Project({
            projectImage:await result.secure_url,
            projectName,
            projectDescription
          })
          newProject.save()
          res.redirect('/admin/all-projects')
          const html = `project ${projectName} <strong> created successfully </strong>`
          const mailOptions = {
            from: mail.GMAIL_NAME,
            to: "mhdsadd3@gmail.com",
            subject: "project creation",
            generateTextFromHTML: true,
            html: html
          };
          smtpTransport.sendMail(mailOptions, (error, response) => {
            error ? console.log(error) : console.log(response);
            smtpTransport.close();
          });

        })
      }
    },


    all_projectsGet: (req,res, next)=>{
      const projects = Project.find({})
      projects.exec((err, projects)=>{
        if(err) throw err
        else{
          console.log(projects)
        }
        let pageTitle = 'All project'
        res.render('admin/all-projects', {pageTitle, projects})
      })
    },



      // delete a project
    delete_project: async (req, res) => {
      const id = req.params.projectId;
        await Services.findByIdAndDelete(id)
          .then((deleteProject) => {
            res.redirect("/admin/all-projects");
            return;
          })
          .catch((err) => console.log(err));
      },


    add_servicesGet: (req, res) => {
      let pageTitle = "Update Services"
      let servicesCategory = ['security', 'architecture', 'interior', 'engineering']
        res.render('admin/add-services',  {pageTitle, servicesCategory, layout: "admin"});
    },


    servicesPost: async(req, res)=>{
      const {servicesCategory, servicesName} = req.body
      const servicesImage = req.file

      // console.log('file::::::::::',req.file)
      // console.log('body::::::::::',req.body)

      if(!servicesImage || !servicesName){
        console.log('Upload an image please')
      }
      else{
        await cloudinary.v2.uploader.upload(req.file.path, async(err, result)=>{
          console.log('upload image', result)
          const newServices = await new Services({
            servicesImage:await result.secure_url,
            servicesName,
            servicesCategory
          })
          newServices.save()
          res.redirect('/admin/services')
        })
      }

    },

    about_servicesPost: async(req,res, next)=>{
     const {servicesAbout} = req.body
    //  console.log(req.body)
     if(!servicesAbout){
       console.log('Please input what you do')
     }
     else{
       const about = await new whatWeDo({
        servicesAbout
       })
       about.save()
       res.redirect('/admin/index')
     }
       
    },

    all_servicesGet: async(req,res, next)=>{
      Services.find({}).then((services)=>{
        console.log(services)
         let pageTitle = 'All services'
        res.render('admin/services', {pageTitle, services})
      })
       
    },

    delete_services: async (req, res) => {
      const id = req.params.servicesId;
      console.log(id)
        await Services.findByIdAndDelete(id)
          .then((deleteServices) => {
            res.redirect("/admin/services");
            return;
          })
          .catch((err) => console.log(err));
      },


    profile_updateGet: async(req, res)=>{
      let name = req.user.fullName
      let email = req.user.email
      let phone = req.user.phone
      let pageTitle = "Profile update"
      res.render('admin/update_profile', {pageTitle, name, email, phone})
    },


    // profile update
    profile_updatePost: async(req, res, next)=>{
    const id = req.user.id;
    // console.log(id)
    let updateProfiles = req.body
    // console.log(updateProfiles) 
    await Admin.findByIdAndUpdate(id,updateProfiles)
    .then(async(updatedAdmin) => {
    if(!updatedAdmin) {
        console.log("Cannot update Admin Details");
        req.flash("error_msg", "Cannot update");
    } else {

      // uploading avatar to cloudinary
      await cloudinary.v2.uploader.upload(req.file.path, async(err, result)=>{
        updatedAdmin.avatar = result.secure_url
      })
      await updatedAdmin.save();
      res.redirect("/admin/index");
      console.log('Update was successfull:::::', updateProfiles);
      req.flash("success_msg", "Your update was Successful");
      
       }
    })
        .catch((err) => {
        console.log("An error occured while updating", err);
        req.flash("error_msg", "Your Update couldn't be processed");
        res.redirect("/admin/index");
      })
    },


    loginGet: (req, res) => {
      res.render('login',{layout:"form"});
  },


    loginPost: (req, res, next) => {
      passport.authenticate("admin", {
      successRedirect: "/admin/index",
      failureRedirect: "/",
      failureFlash: true,
      
      }
      )(req, res, next);
  },
    

        // LOGOUT HANDLE
    logout: (req, res) => {
      req.logOut();
      req.flash('success_msg', "You are logged out");
      res.redirect("/");
    },

    forget_passwordGET:(req, res)=>{
      res.render('forgot-password',{layout:"form"});
    },
      
    forgot_password: (req, res)=>{
      const {email} = req.body
      Admin.findOne({email:email}, (err, user)=>{
        if (err || !user){
          console.log(`No user with this mail`)
          req.flash({error_message: 'No user with this mail'})
        }
        else{
          const token = jwt.sign({id:user._id},process.env.RESET_SECRET, {expiresIn:'20m'})
          console.log('token------>', token)
          const html = `<h2>Please click on the link to reset your password</h2>
            <p>${process.env.CLIENT_URL}/admin/reset-password/${token}</p>`
          const mailOptions = {
            from: mail.GMAIL_NAME,
            to: email,
            subject: "Password Reset",
            generateTextFromHTML: true,
            html: html
          }
          return user.updateOne({reset_link: token}, (err, success)=>{
            if (err){
              console.log(`reset error`)
              req.flash({error_message: 'reset error'})
            }
            else{
              smtpTransport.sendMail(mailOptions, (error, response) => {
                error ? console.log(error) : console.log(response);
                res.redirect(`/admin/reset-password/${token}`)
                smtpTransport.close();
              });
            }
          })
        }
      })
    },

    reset_password:(req, res)=>{
      let reset_link = req.params.token
      res.render('reset-password',{layout:"form", reset_link});
    },

    reset_passwordPOST: async(req, res, next)=>{
      let {reset_link, new_password} = req.body
      if(reset_link){
        console.log('reset==>',req.body)
        jwt.verify(reset_link, process.env.RESET_SECRET , (err, decoded)=>{
          if (err) throw err
          Admin.findOne({reset_link}, (err, user)=>{
            if (err || !user){
              console.log('No user with this token')
            }
            else{
              bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(new_password, salt, (err, hash)=>{
                  if (err) throw err
                  new_password = hash
                  
                  const obj = {
                    password : new_password,
                    reset_link: ''
                  }
                  user = _.extend(user, obj)
                  user.save((err, saved)=>{
                    if (err) throw err 
                    else{
                      console.log('password reset successfully')
                      res.redirect('/admin/login')
                    }
                  })
                })
              })
            }
          })
        })
        }
      else{
        console.log(`Authorization Error`)
      }
    }
}
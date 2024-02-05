var express = require('express');
var router = express.Router();
const userModal=require("./users");
const postModal=require("./posts");
const passport = require('passport');
const localstratergy=require("passport-local");
const upload = require("./multer")
passport.use(new localstratergy(userModal.authenticate()));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login',{error:req.flash("error")});
});


router.get("/profile",isLoggedIn,async function(req,res){
  const user=await userModal.findOne({
    username: req.session.passport.user
  }).populate("posts")
  res.render("profile",{user});
})

router.post('/upload',isLoggedIn,upload.single("file"),async function(req, res, next) {
  if(!req.file){
    return res.status(404).send("No files were Uploaded");
  }
  const user = await userModal.findOne({username:req.session.passport.user})
  const post= await postModal.create({
    image:req.file.filename,
    imagetext:req.body.filecaption,
    user:user._id
  })

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

router.get('/feed', function(req, res, next) {
  res.render('feed');
});

router.post("/register",function(req,res){
  const { username, email, fullname } = req.body;
  const userdata = new userModal({ username, email, fullname });

  userModal.register(userdata,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile")
    })
  })
})


router.post('/login', passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:'/login',
  failureFlash:true,
}),function(req, res, next) {
});


router.get("/logout",function(req,res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
})


function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect('/login');
}



// router.get('/createuser', async function(req, res, next) {
// let createduser = await userModal.create({
//     fullname:"Om Mahesh Pethnai",
//     email:"om@male.com",
//     username: "om",
//     password: "om",
//     posts: [],
//   })
//   res.send(createduser);
// });

// router.get('/alluserposts', async function(req, res, next) {
// let user=await userModal
// .findOne({_id:"65b1269439b853160700ed81"});
// await user.populate("posts");
// res.send(user);
//   });

// router.get('/createpost', async function(req, res, next) {
//  let createdpost = await postModal.create({
//     postText:"hello everyone kaise ho sab log",
//     user:"65b1269439b853160700ed81"
//   });
//   let user=await userModal.findOne({_id:"65b1269439b853160700ed81"});
//   user.posts.push(createdpost._id);
//   await  user.save();
//   res.send("done");
//   });

module.exports = router;

const islogin = async (req,res,next)=>{
    if(req.session.user ){
        res.redirect('/home')
    }else{
        next()
    }
}

const sessionCheck = async (req, res, next) => {
        if (req.session.user) {
            return next();
        } else {
            return res.redirect('/login');
        }
}

module.exports = {islogin,sessionCheck}
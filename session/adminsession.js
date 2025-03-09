const islogin = async (req,res,next)=>{
    if(req.session.admin ){
        res.redirect('/admin/adminhome')
    }else{
        next()
    }
}

const sessionCheck = async (req, res, next) => {
        if (req.session.admin) {
            return next();
        } else {
            return res.redirect('/admin/login');
        }
}

module.exports = {islogin,sessionCheck}
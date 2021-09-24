const admin = {
    name: 'Sankar Prakash',
    email: 'billahranga@gmail.com',
    role: 'Admin'
}


const adminLogged = (req, res, next) => {
    if(req.params.email == 'billahranga@gmail.com'){
        req.user = admin
        next() 
    }else{
        return res.json({message: 'You are not logged in as a admin'})
    }
   
}

module.exports.adminLogged = adminLogged

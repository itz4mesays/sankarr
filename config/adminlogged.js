const admin = {
    name: 'Sankar Prakash',
    email: 'billahranga@gmail.com',
    role: 'Admin'
}


const adminLogged = (req, res, next) => {
    if(req.params.email == admin.email && admin.role == 'Admin'){
        req.user = admin
        next() 
    }else{
        req.user ? next() : res.sendStatus('You are not logged in as a admin')
    }
   
}

module.exports.adminLogged = adminLogged

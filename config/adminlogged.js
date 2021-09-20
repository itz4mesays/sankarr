const admin = {
    name: 'Sankar Prakash',
    email: 'sankarapp@gmail.com',
    password: 'sankarapp123',
    role: 'Admin'
}


const adminLogged = (req, res, next) => {
    if(admin.email == 'sankarapp@gmail.com' && admin.role == 'Admin'){
        req.user = admin
        next() 
    }else{
        req.user ? next() : res.sendStatus('You are not logged in as a admin')
    }
   
}

module.exports.adminLogged = adminLogged

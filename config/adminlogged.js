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
        res.sendStatus('You are not logged in as a admin')
    }
   
}

module.exports.adminLogged = adminLogged

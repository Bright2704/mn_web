// controllers/account.js
exports.AccountInfo = async (req, res) =>{
    try{
        res.send('Get profile information')
    }catch (err){
        console.log(err)
        res.status(500).json( {message : 'Server Error'})
    }
};

exports.AccountUpdate = async (req, res)=>{
    try{
        res.send('Update profile')
    }catch (err){
        console.log(err)
        res.status(500).json({ message : 'Server Error'})
    }
};

exports.AccountDelete = async (req, res) => {
    try{
        res.send('Account was delete already')
    }catch (err){
        console.log(err)
        res.status(500).json({ message : 'Server Error'})
    }
};
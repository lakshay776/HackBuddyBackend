import validator from 'validator'

function validateUser  (req,res,next){
    const {Name,DOB,email,password,phoneNumber} = req.body

    // basic field check
    if(!Name || !email || !password || !phoneNumber || !DOB){
        return res.status(400).json({message:'All fields are required'})
    }
    
    // email validation
    if(!validator.isEmail(email)){
        return res.status(400).json({message:'Invalid email format'})
    }

    // phone validation
    if(!validator.isMobilePhone(phoneNumber,'en-IN')){
        return res.status(400).json({message:'Invalid phone number'})
    }

    // password validation (minimum 6 characters)
    if(!validator.isLength(password,{min:6})){
        return res.status(400).json({message:'Password must be at least 6 characters'})
    }
     if(!validator.isDate(DOB,{format:'YYYY-MM-DD',strictMode:true})){
        return res.status(400).json({message:'Invalid date format (use YYYY-MM-DD)'})
    }
    next()
}
function loginValidator(req,res,next){
    const {email,password} = req.body
    if( !email || !password){
        return res.status(400).json({message:'All fields are required'})
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({message:'Invalid email format'})
    }
     if(!validator.isLength(password,{min:6})){
        return res.status(400).json({message:'Password must be at least 6 characters'})
    }
    next()

}
export {validateUser,loginValidator}



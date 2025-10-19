import validator from 'validator'

export const validateUser = (req,res,next)=>{
    const {name,DOB,email,password,phone} = req.body

    // basic field check
    if(!name || !email || !password || !phone){
        return res.status(400).json({message:'All fields are required'})
    }

    // email validation
    if(!validator.isEmail(email)){
        return res.status(400).json({message:'Invalid email format'})
    }

    // phone validation
    if(!validator.isMobilePhone(phone,'any',{strictMode:true})){
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


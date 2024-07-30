import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const registerUser = async (req,res) => {
    const { username, email, fullname, password } = req.body;

    // Validation
    if([username,email,fullname,password].some(data=>(!data || data.trim()===""))){
        res.status(400).json({
            message:"All fields are required!"
        });
        return;
    }

    // Check if user already exist
    const userExist=await User.exists({email:email});
    if(userExist){
        res.status(408).json({
            message:"User already exists, try to login"
        });
        return;
    }

    // get the local path of avatar and coverImage
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    // check for avatar
    if(!avatarLocalPath){
        res.status(409).json({
            message:"Avatar is required"
        });
        return;
    }

    // Uploading on cloudinary
    const avatarCloudinaryPath=await uploadOnCloudinary(avatarLocalPath);
    const coverImageCloudinaryPath=await uploadOnCloudinary(coverImageLocalPath);

    // check if uploaded successfully
    if(!avatarCloudinaryPath){
        res.status(409).json({
            message:"Avatar is required"
        });
        return;
    }

    // register user in db
    const user = await User.create({
        fullname,
        email,
        password,
        username:username.toLowerCase(),
        avatar:avatarCloudinaryPath?.url,
        coverImage:coverImageCloudinaryPath?.url || ""
    });

    // check if user created
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if(!createdUser){
        res.json({
            message:"User not created"
        });
        return;
    }

    res.status(201).json({
        data:createdUser,
        status:"success",
        statusCode:201,
        message:"User registered successfully"
    });
    console.log("User created successfully")
}

const loginUser = async (req,res) => {

    const {email,password}=req.body;

    if(!email || !password){
        res.status(400).json({
            "message":"Email and Password are required fields",
            "status":"Login Failed"
        });
        return;
    }

    const user = await User.findOne({email:email});
    if(!user){
        res.status(400).json({
            "message":"User does not exist, Try to register",
        });
        return;
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        res.status(400).json({
            "message":"Password is incorrect"
        });
        return;
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken=refreshToken;
    await user.save({validateBeforeSave:false});

    // sending cookie
    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json({
        "message":"Login successful",
        "data":user
    });
}

const logoutUser= async (req,res) => {
    await User.findByIdAndUpdate(req.user._id,{
        $set:{
            refreshToken:undefined
        }
    },{
        new:true
    });

    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json({
        "message":"User logged out successfully"
    })
}

export {
    registerUser,
    loginUser,
    logoutUser
};
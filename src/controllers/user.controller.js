import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const registerUser = async (req,res) => {
    const { username, email, fullname, password } = req.body;
    console.log(username,email,fullname,password);

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
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    // check for avatar
    if(!avatarLocalPath){
        res.status(409).json({
            message:"Avatar is required"
        });
        return;
    }

    // Uploading on cloudinary
    const avatarCloudinartPath=uploadOnCloudinary(avatarLocalPath);
    const coverImageCloudinartPath=uploadOnCloudinary(coverImageLocalPath);

    // check if uploaded successfully
    if(!avatarCloudinartPath){
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
        avatar:avatarCloudinartPath?.url,
        coverImage:coverImageCloudinartPath?.url || ""
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

export {registerUser};
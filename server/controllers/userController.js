import ErrorHandler from "../middlewares/error.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import twilio from "twilio";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";

export const register = catchAsyncError(async (req, res, next) => {
    try {
        const { name, email, phone, password, verificationMethod } = req.body;
        if (!name || !email || !phone || !password || !verificationMethod) {
            return next(new ErrorHandler("All fields are required.", 400));
        }
        function validatePhoneNumber(phone) {
            const phoneRegex = /^(?:\+8801|01)\d{9}$/;
            return phoneRegex.test(phone);
        }
        if (!validatePhoneNumber(phone)) {
            return next(new ErrorHandler("Invalid phone number.", 400));
        }

        const existingUser = await User.findOne({
            $or: [
                {
                    email,
                    accountVerified: true,
                },
                {
                    phone,
                    accountVerified: true,
                },
            ],
        });

        if (existingUser) {
            return next(new ErrorHandler("Phone or Email is already used.", 400));
        }

        const registerationAttemptsByUser = await User.find({
            $or: [
                { phone, accountVerified: false },
                { email, accountVerified: false },
            ],
        });


        if (registerationAttemptsByUser.length > 3) {
            return next(
                new ErrorHandler(
                    "You have exceeded the maximum number of attempts (3). Please try again after an hour.",
                    400
                )
            );
        }

        const userData = {
            name,
            email,
            phone,
            password,
        };

        const user = await User.create(userData);









    } catch (error) { }
});
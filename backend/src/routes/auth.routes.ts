import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
import * as schemas from '../validators/auth.validator';
import * as authController from '../controllers/auth.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/register',          validate(schemas.registerSchema),      asyncHandler(authController.register));
router.post('/verify-email',      validate(schemas.verifyEmailSchema),   asyncHandler(authController.verifyEmail));
router.post('/resend-email-otp',  validate(schemas.resendOtpSchema),     asyncHandler(authController.resendEmailOtp));
router.post('/login/request-otp', validate(schemas.loginRequestSchema),  asyncHandler(authController.requestLoginOtp));
router.post('/login/verify-otp',  validate(schemas.loginVerifySchema),   asyncHandler(authController.verifyLoginOtp));

export default router;

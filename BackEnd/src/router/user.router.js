import {Router} from "express"
import { registerUser,loginUser,logoutUser, getprofile, getAllOrganizer,getAllUsers, toggleFavorite, EditUserProfile, refreshAccessToken, verifyOtp, resendOtp, Emailvarification, changePassword,getAllAdmins, subscriptionStatus, getOrganizerAndAttendee, EditUser, deleteUser, getUserById, updateOrganizerStatus, deleteAdmin } from "../controller/User.controller.js"
import { isAuth } from "../middleware/Auth.middleware.js"
const router = Router()

router.post("/register",isAuth,registerUser)
router.post("/login",loginUser)
router.get("/logout",logoutUser)
router.get('/getprofile',isAuth,getprofile)
router.get('/allorganizer',getAllOrganizer)
router.get('/get-all-users',isAuth,getAllUsers)
router.get('/aad-favorite',isAuth,toggleFavorite)
router.put('/update-profile',isAuth,EditUserProfile)
router.get("/refresh-token", refreshAccessToken)
//  =================Otp===============
router.post('/verify-otp',verifyOtp)
router.post('/resend-otp',resendOtp)

router.post('/verify-email',Emailvarification)
router.post('/reset-password',changePassword)

router.get('/get-all-admins',isAuth,getAllAdmins)
router.put('/update-status',isAuth,subscriptionStatus)

router.get('/get-organizer-attendee',isAuth,getOrganizerAndAttendee)
router.put('/edit-user',isAuth,EditUser)

router.delete('/delete-user',isAuth,deleteUser)

router.post('/update-status-organizer',isAuth,updateOrganizerStatus)

router.get('/get-userby-id',isAuth,getUserById)

router.delete('/delete-admin',isAuth,deleteAdmin)

export default router
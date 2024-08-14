import { checkSchema } from "express-validator";

export default checkSchema({
   email: {
      errorMessage: "Email is required!",
      notEmpty: true,
      isEmail: {
         errorMessage: "Must be a valid e-mail address",
      },
      trim: true,
   },

   password: {
      errorMessage: "Password is required!",
      notEmpty: true,
      trim: true,
   },
});

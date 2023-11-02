import { checkSchema } from "express-validator";

export default checkSchema({
   email: {
      errorMessage: "Email is required!",
      notEmpty: true,
      isEmail:{
         errorMessage: 'Must be a valid e-mail address',
       },
       trim:true

   },
   firstName: {
      errorMessage: "firstName is required!",
      notEmpty: true,
   },
   lastName: {
      errorMessage: "lastName is required!",
      notEmpty: true,
   },
   password: {
      isLength: {
      options: { min: 6 },
      errorMessage: 'Password should be at least 8 chars',
    },
   },
});

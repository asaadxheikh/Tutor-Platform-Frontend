import { IFormValidation } from "../../types/alert";
import {
  ILoginRequest,
  IUserPassword,
  IRegistration,
} from "../../types/context/auth";
import { validateEmail } from "../common";
import { validationError } from "./errors";

export const validateCommonInformation = (
  user: IRegistration
): IFormValidation => {
  if (!user.first_name || !user.last_name || !user.password) {
    return {
      error: true,
      message: validationError("all.fields.required"),
    };
  }
  if (user.registration_source === "email") {
    if (!user.email) {
      return {
        error: true,
        message: validationError("all.fields.required"),
      };
    }
    if (!validateEmail(user.email)) {
      return {
        error: true,
        message: validationError("email.invalid"),
      };
    }
  } else {
    if (!user.phone) {
      return {
        error: true,
        message: validationError("all.fields.required"),
      };
    }
  }

  return {
    error: false,
    message: "",
  };
};

/**
 * Validate the login form
 * @param user
 * @returns
 */
export const validateLoginForm = (user: ILoginRequest): IFormValidation => {
  const { password, email } = user;
  if (!password || !email) {
    return {
      error: true,
      message: validationError("all.fields.required"),
    };
  }

  return {
    error: false,
    message: "",
  };
};

/**
 * Validate the change password form
 * @param user
 * @returns
 */
export const validateChangePasswordForm = (
  user: IUserPassword
): IFormValidation => {
  const { password, cpassword } = user;
  if (!password || !cpassword) {
    return {
      error: true,
      message: validationError("all.fields.required"),
    };
  }

  if (password.toLowerCase() !== cpassword.toLowerCase()) {
    return {
      error: true,
      message: validationError("passwords.matched"),
    };
  }

  return {
    error: false,
    message: "",
  };
};

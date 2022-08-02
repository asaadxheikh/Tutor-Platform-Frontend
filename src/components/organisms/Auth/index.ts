import {
  IFacebookLoginRequest,
  IRegistration,
} from "../../../types/context/auth";

export const defaultAuthFormState: IRegistration = {
  first_name: "",
  last_name: "",
  password: "",
  user_type: "Agent",
  phone: "",
  email: "",
  registration_source: "phone",
  referral_code: "",
};

export const defaultFacebookState: IFacebookLoginRequest = {
  accessToken: "",
  name: "",
  picture: "",
  registration_source: "facebook",
  user_type: "Agent" || "Student" || "Support",
  email: "",
  id: "",
};

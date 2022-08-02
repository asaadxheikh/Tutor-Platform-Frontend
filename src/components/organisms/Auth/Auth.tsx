import React, { FC, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { defaultAuthFormState } from ".";
import { currentAlertState } from "../../../stores/alert/selectors";
import { useDispatch, useSelector } from "../../../stores/rootReducer";
import PhoneInput, { Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import countryCode from '../../../ipcountrycode/ipcountrycode';
import {
  parsePhoneNumber,
  isPossiblePhoneNumber,
} from "react-phone-number-input";
import {
  authRequestInProcessing,
  doLoginUser,
  doRegisterUser,
} from "../../../stores/users";
import { IAlert } from "../../../types/alert";

import { ILoginRequest, IRegistration } from "../../../types/context/auth";
import { createModuleStyleExtractor } from "../../../utils/css";
import {
  validateCommonInformation,
  validateLoginForm,
} from "../../../utils/validation/validations";
import { Input } from "../../atoms/Input";
import { Loading } from "../../molecules/Loading/Loading";
import styles from "./Auth.module.scss";
import { useAuth } from "../../../hooks/useAuth";
import { noop } from "../../../utils/noop";
import { Modal } from "../../atoms/Modal";
import ForgotPasswordModal from "../../molecules/ForgotPasswordModal/ForgotPasswordModal";
import { useTranslation } from "react-i18next";

const cx = createModuleStyleExtractor(styles);
interface IAuth {
  onNotification: (alert: IAlert) => void;
  enableNotification?: boolean;
}
export const AuthPage: FC<IAuth> = ({
  onNotification,
  enableNotification = true,
}) => {
  const dispatch = useDispatch();
  const { token } = useAuth();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const newQueryParameters: URLSearchParams = new URLSearchParams();
  const navigate = useNavigate();
  const alert = useSelector(currentAlertState); // extract the alert state
  const [action, setAction] = useState<string>("Register");
  const [user, setUser] = useState<IRegistration>(defaultAuthFormState);
  const isRequestProcess = useSelector((store) =>
    authRequestInProcessing(store)
  );
  const [fieldtype, setFieldType] = useState(0);
  const [countryShortCode, setCountryShortCode] =useState<Country>("US");
  const _updateUIAction = (action: string) => {
    newQueryParameters.delete("action");
    setSearchParams(newQueryParameters);
    setAction(action);
  };

  /* to update the state */
  const updateState = (key: string, value: string) => {

    console.log(user,key,value);
    return (setUser({
      ...user,
      [key]: value,
    }));
  };

  const onSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (action === "Login") {

      console.log(user);
      const { error, message } = validateLoginForm(user as ILoginRequest);
      if (error) {
        return onNotification({
          type: "DANGER",
          message,
          active: true,
        });
      }
      if (user.email) {
        dispatch(doLoginUser({ email: user.email, password: user.password }));
      }
      return;
    }
    if (user.password.length < 8) {
      return onNotification({
        type: "DANGER",
        message: "Password length must be at least 8 characters long",
        active: true,
      });
    }

    const { registration_source } = user;
    const bucket: IRegistration = {
      ...(!!user.email &&
        registration_source === "email" && { email: `${user.email}` }),
      ...(!!user.phone &&
        registration_source === "phone" && {
        phone: `${user.phone}`,
      }),
      ...(!!user.referral_code && {
        referral_code: `${user.referral_code}`,
      }),
      password: user.password,
      user_type: user.user_type,
      registration_source: user.registration_source,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    const { error, message } = validateCommonInformation(bucket);
    if (error) {
      return onNotification({
        type: "DANGER",
        message,
        active: true,
      });
    }
    // if (bucket.registration_source === "phone") {
    //   /* check if it is valid phone number */
    //   if (bucket.phone) {
    //     if (!isPossiblePhoneNumber(bucket.phone)) {
    //       onNotification({
    //         type: "DANGER",
    //         message: "Invalid Phone Format",
    //         active: true,
    //       });
    //       return;
    //     }
    //   }
    // }
    const redirect_uri = searchParams.get("redirect_uri");
    !redirect_uri
      ? dispatch(doRegisterUser(bucket))
      : dispatch(doRegisterUser(bucket, redirect_uri));
  };

  /// watch the notification state and trigger notification
  useEffect(() => {
    alert.type === "SUCCESS" &&
      setUser({
        ...defaultAuthFormState,
        user_type: user.user_type,
      });
  }, [alert]);

  useEffect(() => {
    const action = searchParams.get("action");
    if (action) {
      setAction(`${action === "login" ? "Login" : "Register"}`);
    }

    const referral_code = searchParams.get("referral_code");
    const registration_source = searchParams.get("registration_source");
    if (referral_code) {
      setUser({
        ...user,
        user_type: "Student",
        ...(!!registration_source && { email: `${user.email}` }),
        referral_code,
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (token) navigate("/dashboard/messenger", { replace: true });
  }, [token]);

  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    console.log(`show : ${show}`);
  }, [show]);
  const fieldHandler =(v:any)=>{
    setFieldType(v);
  }
  useEffect(()=>{

    (async function(){
       const response = await countryCode();
       setCountryShortCode(response);
     })();
      
  },[]);
  return (
    <>
      <div className={cx("auth-container")}>
        <h2 className={cx("auth-container-heading")}>
          {action === "Register" ? t('Register.title') : t('Login.title')}{" "}
        </h2>
        {isRequestProcess && <Loading />}
        <form>
          {action === "Register" && (
            <div className={cx(["auth-container__row", "d-flex"])}>
              <div className={cx("auth-container__row-item")}>
                <label className={cx("auth-input-label")} htmlFor="fname">
                  {t('Register.firstname')}<span className={cx("required-label")}>*</span>
                </label>
                <Input
                  type="text"
                  id="first_name"
                  name="first_name"
                  className={"a-auth-input"}
                  value={user.first_name}
                  onChange={(value: string, name: string) =>
                    updateState(name, value)
                  }
                  placeholder={t('Register.firstname_placeholder')}
                />
              </div>
              <div className={cx(["auth-container__row-item", "ml-5"])}>
                <label className={cx("auth-input-label")} htmlFor="uname">
                  {t('Register.lastname')}<span className={cx("required-label")}>*</span>
                </label>
                <Input
                  type="text"
                  id="last_name"
                  name="last_name"
                  className={"a-auth-input"}
                  value={user.last_name}
                  onChange={(value: string, name: string) =>
                    updateState(name, value)
                  }
                  placeholder={t('Register.lastname_placeholder')}
                />
              </div>
            </div>
          )}
          {user.registration_source === "email" && action === "Register" && (
            <div className={cx(["auth-container__row"])}>
              <label className={cx("auth-input-label")} htmlFor="email">
                {t('Register.email')} <span className={cx("required-label")}>*</span>
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                className={"a-auth-input"}
                value={user.email}
                onChange={(value: string, name: string) =>
                  updateState(name, value)
                }
                placeholder={t('Register.email_placeholder')}
              />
            </div>
          )}
          {user.registration_source === "phone" && action === "Register" && (
            <div className={cx(["auth-container__row"])}>
              <label className={cx("auth-input-label")} htmlFor="phone">
                {t('Register.phone')} <span className={cx("required-label")}>*</span>
              </label>
              <PhoneInput
                placeholder={t('Register.phone_placeholder')}
                className={cx(["auth-phone-input", "a-auth-input"])}
                value={user.phone ?? undefined}
                international={true}
                defaultCountry={countryShortCode}
                onChange={(value: string) => updateState("phone", value)}
              />
            </div>
          )}
          {action === "Login" && (
            <div className={cx(["auth-container__row"])}>
              <label className={cx("auth-input-label")} htmlFor="phone">
                {t('Login.option')}{" "}
                <span className={cx("login-phone-info")}>
                  {t('Login.message')}
                </span>
                <span className={cx("required-label")}>*</span>
              </label>
              <Input
                type="text"
                id="email"
                name="email"
                className={"a-auth-input"}
                value={user.email}
                onChange={(value: string, name: string) =>
                  updateState(name, value)
                }
                placeholder="john@gmail.com / +1238402834820"
              />
            </div>
            
          )}
          <div className={cx(["auth-container__row"])}>
            <label className={cx("auth-input-label")} htmlFor="password">
              {t('Register.password')}
              <span className={cx("required-label")}>*</span>
            </label>

            <Input
              type="password"
              id="password"
              name="password"
              className={"a-auth-input"}
              value={user.password}
              onChange={(value: string, name: string) =>
                updateState(name, value)
              }
              placeholder={t('Register.password_placeholder')}
            />
          </div>
          {action === "Register" && (
            <div className={cx(["auth-container__row"])}>
              <label className={cx("auth-input-label")} htmlFor="rcode">
                {t('Register.referralCode')}
              </label>
              <Input
                type="text"
                id="referral_code"
                name="referral_code"
                className={"a-auth-input"}
                value={user.referral_code}
                onChange={(value: string, name: string) =>
                  updateState(name, value)
                }
                placeholder={t('Register.referralCode_placeholder')}
              />
            </div>
          )}
          {action === "Register" && (
            <div
              className={cx([
                "auth-container__row",
                "auth-container__radio-group",
              ])}
            >
              <div>
                <label>
                  <input
                    type={"radio"}
                    value={"Agent"}
                    checked={user.user_type === "Agent"}
                    className={cx("user-type-radio")}
                    onChange={() =>
                      updateState(
                        "user_type",
                        user.user_type === "Student" ? "Agent" : "Student"
                      )
                    }
                  />
                  <span className={cx("user-type-radio-label")}>{t('Register.agent')} </span>
                </label>
              </div>

              <div>
                <label>
                  <input
                    type={"radio"}
                    value={"Student"}
                    className={cx("user-type-radio")}
                    checked={user.user_type === "Student"}
                    onChange={() =>
                      updateState(
                        "user_type",
                        user.user_type === "Student" ? "Agent" : "Student"
                      )
                    }
                  />
                  <span className={cx("user-type-radio-label")}>{t('Register.student')} </span>
                </label>
              </div>
            </div>
          )}

          <p className={cx(["lost-password-link"])}>
            {"Lost Password ? "}
            <button
              type="button"
              className={cx("login")}
              onClick={() => setShow(!show)}
            >
              {"Reset now"}
            </button>
          </p>
          <div className={cx(["auth-container__row"])}>
            <button
              type="submit"
              className={cx("signup")}
              onClick={(event) => onSubmit(event)}
              disabled={isRequestProcess}
            >
              {action === "Register" ? t('Register.signup') : t('Register.login')}
            </button>
          </div>
        </form>

        <p className={cx(["content-center", "action-already"])}>
          {action === "Register"
            ? t('Register.alreadyanAccount')
            : t('Register.notanAccount')}
          <button
            type="button"
            className={cx("login")}
            onClick={() => {
              _updateUIAction(action === "Register" ? "Login" : "Register");
            }}
          >
            {action === "Register" ? t('Register.login') : t('Register.register')}
          </button>
        </p>
        <div className={cx("divider")}>
          <span className={cx("divider-line")}></span>
          <span className={cx("divider-or")}>Or</span>
          <span className={cx("divider-line")}></span>
        </div>

        {/* facebook login */}

        <button className={cx("button-signup-facebook")}>
          <img src="/assets/images/facebook.svg" />
          Sign up with Facebook
        </button>
        {/* facebook login end */}
        <button className={cx("button-signup-google")}>
          <img src="/assets/images/google.svg" />
          Sign up with Google
        </button>

        <button
          className={cx("button-signup-google")}
          onClick={() =>
            updateState(
              "registration_source",
              user.registration_source === "email" ? "phone" : "email"
            )
          }
        >
          {user.registration_source !== "email" ? (
            <i className="fa fa-envelope" color="#6b7280" />
          ) : (
            <i className="fa fa-phone" />
          )}
          {t('Register.signupwith')}{" "}
          {user.registration_source === "email" ? t('Register.wayPhone') : t('Register.wayEmail')}
        </button>
      </div>

      <ForgotPasswordModal toggle={show} onClose={() => setShow(false)} />
    </>
  );
};

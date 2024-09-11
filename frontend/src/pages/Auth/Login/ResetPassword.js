import React from "react";

import { ResetPasswordForm } from "../../../components/Auth/Register";

/**
 * Page for password reset.
 */
const ResetPassword = () => {
  return (
    <div>
      <div
        className={`flex h-screen w-screen items-center justify-center bg-gray-50 from-gray-900 to-gray-600 p-5`}
      >
        <div
          className={`mb-4 flex w-full flex-col rounded bg-white px-8 pb-8 pt-6 shadow-md md:w-1/3`}
        >
          <div
            className={`m-auto w-6/12 text-center font-sentinent-bold text-xl font-bold text-theme-primary md:text-3xl`}
          >
            BrainBridge
            <p className={`text-lg text-black`}>Reset your password</p>
          </div>
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

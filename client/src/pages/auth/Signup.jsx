import { useTitle, useAuthContext } from "@hooks";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { FormFields, FormUi } from "@layouts";
import { useState, useEffect } from "react";
import { registerOptions } from "@utils";
import { userService } from "@services";
import { toast } from "react-toastify";

export default function Signup() {
  useTitle("Signup to PINSHOT");
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const { loggedInUser } = useAuthContext() || {};
  const from = location.state?.from || "/";
  useEffect(() => {
    if (loggedInUser) {
      navigate(from, { replace: true });
    }
  }, [from, loggedInUser, navigate]);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  const onFormSubmit = async ({ userName, email, password }) => {
    try {
      const { status, data } = await userService.signup(
        userName,
        email,
        password
      );
      if (status === 201) {
        localStorage.setItem("userToken", JSON.stringify(data.access_token));
        toast.success(data.msg);
        window.location.replace("/");
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response?.data?.error);
      } else {
        toast.error(error.response?.data || "Something went wrong");
      }
    }
  };

  return (
    <FormUi
      title="Welcome, Sign Up"
      info="Already have an account?"
      to="/login"
      path="login"
      btnText="Signup"
      onSubmit={handleSubmit(onFormSubmit)}
      isSubmitting={isSubmitting}
    >
      <FormFields
        register={register}
        errors={errors?.userName}
        registerOptions={registerOptions?.userName}
        className="my-4 text-black"
        id="userName"
        label="Username"
        name="userName"
        type="text"
        placeholder="Username"
      />
      <FormFields
        register={register}
        errors={errors?.email}
        registerOptions={registerOptions?.email}
        className="my-4 text-black"
        id="email"
        label="Email"
        name="email"
        type="email"
        placeholder="Email"
      />
      <FormFields
        register={register}
        errors={errors?.password}
        registerOptions={registerOptions?.password}
        className="my-1 text-black position-relative"
        id="password"
        label="Password"
        name="password"
        type="password"
        placeholder="Password"
        showPassword={showPassword}
        togglePassword={togglePassword}
      />
    </FormUi>
  );
}

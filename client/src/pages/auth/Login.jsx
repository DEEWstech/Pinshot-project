import { useTitle, useAuthContext } from "@hooks";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FormFields, FormUi } from "@layouts";
import { useState, useEffect } from "react";
import { registerOptions } from "@utils";
import { userService } from "@services";
import { toast } from "react-toastify";

export default function Login() {
  useTitle("Login to PINSHOT");

  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { userName: sessionStorage.getItem("username") || "" },
  });
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

  const onFormSubmit = async ({ userName, password }) => {
    sessionStorage.setItem("username", userName);
    try {
      const { status, data } = await userService.login(userName, password);
      if (status === 200) {
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
      title="Welcome, Login"
      info="Don't have an account?"
      to="/signup"
      path="Sign Up"
      btnText="Login"
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
      <div
        className="w-100 text-end my-2"
        style={{ color: "var(--orangeLight)", fontweight: 500 }}
      >
        <Link to="/forgot-password">Forgot Password</Link>
      </div>
    </FormUi>
  );
}

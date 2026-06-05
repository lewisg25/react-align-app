import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginUser, registerAccount, saveAuth } from "../src/api";

const formStart = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  yearsTogether: "",
};

const signupFields = [
  {
    id: "firstName",
    label: "First Name",
    placeholder: "Enter First Name",
    required: true,
  },
  { id: "lastName", label: "Last Name", placeholder: "Enter Last Name" },
  {
    id: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Repeat Password",
    required: true,
  },
  {
    id: "yearsTogether",
    label: "Years Together",
    type: "number",
    min: "0",
    placeholder: "0",
  },
];

const loginFields = [
  { id: "email", label: "Email", type: "email", placeholder: "Enter Email", required: true },
  { id: "password", label: "Password", type: "password", placeholder: "Enter Password", required: true },
];

function AuthField({ id, label, form, onChange, type = "text", ...props }) {
  const inputId = id.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

  return (
    <div className="input-group">
      <label htmlFor={inputId}>
        <b>{label}</b>
      </label>
      <input
        id={inputId}
        name={id}
        type={type}
        value={form[id]}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}

const Login = () => {
  const [searchParams] = useSearchParams();
  const requestedMode = searchParams.get("mode");
  const requestedRedirect = searchParams.get("redirect");
  const redirectPath =
    requestedRedirect?.startsWith("/") && !requestedRedirect.startsWith("//")
      ? requestedRedirect
      : "/dashboard";
  const [showForm, setShowForm] = useState(
    requestedMode === "signup" || requestedMode === "login"
  );
  const [isLoginView, setIsLoginView] = useState(requestedMode !== "signup");
  const [form, setForm] = useState(formStart);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (requestedMode !== "signup" && requestedMode !== "login") return;

    setShowForm(true);
    setIsLoginView(requestedMode !== "signup");
  }, [requestedMode]);

  const handleChange = ({ target }) => {
    setForm((currentForm) => ({ ...currentForm, [target.name]: target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email || !form.password)
      return setError("Please fill in all fields.");
    if (!isLoginView && !form.firstName.trim())
      return setError("Please enter your first name.");
    if (!isLoginView && form.password !== form.confirmPassword)
      return setError("Passwords do not match.");

    setError("");
    setIsSubmitting(true);

    try {
      const auth = isLoginView
        ? await loginUser({ email: form.email, password: form.password })
        : await registerAccount(form);

      saveAuth(auth);
      navigate(redirectPath);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleView = (isLogin) => {
    setIsLoginView(isLogin);
    setError("");
    setForm((currentForm) => ({
      ...currentForm,
      password: "",
      confirmPassword: "",
    }));
  };

  const openForm = (isLogin) => {
    setShowForm(true);
    handleToggleView(isLogin);
  };

  if (!showForm) {
    return (
      <div className="landing-container">
        <h2>Welcome</h2>
        <div className="landing-actions">
          <button onClick={() => openForm(true)} className="btn-signin">
            Sign In
          </button>
          <button onClick={() => openForm(false)} className="btn-signup">
            Create Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>{isLoginView ? "Sign In" : "Create Account"}</h2>

      <div className="form-tabs">
        {[true, false].map((isLogin) => (
          <button
            key={isLogin ? "login" : "register"}
            type="button"
            onClick={() => handleToggleView(isLogin)}
            className={isLoginView === isLogin ? "tab-active" : "tab-inactive"}
          >
            {isLogin ? "Login" : "Register"}
          </button>
        ))}
      </div>

      {error && <p className="error-message">{error}</p>}

      <main>
        <form onSubmit={handleSubmit}>
          {!isLoginView && (
            <div className="name-grid">
              {signupFields.slice(0, 2).map((field) => (
                <AuthField
                  key={field.id}
                  form={form}
                  onChange={handleChange}
                  {...field}
                />
              ))}
            </div>
          )}

          {loginFields.map((field) => (
            <AuthField
              key={field.id}
              form={form}
              onChange={handleChange}
              {...field}
            />
          ))}

          {!isLoginView &&
            signupFields
              .slice(2)
              .map((field) => (
                <AuthField
                  key={field.id}
                  form={form}
                  onChange={handleChange}
                  {...field}
                />
              ))}

          <div className="form-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Please wait..."
                : isLoginView
                ? "Login"
                : "Sign Up"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Login;

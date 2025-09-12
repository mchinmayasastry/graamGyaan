import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // install lucide-react if not already: npm install lucide-react

export function LoginSignup({ onSuccess, onBack }: { onSuccess: () => void; onBack: () => void }) {
  const [mode, setMode] = useState<"start" | "login" | "signup">("start");
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [passwordError, setPasswordError] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  function generateCaptcha() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let text = "";
    for (let i = 0; i < 5; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return text;
  }

  function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const pass = (e.currentTarget.elements.namedItem("setPassword") as HTMLInputElement).value;
    const confirm = (e.currentTarget.elements.namedItem("confirmPassword") as HTMLInputElement).value;
    const enteredCaptcha = (e.currentTarget.elements.namedItem("captchaInput") as HTMLInputElement).value;

    let valid = true;

    if (pass !== confirm) {
      setPasswordError("Passwords do not match");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (enteredCaptcha !== captcha) {
      setCaptchaError("Captcha incorrect");
      valid = false;
    } else {
      setCaptchaError("");
    }

    if (valid) {
      alert("Signup successful! 🎉");
      onSuccess();
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        {mode === "start" && (
          <>
            <h1 className="text-xl font-bold text-center text-blue-800 mb-2">Welcome Student</h1>
            <p className="text-center text-gray-600 mb-4">Are you new or already registered?</p>
            <button
              className="w-full p-3 bg-blue-900 text-white rounded-lg mb-2"
              onClick={() => setMode("login")}
            >
              Already Registered
            </button>
            <button
              className="w-full p-3 bg-gray-300 text-blue-800 rounded-lg"
              onClick={() => setMode("signup")}
            >
              New Student
            </button>
            <p className="text-center text-blue-600 cursor-pointer mt-2" onClick={onBack}>
              ⬅ Back
            </p>
          </>
        )}

        {/* Login */}
        {mode === "login" && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              onSuccess();
            }}
          >
            <h1 className="text-xl font-bold text-center text-blue-800">Login</h1>
            <div>
              <label className="block font-medium">Email</label>
              <input type="email" required className="w-full p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block font-medium">Password</label>
              <div className="relative">
                <input
                  type={showLoginPass ? "text" : "password"}
                  required
                  className="w-full p-2 border rounded-lg pr-10"
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-500"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                >
                  {showLoginPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full p-3 bg-blue-900 text-white rounded-lg">
              Login
            </button>
            <p className="text-center text-blue-600 cursor-pointer mt-2" onClick={() => setMode("start")}>
              ⬅ Back
            </p>
          </form>
        )}

        {/* Signup */}
        {mode === "signup" && (
          <form className="space-y-3" onSubmit={handleSignup}>
            <h1 className="text-xl font-bold text-center text-blue-800">Sign Up</h1>
            <div>
              <label className="block font-medium">Full Name</label>
              <input type="text" required className="w-full p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block font-medium">Phone</label>
              <input type="tel" required pattern="[0-9]{10}" className="w-full p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block font-medium">Email</label>
              <input type="email" required className="w-full p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block font-medium">Set Password</label>
              <div className="relative">
                <input
                  type={showSignupPass ? "text" : "password"}
                  name="setPassword"
                  required
                  pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\":{}|<>]).{8,}$"
                  className="w-full p-2 border rounded-lg pr-10"
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-500"
                  onClick={() => setShowSignupPass(!showSignupPass)}
                >
                  {showSignupPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block font-medium">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  name="confirmPassword"
                  required
                  className="w-full p-2 border rounded-lg pr-10"
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-500"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                >
                  {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}
            </div>
            <div>
              <label className="block font-medium">Captcha</label>
              <div className="bg-gray-100 p-2 rounded-lg text-center font-bold tracking-widest">
                {captcha}
              </div>
              <input type="text" name="captchaInput" required className="w-full p-2 border rounded-lg mt-1" />
              {captchaError && <p className="text-red-600 text-sm">{captchaError}</p>}
            </div>
            <button type="submit" className="w-full p-3 bg-blue-900 text-white rounded-lg">
              Sign Up
            </button>
            <p className="text-center text-blue-600 cursor-pointer mt-2" onClick={() => setMode("start")}>
              ⬅ Back
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export default function FloatingInput({
  icon: Icon,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  label,
  autoComplete,
  required = true,
  showPassword,
  setShowPassword,
  variants,
}) {
  const passwordField = type === "password";

  return (
    <motion.div
      className="field"
      variants={variants}
      whileFocus={{ scale: 1.01 }}
    >
      <Icon
        size={19}
        strokeWidth={2.2}
        className="field__icon"
      />

      <input
        type={
          passwordField
            ? showPassword
              ? "text"
              : "password"
            : type
        }
        name={name}
        value={value}
        onChange={onChange}
        placeholder=" "
        autoComplete={autoComplete}
        required={required}
      />

      <label>{label}</label>

      {passwordField && (
        <button
          type="button"
          className="field__toggle"
          onClick={() =>
            setShowPassword((prev) => !prev)
          }
        >
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      )}
    </motion.div>
  );
}
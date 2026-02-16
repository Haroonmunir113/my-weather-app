// "use client";

// import { useState } from "react";

// export default function SignupPage() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [message, setMessage] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();

//     const res = await fetch("/api/signup", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(formData),
//     });

//     const data = await res.json();

//     setMessage(data.success ? "Signup successful ✅" : data.error);
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
//       >
//         <h1 className="text-2xl font-bold mb-4">Signup</h1>

//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           onChange={handleChange}
//           className="w-full border p-2 mb-3 rounded"
//         />

//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           onChange={handleChange}
//           className="w-full border p-2 mb-3 rounded"
//         />

//         {/* Password Field with Show/Hide */}
//         <div className="relative mb-3">
//           <input
//             type={showPassword ? "text" : "password"}
//             name="password"
//             placeholder="Password"
//             onChange={handleChange}
//             className="w-full border p-2 rounded pr-16"
//           />

//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-500"
//           >
//             {showPassword ? "Hide" : "Show"}
//           </button>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white p-2 rounded"
//         >
//           Signup
//         </button>

//         {message && (
//           <p className="mt-3 text-center text-sm">{message}</p>
//         )}
//       </form>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setMessage(data.success ? "Signup successful " : data.error);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Signup</h1>

        <input name="name" placeholder="Name" onChange={handleChange} className="w-full border p-2 mb-3 rounded" />
        <input name="email" placeholder="Email" onChange={handleChange} className="w-full border p-2 mb-3 rounded" />

        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border p-2 rounded pr-16"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-500"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Signup</button>

        <Link href="/" className="block mt-3 w-full text-center text-blue-500">
          Already have an account? Login
        </Link>

        {message && <p className="mt-3 text-center text-sm">{message}</p>}
      </form>
    </div>
  );
}
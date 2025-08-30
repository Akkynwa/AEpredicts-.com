import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      navigate("/admin/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto border rounded">
      <h2 className="text-xl font-bold mb-3">Admin Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="block mb-2 w-full border p-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block mb-2 w-full border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const AdminLogin = () => {
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = (e) => {
//     e.preventDefault();
//     if (password === "secret123") { // temporary password
//       localStorage.setItem("isAdmin", "true");
//       navigate("/admin/dashboard");
//     } else {
//       alert("Wrong password!");
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: "50px auto" }}>
//       <h3>Admin Login</h3>
//       <form onSubmit={handleLogin}>
//         <input
//           type="password"
//           className="form-control mb-2"
//           placeholder="Enter admin password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button className="btn btn-primary w-100">Login</button>
//       </form>
//     </div>
//   );
// };

// export default AdminLogin;

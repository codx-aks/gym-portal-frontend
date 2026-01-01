import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config.ts";

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) {
      navigate("/");
      return;
    }

    // Redirect to backend callback endpoint
    window.location.href = `${API_BASE_URL}/auth/callback?code=${code}`;
  }, [navigate]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-white">
      <p className="text-gray-600">Completing login…</p>
    </div>
  );
}

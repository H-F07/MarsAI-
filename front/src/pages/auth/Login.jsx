import { Link, useNavigate, useSearchParams } from "react-router";

import { login } from "../../api/auth.js";
import { useMutation } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export function Login() {
  if (localStorage.getItem("username")) {
    return (
      <>
        <h1 className="text-2xl">
          You are already logged in as {localStorage.getItem("username")}
        </h1>
        <Link to="/">Go to Home</Link>
      </>
    );
  }

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reasonForbidden = searchParams.get("reason") === "forbidden";

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      return await login(data);
    },
    onSuccess: (response) => {
      const { user, token } = response.data;

      localStorage.setItem("username", user.username);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", String(user.id));
      localStorage.setItem("token", token);

      switch (user.role) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "JURY":
          navigate("/jury-dashboard");
          break;
        default:
          navigate("/");
          break;
      }
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Identifiants invalides");
    },
  });

  function onSubmit(data) {
    return loginMutation.mutate(data);
  }
  return (
    <>
      <h1 className="text-2xl">Login</h1>

      {reasonForbidden && (
        <p className="mb-4 p-3 bg-amber-500/20 border border-amber-500/40 text-amber-200 rounded-lg text-sm">
          Accès refusé. Vos droits ont peut-être changé — reconnectez-vous avec un compte administrateur pour accéder à l’admin.
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" id="id" {...register("id")} />
        <label
          htmlFor="username"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          placeholder="Votre nom d'utilisateur"
          {...register("username")}
          required
        />

        <label
          htmlFor="password"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Votre mot de passe"
          {...register("password")}
          required
        />

        <button type="submit">Login</button>
      </form>

      <Link to="/auth/register">No account yet? Register</Link>
    </>
  );
}

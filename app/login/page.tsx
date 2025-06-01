"use client";
import { FormEvent, useState } from "react";
import { loginUser } from "../apiCalls/authentication";
import { setToken } from "@/lib/localStorageUtils";

export default function Login() {
	// if already logged in, redirect to home
	if (typeof window !== 'undefined' && localStorage.getItem('token')) {
		window.location.href = '/';
		return null; // Prevent rendering the component
	}

  const [message, setMessage] = useState<string>("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    await loginUser(email, password)
      .then((token) => {
        if (token === "2FA_REQUIRED") {
          localStorage.setItem('email', email);
          window.location.href = '/2fa/verify';
        } else {
          setToken(token);
          window.location.href = '/';
        }
      })
      .catch((error) => {
        setMessage(error.message || "An error occurred during login. Please try again.");
      }
    );
  }

	// if not logged in, render the login form
  return(
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-300">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} method="POST" className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-300">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Enter your email"
                  className="block w-full rounded-md bg-gray-900 px-3 py-1.5 text-base text-gray-300 outline-1 -outline-offset-1 outline-gray-600 placeholder:text-gray-600 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-300">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                	placeholder="Enter your password"
                  className="block w-full rounded-md bg-gray-900 px-3 py-1.5 text-base text-gray-300 outline-1 -outline-offset-1 outline-gray-600 placeholder:text-gray-600 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not a member?{' '}
            <a href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Create an account
            </a>
          </p>
          <p className="mt-2 text-center text-sm/6 text-red-500">
            {message}
          </p>
        </div>
      </div>
    </>
  )
}
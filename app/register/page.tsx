"use client";
import { FormEvent } from "react";
import { registerUser } from "../apiCalls/authentication";

export default function Register() {

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
				event.preventDefault();
				const formData = new FormData(event.currentTarget);
				const firstName = formData.get('firstName') as string;
				const lastName = formData.get('lastName') as string;
				const phone = formData.get('phone') as string;
				const email = formData.get('email') as string;
				const password = formData.get('password') as string;

				registerUser(firstName, lastName, phone, email, password)
					.then(() => {
						window.location.href = '/login';
					}
					)
					.catch((error) => {
						alert(error.message);
					}
				);
    }

    return (
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-300">
            Create an account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} method="POST" className="space-y-6">

            <div>
              <label htmlFor="firstName" className="block text-sm/6 font-medium text-gray-300">
                First Name
              </label>
              <div className="mt-2">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  autoComplete="given-name"
                  placeholder="Enter your first name"
                  className="block w-full rounded-md bg-gray-900 px-3 py-1.5 text-base text-gray-300 outline-1 -outline-offset-1 outline-gray-600 placeholder:text-gray-600 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm/6 font-medium text-gray-300">
                Last Name
              </label>
              <div className="mt-2">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  autoComplete="family-name"
                  placeholder="Enter your last name"
                  className="block w-full rounded-md bg-gray-900 px-3 py-1.5 text-base text-gray-300 outline-1 -outline-offset-1 outline-gray-600 placeholder:text-gray-600 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm/6 font-medium text-gray-300">
                Phone number
              </label>
              <div className="mt-2">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="Enter your phone number"
                  className="block w-full rounded-md bg-gray-900 px-3 py-1.5 text-base text-gray-300 outline-1 -outline-offset-1 outline-gray-600 placeholder:text-gray-600 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

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
                Register
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Already a member?{' '}
            <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
							Sign in to your account
            </a>
          </p>
        </div>
			</div>
    )
}
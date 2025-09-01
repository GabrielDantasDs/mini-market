"use client";

import { Formik } from "formik";
import Image from "next/image";
import { login } from "@/app/api/route";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

type loginForm = {
	email: string;
	password: string;
};

export default function Home() {
	const router = useRouter();

	const onSubmit = async (values: loginForm) => {
		await login(values).then(res => {
			if (res.status == 200) {
				router.push("/home");
			}
		}).catch(err => {
			console.log(err)
			Swal.fire('Ops', err.response.data, 'error');
			return
		})
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-black">
			<div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
				{/* Market cart icon */}
				<div className="mb-4">
					<Image
						src={"/cart.svg"}
						width={100}
						height={100}
						alt="Logo"
					/>
				</div>
				<h1 className="text-2xl font-bold text-black mb-6">
					Mini-market
				</h1>
				<Formik
					initialValues={{ email: "", password: "" }}
					validate={(values) => {
						const errors: { email?: string; password?: string } =
							{};

						if (!values.email) {
							errors.email = "Required";
						} else if (
							!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
								values.email
							)
						) {
							errors.email = "Invalid email address";
						}

						return errors;
					}}
					onSubmit={(values) => {
						onSubmit(values);
					}}
				>
					{({
						values,
						errors,
						touched,
						handleChange,
						handleBlur,
						handleSubmit,
						isSubmitting,
					}) => (
						<form
							onSubmit={handleSubmit}
							className="w-full flex flex-col gap-4"
						>
							<input
								type="text"
								placeholder="Username"
								name="email"
								className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.email}
							/>
							<input
								type="password"
								placeholder="Password"
								name="password"
								className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.password}
							/>
							<button
								type="submit"
								className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors cursor-pointer"
							>
								Sign In
							</button>
							<div className="flex items-center my-2">
								<div className="flex-grow h-px bg-gray-200" />
								<span className="mx-2 text-gray-400 text-xs">
									or
								</span>
								<div className="flex-grow h-px bg-gray-200" />
							</div>
							<button
								type="button"
								className="flex items-center justify-center gap-2 border border-gray-300 rounded py-2 font-semibold text-black hover:bg-blue-50 transition-colors"
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 48 48"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g>
										<path
											d="M44.5 20H24V28.5H36.7C35.1 33.1 30.2 36 24 36C16.8 36 11 30.2 11 23C11 15.8 16.8 10 24 10C27.1 10 29.9 11.1 32.1 13L38.1 7C34.4 3.7 29.5 1.5 24 1.5C11.8 1.5 1.5 11.8 1.5 24C1.5 36.2 11.8 46.5 24 46.5C36.2 46.5 46.5 36.2 46.5 24C46.5 22.7 46.4 21.4 46.2 20.1L44.5 20Z"
											fill="#FFC107"
										/>
										<path
											d="M6.3 14.7L13.1 19.6C15.1 15.2 19.2 12 24 12C27.1 12 29.9 13.1 32.1 15L38.1 9C34.4 5.7 29.5 3.5 24 3.5C16.8 3.5 10.5 8.7 6.3 14.7Z"
											fill="#FF3D00"
										/>
										<path
											d="M24 46.5C30.2 46.5 35.1 43.3 36.7 38.7L29.3 33.6C27.5 34.7 25.4 35.5 23 35.5C16.8 35.5 11 29.7 11 22.5C11 21.3 11.2 20.1 11.5 19L4.7 14.1C2.7 17.5 1.5 21.6 1.5 24C1.5 36.2 11.8 46.5 24 46.5Z"
											fill="#4CAF50"
										/>
										<path
											d="M46.5 24C46.5 22.7 46.4 21.4 46.2 20.1L44.5 20H24V28.5H36.7C35.9 30.7 34.3 32.6 32.1 34L38.1 39C41.6 35.8 44.5 30.5 44.5 24Z"
											fill="#1976D2"
										/>
									</g>
								</svg>
								Login with Google
							</button>
						</form>
					)}
				</Formik>
				<p className="mt-6 text-sm text-gray-500">
					Don't have an account?{" "}
					<Link href="/register">Sign Up</Link>
				</p>
			</div>
		</div>
	);
}

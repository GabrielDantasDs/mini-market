"use client";

import { Formik } from "formik";
import Image from "next/image";
import { register } from "@/app/api/route";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import TextInput from "@/components/TextInput";

type RegisterForm = {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
};

export default function Home() {
	const router = useRouter();

	const onSubmit = async (values: RegisterForm) => {
		await register(values).then((res) => {
			if (res.status == 200) {
				Swal.fire(
					"Sucesso",
					"Usuário criado com sucesso.",
					"success"
				).then((res) => {
					if (res.isConfirmed || res.isDismissed) {
						router.push("/");
					}
				});
			}
		});
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
					initialValues={{
						name: "",
						email: "",
						password: "",
						confirmPassword: "",
					}}
					validate={(values) => {
						const errors: {
							name?: string;
							email?: string;
							password?: string;
							confirmPassword?: string;
						} = {};

						if (!values.email) {
							errors.email = "Required";
						} else if (
							!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
								values.email
							)
						) {
							errors.email = "Invalid email address";
						}

						if (!values.name) {
							errors.name = "Required";
						}

						if (!values.password) {
							errors.password = "Required";
						}

						if (!values.confirmPassword) {
							errors.confirmPassword = "Required";
						}

						if (values.confirmPassword && values.password) {
							if (values.confirmPassword != values.password) {
								errors.confirmPassword = "Passwords dont match";
								errors.password = "Passwords dont match";
							}
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
							<TextInput label="Name" name="name" type="text" />
							<TextInput label="Email" name="email" type="text" />
							<TextInput
								label="Password"
								name="password"
								type="password"
							/>
							<TextInput
								label="Password"
								name="confirmPassword"
								type="password"
							/>

							<button
								type="submit"
								className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors cursor-pointer"
							>
								Sign Up
							</button>
						</form>
					)}
				</Formik>
				<p className="mt-6 text-sm text-gray-500">
					Don't have an account?{" "}
					<a href="#" className="text-blue-600 hover:underline">
						Sign up
					</a>
				</p>
			</div>
		</div>
	);
}

"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { CartProvider } from "@/components/CartContext";
import { useRouter, usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const sidebarRef = useRef<HTMLDivElement | null>(null);
	const router = useRouter();
	const pathname = usePathname();
	const prevPath = useRef(pathname);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				sidebarRef.current &&
				!sidebarRef.current.contains(event.target as Node) &&
				isMobile
			) {
				setIsOpen(false);
			}
		}

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		const checkDevice = () => {
			setIsMobile(window.innerWidth <= 768); // breakpoint for mobile
			if (window.innerWidth > 768) {
				setIsOpen(true);
			}
		};

		checkDevice(); // check on mount
		window.addEventListener("resize", checkDevice);

		return () => {
			window.removeEventListener("resize", checkDevice);
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, pathname]);

	useEffect(() => {
		if (prevPath.current !== pathname) {
			setIsOpen(false);
			prevPath.current = pathname;
		}
	}, [pathname]);

	const LogOut = () => {
		document.cookie =
			"auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		router.push("/");
	};

	return (
		<CartProvider>
			<div className="flex h-screen">
				{/* Botão de menu para mobile */}
				<button
					onClick={() => setIsOpen(true)}
					className="absolute top-4 left-4 z-50 md:hidden p-2 bg-gray-200 rounded-lg text-black"
				>
					<Menu />
				</button>

				{/* Overlay escuro ao abrir a sidebar */}
				{isOpen && (
					<div className="fixed inset-0 bg-opacity-40 z-40 md:hidden"></div>
				)}

				{/* Sidebar */}
				<motion.div
					ref={sidebarRef}
					initial={{ x: "-100%" }}
					animate={{ x: isOpen ? "0%" : "-100%" }}
					transition={{ duration: 0.3 }}
					className="fixed md:static top-0 left-0 h-full w-64 bg-white shadow-lg z-50 p-4"
				>
					{/* Botão fechar */}
					<button
						onClick={() => setIsOpen(false)}
						className="md:hidden mb-4 p-2 bg-gray-200 rounded-lg text-black"
					>
						<X />
					</button>

					<nav className="flex flex-col gap-4">
						<Link
							href="/home"
							className="hover:text-blue-500 text-black"
						>
							Home
						</Link>
						<Link
							href="/home/products"
							className="hover:text-blue-500 text-black"
						>
							Products
						</Link>
						<Link
							href="/profile"
							className="hover:text-blue-500 text-black"
						>
							Profile
						</Link>
						<Link
							href="/home/scanner"
							className="hover:text-blue-500 text-black"
						>
							Scanner
						</Link>
						<Link
							href="/home/cart"
							className="hover:text-blue-500 text-black"
						>
							Cart
						</Link>
						<button
							className="cursor-pointer w-full text-left hover:text-blue-500 text-black"
							onClick={(e) => {
								e.preventDefault();
								LogOut();
							}}
						>
							Logout
						</button>
					</nav>
				</motion.div>

				{/* Conteúdo principal */}
				<main className="flex-1">{children}</main>
			</div>
		</CartProvider>
	);
}

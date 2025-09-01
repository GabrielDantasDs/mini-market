"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
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
          <a href="/home" className="hover:text-blue-500 text-black">Home</a>
          <Link href="/home/products" className="hover:text-blue-500 text-black">Products</Link>
          <a href="/profile" className="hover:text-blue-500 text-black">Profile</a>
          <a href="/scanner" className="hover:text-blue-500 text-black">Scanner</a>
        </nav>
      </motion.div>

      {/* Conteúdo principal */}
      <main className="flex-1">{children}</main>
    </div>
  );
}

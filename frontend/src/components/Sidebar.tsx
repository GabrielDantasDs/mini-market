"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Home, Settings } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Botão Mobile */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden p-2 m-2 rounded-lg bg-gray-100 hover:bg-gray-200"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar (Mobile e Desktop) */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: open ? "0%" : "-100%" }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-4 md:static md:translate-x-0"
      >
        <nav className="flex flex-col gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-black"
            onClick={() => setOpen(false)}
          >
            <Home size={20} />
            Home
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-black"
            onClick={() => setOpen(false)}
          >
            <Settings size={20} />
            Dashboard
          </Link>
        </nav>
      </motion.aside>
    </div>
  );
}

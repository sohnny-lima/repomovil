"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { useTheme } from "@/context/ThemeContext";
import { BRANDING } from "@/lib/constants";

const MINISTRIES = [
  { href: "/ministerios/mayordomia", label: "Mayordomía" },
  {
    href: "/ministerios/secretaria-ministerial",
    label: "Secretaría Ministerial",
  },
  { href: "/ministerios/salud", label: "Salud" },
  { href: "/ministerios/familia", label: "Familia" },
  { href: "/ministerios/map", label: "MAP" },
];

export default function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ministryDropdownOpen, setMinistryDropdownOpen] = useState(false);
  const [mobileMinistryOpen, setMobileMinistryOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMinistryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isMinistryActive = pathname.startsWith("/ministerios");

  return (
    <nav className="bg-slate-950/80 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-50">
      <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* ── Logo + Branding ── */}
          <div className="flex items-center space-x-5">
            <div className="relative flex-shrink-0 w-[9rem] h-[9rem]">
              <Image
                src="/logo/logoConectados.png"
                alt="Logo Misión Central del Perú"
                fill
                className="object-contain"
                sizes="144px"
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent font-extrabold text-xl md:text-2xl tracking-wider uppercase leading-tight drop-shadow-sm">
                Misión Central del Perú
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/"
              className={clsx(
                "px-4 py-2 rounded-full text-lg font-medium transition-all duration-300 hover:bg-white/10 hover:text-green-400",
                pathname === "/" ? "text-white bg-white/5" : "text-gray-400",
              )}
            >
              Inicio
            </Link>

            {/* Ministerios Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMinistryDropdownOpen(!ministryDropdownOpen)}
                className={clsx(
                  "flex items-center gap-1 px-4 py-2 rounded-full text-lg font-medium transition-all duration-300 hover:bg-white/10 hover:text-green-400",
                  isMinistryActive ? "text-white bg-white/5" : "text-gray-400",
                )}
              >
                Ministerios
                <ChevronDown
                  size={18}
                  className={clsx(
                    "transition-transform duration-200",
                    ministryDropdownOpen && "rotate-180",
                  )}
                />
              </button>

              {ministryDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-slate-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-50">
                  {MINISTRIES.map((m) => (
                    <Link
                      key={m.href}
                      href={m.href}
                      onClick={() => setMinistryDropdownOpen(false)}
                      className={clsx(
                        "block px-5 py-3 text-sm font-medium transition-colors hover:bg-slate-800 hover:text-green-400",
                        pathname === m.href
                          ? "text-green-400 bg-slate-800"
                          : "text-gray-300",
                      )}
                    >
                      {m.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/search"
              className={clsx(
                "px-4 py-2 rounded-full text-lg font-medium transition-all duration-300 hover:bg-white/10 hover:text-green-400",
                pathname === "/search" ? "text-white bg-white/5" : "text-gray-400",
              )}
            >
              Recursos
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-400 hover:text-white dark:hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
            </button>

            <Link
              href="/admin/login"
              className="bg-gradient-to-r from-green-400 to-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 text-slate-950 font-bold py-2.5 px-8 text-lg rounded-full transition-all duration-300 transform"
            >
              Ingresar
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className={clsx(
                "block px-3 py-2 rounded-md text-base font-medium",
                pathname === "/"
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800",
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              Inicio
            </Link>

            {/* Mobile Ministerios accordion */}
            <div>
              <button
                onClick={() => setMobileMinistryOpen(!mobileMinistryOpen)}
                className={clsx(
                  "w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium",
                  isMinistryActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800",
                )}
              >
                Ministerios
                <ChevronDown
                  size={16}
                  className={clsx(
                    "transition-transform duration-200",
                    mobileMinistryOpen && "rotate-180",
                  )}
                />
              </button>
              {mobileMinistryOpen && (
                <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-3">
                  {MINISTRIES.map((m) => (
                    <Link
                      key={m.href}
                      href={m.href}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileMinistryOpen(false);
                      }}
                      className={clsx(
                        "block px-3 py-2 rounded-md text-sm font-medium",
                        pathname === m.href
                          ? "text-green-400"
                          : "text-gray-400 hover:text-green-400",
                      )}
                    >
                      {m.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/search"
              className={clsx(
                "block px-3 py-2 rounded-md text-base font-medium",
                pathname === "/search"
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800",
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              Recursos
            </Link>

            <div className="px-3 py-2">
              <Link
                href="/admin/login"
                className="block w-full text-center bg-green-500 hover:bg-green-600 text-slate-950 font-bold py-2 px-6 rounded-full transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ingresar
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

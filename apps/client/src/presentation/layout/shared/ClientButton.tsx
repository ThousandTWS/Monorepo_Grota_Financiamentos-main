"use client"

import React, { ReactNode } from "react"
import Link from "next/link"

interface ClientButtonProps {
  label: string
  onClick?: () => void
  href?: string
  type?: "button" | "submit" | "reset"
  width?: string
  height?: string
  padding?: string
  textColor?: string
  bgColor?: string
  borderColor?: string
  hoverBgColor?: string
  hoverTextColor?: string
  rounded?: string
  className?: string
  iconLeft?: ReactNode
  iconRight?: ReactNode
  animateBackground?: boolean
  animateScale?: boolean
}

export const ClientButton: React.FC<ClientButtonProps> = ({
  label,
  onClick,
  href,
  type = "button",
  width = "w-full sm:w-auto",
  height = "h-auto",
  padding = "px-6 py-3 sm:py-2",
  textColor = "text-orange-500",
  bgColor = "bg-white",
  borderColor = "border-white",
  hoverBgColor = "hover:bg-orange-500",
  hoverTextColor = "hover:text-white",
  rounded = "rounded-full",
  className = "",
  iconLeft,
  iconRight,
  animateBackground = true,
  animateScale = true,
}) => {
  const ButtonContent = (
    <>
      {iconLeft && <span className="relative z-10">{iconLeft}</span>}
      <span className="relative z-10">{label}</span>
      {iconRight && <span className="relative z-10">{iconRight}</span>}

      {/* Efeito de background animado */}
      {animateBackground && (
        <span
          className={`absolute inset-0 -z-10 rounded-full bg-orange-500 transition-all duration-700 ${
            animateScale ? "group-hover:scale-110" : ""
          }`}
        ></span>
      )}
    </>
  )

  const baseClasses = `relative z-10 flex items-center justify-center gap-2 ${width} ${height} ${padding} 
    ${textColor} ${bgColor} border-2 ${borderColor} ${hoverBgColor} ${hoverTextColor} 
    ${rounded} shadow-xl backdrop-blur-md overflow-hidden group cursor-pointer transition-all duration-300 ease-in-out ${className}`

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {ButtonContent}
      </Link>
    )
  }

  return (
    <button onClick={onClick} type={type} className={baseClasses}>
      {ButtonContent}
    </button>
  )
}

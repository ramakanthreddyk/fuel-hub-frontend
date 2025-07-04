
import * as React from "react"
import { cn } from "@/lib/utils"

interface ColorfulCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: string;
}

const ColorfulCard = React.forwardRef<HTMLDivElement, ColorfulCardProps>(
  ({ className, gradient = "from-white to-gray-50", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-gradient-to-br shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-200",
        gradient,
        className
      )}
      {...props}
    />
  )
)
ColorfulCard.displayName = "ColorfulCard"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4 sm:p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 sm:p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

export { ColorfulCard, CardHeader, CardContent }

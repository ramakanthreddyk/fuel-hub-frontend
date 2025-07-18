import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      expand={true}
      closeButton={true}
      duration={5000}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:border-2",
          description: "group-[.toast]:text-muted-foreground font-medium",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toast]:border-green-500 group-[.toast]:bg-green-50 group-[.toast]:text-green-900",
          error: "group-[.toast]:border-red-500 group-[.toast]:bg-red-50 group-[.toast]:text-red-900",
          info: "group-[.toast]:border-blue-500 group-[.toast]:bg-blue-50 group-[.toast]:text-blue-900",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }

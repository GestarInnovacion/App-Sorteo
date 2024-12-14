import { CoolToast } from "@/components/ui/cool-toast"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <>
      {toasts.map((toast) => (
        <CoolToast
          key={toast.id}
          message={toast.title as string}
          type={toast.variant as 'success' | 'error' | 'warning' | 'info'}
          onClose={() => toast.onOpenChange?.(false)}
        />
      ))}
    </>
  )
}


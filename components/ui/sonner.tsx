"use client"

import { Toaster as SonnerToaster } from "sonner"

type ToasterProps = React.ComponentProps<typeof SonnerToaster>

export function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      theme="system"
      richColors
      closeButton
      position="top-right"
      {...props}
    />
  )
}


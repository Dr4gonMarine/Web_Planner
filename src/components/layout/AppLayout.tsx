import { AppHeader } from './AppHeader'

interface Props {
  children: React.ReactNode
}

export function AppLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-1 overflow-auto p-4">{children}</main>
    </div>
  )
}

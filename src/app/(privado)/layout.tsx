import { Navbar } from '@/components/shared/Navbar'

export default function LayoutPrivado({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        {children}
      </div>
    </>
  )
}
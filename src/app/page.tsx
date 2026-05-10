import { FormularioLogin } from '@/components/auth/FormularioLogin'

export default function PaginaLogin() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">Ecoshelf Analytics</h1>
          <p className="text-gray-500 mt-1">Sistema de gestión de panadería</p>
        </div>
        <FormularioLogin />
      </div>
    </main>
  )
}
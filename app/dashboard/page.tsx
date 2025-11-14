'use client';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 font-sans px-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Bem-vindo ao seu painel de controle
            </p>
            <div className="pt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                    ✓
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Verificado
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Sua identidade foi verificada
                  </p>
                </div>
                
                <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                    🔒
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Seguro
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Seus dados estão protegidos
                  </p>
                </div>
                
                <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                    ⚡
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Ativo
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Conta totalmente ativa
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

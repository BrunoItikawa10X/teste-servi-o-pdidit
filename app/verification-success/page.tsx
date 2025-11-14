'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function VerificationSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'review'>('loading');
  const [sessionData, setSessionData] = useState<any>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    // Se estiver dentro de um iframe, força abrir esta página no topo
    try {
      if (typeof window !== 'undefined' && window.self !== window.top) {
        window.top!.location.href = window.location.href;
      }
    } catch {}

    // Tentar obter session id via diferentes parâmetros / storage
    let sessionId = searchParams.get('session_id') || searchParams.get('id') || searchParams.get('session');
    if (!sessionId) {
      try {
        sessionId = localStorage.getItem('didit_session_id') || '';
      } catch {}
    }

    if (!sessionId) {
      console.warn('Session ID não encontrado nos parâmetros de callback.');
      setStatus('error');
      return;
    }

    const successStatuses = new Set([
      'approved', 'completed', 'manual_approved', 'approved_manual', 'finished', 'success', 'verified'
    ]);
    const errorStatuses = new Set([
      'rejected', 'failed', 'expired', 'cancelled', 'canceled', 'error'
    ]);
    const reviewStatuses = new Set([
      'manual_review', 'in_review', 'pending_review', 'under_review', 'processing'
    ]);

    const checkStatus = async () => {
      setAttempts(a => a + 1);
      try {
        const response = await fetch(`/api/didit/check-status?sessionId=${sessionId}`);
        if (!response.ok) {
          throw new Error(`Falha ao verificar status: ${response.status}`);
        }
        const data = await response.json();
        setSessionData(data);

        // Extrair status considerando possíveis estruturas
        const rawStatus = data.status || data.session?.status || data.verification_session?.status;
        console.log('Didit session status recebido:', rawStatus, data);

        if (rawStatus) {
          if (successStatuses.has(rawStatus)) {
            setStatus('success');
            return;
          }
          if (errorStatuses.has(rawStatus)) {
            setStatus('error');
            return;
          }
          if (reviewStatuses.has(rawStatus)) {
            setStatus('review');
            return;
          }
        }

        if (attempts >= 30) { // ~1 minuto
          console.warn('Max de tentativas atingido sem status final');
          setStatus('error');
          return;
        }
        setTimeout(checkStatus, 2000);
      } catch (err) {
        console.error('Erro ao checar status:', err);
        if (attempts >= 3) {
          setStatus('error');
        } else {
          setTimeout(checkStatus, 2000);
        }
      }
    };

    checkStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 font-sans px-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto">
                <svg
                  className="animate-spin h-16 w-16 text-indigo-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Processando verificação...
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Por favor, aguarde enquanto verificamos suas informações
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 font-sans px-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Verificação não concluída
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Não foi possível completar a verificação. Por favor, tente novamente.
              </p>
              <button
                onClick={() => router.push('/')}
                className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'review') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-yellow-50 to-amber-100 dark:from-gray-900 dark:to-gray-800 font-sans px-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Em Análise Manual
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Sua verificação está sendo revisada por nossa equipe. Isso pode levar alguns minutos.
              </p>
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                  Manteremos você atualizado automaticamente nesta página.
                </div>
                <button
                  onClick={() => router.push('/')}
                  className="w-full py-3 px-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200"
                >
                  Voltar ao início
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Auto-redirect to dashboard after success (mobile-friendly UX)
  useEffect(() => {
    if (status === 'success') {
      const t = setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [status, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 font-sans px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-4">
            {/* Success Icon with Animation */}
            <div className="relative">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Verificação Concluída!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sua identidade foi verificada com sucesso
            </p>

            {/* Success Details */}
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-left space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className="font-medium text-green-700 dark:text-green-300">{(sessionData?.status || sessionData?.session?.status || 'Aprovado')}</span>
              </div>
              {(sessionData?.session_id || sessionData?.id) && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">ID da Sessão:</span>
                  <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
                    {(sessionData.session_id || sessionData.id).slice(0, 12)}...
                  </span>
                </div>
              )}
              {sessionData?.created_at && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Data:</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {new Date(sessionData.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                Ir para o Dashboard (redirecionando...)
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="w-full py-3 px-6 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200"
              >
                Voltar ao Início
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 pt-4">
              Você receberá um email de confirmação em breve
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

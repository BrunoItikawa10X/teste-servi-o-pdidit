"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyIframe() {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cameraStatus, setCameraStatus] = useState<'unknown' | 'prompting' | 'granted' | 'denied'>('unknown');
  const router = useRouter();

  useEffect(() => {
    const createSession = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/didit/create-session", { method: "POST" });
        if (!res.ok) throw new Error(`Falha ao criar sessão (${res.status})`);
        const data = await res.json();
        const verificationUrl = data.verification_url || data.url;
        const sessionId = data.session_id || data.id;
        if (sessionId) {
          try { localStorage.setItem("didit_session_id", sessionId); } catch {}
        }
        if (!verificationUrl) throw new Error("URL de verificação não encontrada");
        setUrl(verificationUrl);
      } catch (e: any) {
        setError(e?.message || "Erro desconhecido ao iniciar verificação");
      } finally {
        setLoading(false);
      }
    };
    createSession();

    // Attempt to prompt for camera access immediately
    const tryPromptCamera = async () => {
      if (!navigator?.mediaDevices?.getUserMedia) return;
      try {
        setCameraStatus('prompting');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // Stop tracks immediately; this only serves to trigger the permission prompt
        stream.getTracks().forEach(t => t.stop());
        setCameraStatus('granted');
      } catch (e: any) {
        // NotAllowedError or user dismissed
        setCameraStatus('denied');
      }
    };
    tryPromptCamera();
  }, []);

  const requestCamera = async () => {
    if (!navigator?.mediaDevices?.getUserMedia) return;
    try {
      setCameraStatus('prompting');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(t => t.stop());
      setCameraStatus('granted');
    } catch {
      setCameraStatus('denied');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <header className="w-full px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Verificação de Identidade</h1>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Voltar
        </button>
      </header>

      <main className="flex-1 px-4 pb-6">
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {cameraStatus !== 'granted' && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border-b border-yellow-200 dark:border-yellow-800 flex items-center justify-between">
              <div className="text-sm text-yellow-900 dark:text-yellow-200">
                Para agilizar, habilite sua câmera agora. O Didit solicitará novamente dentro do iframe.
              </div>
              <button
                onClick={requestCamera}
                className="px-3 py-1.5 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-900 font-medium"
              >
                Habilitar câmera
              </button>
            </div>
          )}
          {loading && (
            <div className="flex items-center justify-center h-[70vh]">
              <div className="text-center">
                <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="mt-4 text-gray-600 dark:text-gray-300">Preparando a verificação...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-6">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200 text-center">{error}</p>
              </div>
            </div>
          )}

          {url && (
            <iframe
              src={url}
              title="Didit Verification"
              className="w-full h-[80vh]"
              allow="camera; microphone; clipboard-read; clipboard-write; accelerometer; gyroscope"
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation"
            />
          )}
        </div>
      </main>
    </div>
  );
}

"use client"

import { useRouter } from "next/navigation";
import { use, useState } from "react";

function formatCPF(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return digits.replace(/^(\d{3})(\d+)/, '$1.$2');
    if (digits.length <= 9) return digits.replace(/^(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
}

export default function CadastroForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCPF] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [echoResponse, setEchoResponse] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const rawCPF = cpf.replace(/\D/g, '');
        if (rawCPF.length !== 11) {
            setError('CPF deve ter 11 dígitos');
            return;
        }
        setShowModal(true);
    };

    const confirmAndSubmit = async () => {
        setShowModal(false);
        setLoading(true);
        try {
            const rawCPF = cpf.replace(/\D/g, '');
            const echoRes = await fetch('/api/echo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, cpf: rawCPF }),
            });
            if (!echoRes.ok) throw new Error('Falha ao enviar dados');
            const echoData = await echoRes.json();
            setEchoResponse(echoData);
            setLoading(false);
        } catch (err: any) {
            setError(err?.message || "Erro desconhecido");
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 font-sans px-4">
            <main className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                        Página de Cadastro
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-200 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-700"
                                placeholder="Seu nome"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-200 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-700"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">CPF</label>
                            <input
                                type="text"
                                value={cpf}
                                onChange={(e) => setCPF(formatCPF(e.target.value))}
                                inputMode="numeric"
                                maxLength={14}
                                className="mt-1 block w-full rounded-md border-gray-200 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-700"
                                placeholder="000.000.000-00"
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-red-600 dark:text-red-300">{error}</div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Enviando...' : 'Enviar'}
                        </button>
                    </form>
                    {echoResponse && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md text-sm">
                            <div className="font-medium mb-2">Resposta do servidor (echo):</div>
                            <pre className="text-xs overflow-auto max-h-40">{JSON.stringify(echoResponse, null, 2)}</pre>
                        </div>
                    )}
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                                Confirme seu CPF
                            </h2>
                            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    Por favor, confirme que seu CPF está correto:
                                </p>
                                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                                    {cpf}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2.5 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => router.push('/verificacao')}
                                    className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

# Sistema de Verificação Didit

Este projeto implementa um sistema de verificação de identidade usando a API do Didit.

## Configuração

1. **Configure as variáveis de ambiente**

   Edite o arquivo `.env.local` com suas credenciais do Didit:

   ```env
   DIDIT_API_KEY=your_api_key_here
   DIDIT_WORKFLOW_ID=your_workflow_id_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

   - `DIDIT_API_KEY`: Sua chave de API do Didit (obtenha em https://business.didit.me/)
   - `DIDIT_WORKFLOW_ID`: ID do workflow criado no dashboard do Didit
   - `NEXT_PUBLIC_APP_URL`: URL da sua aplicação (use http://localhost:3000 para desenvolvimento)

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Execute o servidor de desenvolvimento**

   ```bash
   npm run dev
   ```

4. **Acesse a aplicação**

   Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## Estrutura do Projeto

```
app/
├── page.tsx                           # Página inicial com botão de verificação
├── verification-success/
│   └── page.tsx                       # Página de sucesso após verificação
├── dashboard/
│   └── page.tsx                       # Dashboard após verificação bem-sucedida
└── api/
    └── didit/
        ├── create-session/
        │   └── route.ts               # API para criar sessão de verificação
        ├── check-status/
        │   └── route.ts               # API para verificar status da sessão
        └── webhook/
            └── route.ts               # Webhook para receber notificações do Didit
```

## Fluxo de Verificação

1. **Usuário acessa a página inicial** (`/`)
   - Vê informações sobre o processo de verificação
   - Clica em "Iniciar Verificação"

2. **Sistema cria sessão com Didit**
   - Chama `/api/didit/create-session`
   - Recebe URL de verificação do Didit
   - Redireciona usuário para o Didit

3. **Usuário completa verificação no Didit**
   - Faz upload de documento
   - Realiza verificação biométrica
   - Completa outros checks configurados no workflow

4. **Usuário retorna à aplicação**
   - Didit redireciona para `/verification-success`
   - Sistema verifica status da sessão
   - Mostra resultado da verificação

5. **Dashboard**
   - Se verificação bem-sucedida, usuário pode acessar o dashboard
   - Acesso a recursos protegidos da aplicação

## Webhooks

O Didit enviará notificações para `/api/didit/webhook` quando:
- Verificação for iniciada
- Verificação for completada
- Status da verificação mudar

Para testar webhooks localmente, você pode usar:
- [ngrok](https://ngrok.com/) para expor seu servidor local
- [localtunnel](https://localtunnel.github.io/www/)

## Criando um Workflow no Didit

1. Acesse [Didit Business Console](https://business.didit.me/)
2. Vá para "Workflows"
3. Clique em "Create New Workflow"
4. Escolha um template (ex: KYC Workflow)
5. Configure os checks desejados:
   - ID Verification
   - Liveness Detection
   - Face Match
   - AML Screening
   - etc.
6. Copie o Workflow ID gerado
7. Cole no arquivo `.env.local`

## Produção

Para produção, certifique-se de:

1. Configurar `NEXT_PUBLIC_APP_URL` com sua URL de produção
2. Configurar webhook URL no dashboard do Didit
3. Implementar autenticação de usuários
4. Armazenar resultados de verificação em banco de dados
5. Adicionar tratamento de erros robusto
6. Implementar rate limiting

## Recursos Adicionais

- [Documentação do Didit](https://docs.didit.me/)
- [API Reference](https://docs.didit.me/reference)
- [Workflows Dashboard](https://docs.didit.me/reference/workflows-dashboard)

## Licença

MIT

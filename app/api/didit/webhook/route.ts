import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Log webhook data (você pode armazenar em um banco de dados aqui)
    console.log('Didit webhook received:', body);
    
    // Processar os diferentes status da verificação
    const { session_id, status, verification_result } = body;
    
    // Aqui você pode adicionar lógica adicional baseada no status
    // Por exemplo: salvar em banco de dados, enviar notificação, etc.
    
    // Echo the received payload back for debugging/testing
    return NextResponse.json({ received: true, payload: body });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

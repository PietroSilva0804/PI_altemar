const authErrorMessages: Record<string, string> = {
  'auth/invalid-email': 'O e-mail informado é inválido.',
  'auth/user-disabled': 'Esta conta foi desativada. Fale com o suporte.',
  'auth/user-not-found': 'E-mail ou senha incorretos.',
  'auth/wrong-password': 'E-mail ou senha incorretos.',
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/email-already-in-use': 'Este e-mail já está cadastrado. Tente fazer login.',
  'auth/weak-password': 'A senha é muito fraca. Use pelo menos 6 caracteres.',
  'auth/missing-password': 'Informe uma senha.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente de novo.',
  'auth/network-request-failed': 'Falha de conexão. Verifique sua internet e tente novamente.',
  'auth/popup-closed-by-user': 'A janela de login foi fechada antes de concluir.',
  'auth/popup-blocked': 'O navegador bloqueou a janela de login. Libere os pop-ups e tente de novo.',
  'auth/configuration-not-found':
    'O login por e-mail/senha ainda não está habilitado no Firebase deste projeto.',
  'auth/operation-not-allowed':
    'O login por e-mail/senha ainda não está habilitado no Firebase deste projeto.',
};

function extractCode(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    if (typeof code === 'string') return code;
  }
  return undefined;
}

/** Converte um erro do Firebase Auth em uma mensagem amigável em PT-BR. */
export function getAuthErrorMessage(
  error: unknown,
  fallback = 'Algo deu errado. Tente novamente.'
): string {
  const code = extractCode(error);
  if (code && authErrorMessages[code]) return authErrorMessages[code];
  return fallback;
}

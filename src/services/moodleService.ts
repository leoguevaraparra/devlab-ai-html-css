/// <reference types="vite/client" />
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function submitLtiGrade(score: number, comment: string): Promise<boolean> {
  // Solo se puede enviar si tenemos LTIK
  const ltik = sessionStorage.getItem('ltik');
  
  if (!ltik) {
    console.warn('Operando sin LTI: Las notas no se enviarán a Moodle.');
    return false;
  }

  try {
    const response = await fetch(`${API_URL}/api/grade`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ltik}`
      },
      body: JSON.stringify({ score, comment })
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Nota enviada a Moodle con éxito', data);
      return true;
    } else {
      console.error('❌ Moodle no aceptó la nota:', data);
      return false;
    }
  } catch (err) {
    console.error('Network Error sincronizando con Moodle:', err);
    return false;
  }
}

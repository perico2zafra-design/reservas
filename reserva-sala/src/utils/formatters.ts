/**
 * Utilidades para formatear datos en la interfaz
 */

export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

export const formatCurrency = (amount: number | string): string => {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

export const formatTime = (time: string): string => {
  if (!time) return '';
  return time.substring(0, 5); // Cortar segundos de HH:mm:ss
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    APPROVED: 'success',
    PENDING: 'warning',
    BLOCKED: 'error',
    REJECTED: 'error',
    CONFIRMED: 'success',
    PAID: 'success',
    REFUNDED: 'info',
    CAPTURED: 'error'
  };
  return colors[status] || 'slate-500';
};

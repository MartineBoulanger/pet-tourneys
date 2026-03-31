import { toast } from 'sonner';

type ToastOptions = Parameters<typeof toast>[1];

export function toastSuccess(message: string, options?: ToastOptions) {
  toast.success(message, {
    classNames: { toast: 'toast-success' },
    ...options,
  });
}

export function toastError(message: string, options?: ToastOptions) {
  toast.error(message, {
    classNames: { toast: 'toast-error' },
    ...options,
  });
}

export function toastInfo(message: string, options?: ToastOptions) {
  toast.info(message, {
    classNames: { toast: 'toast-info' },
    ...options,
  });
}

export function toastWarning(message: string, options?: ToastOptions) {
  toast.warning(message, {
    classNames: { toast: 'toast-warning' },
    ...options,
  });
}

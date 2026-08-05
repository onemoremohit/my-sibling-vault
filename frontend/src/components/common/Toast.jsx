// Toast.jsx — re-exports react-hot-toast with convenience wrappers
import toast from 'react-hot-toast';

export const showSuccess = (msg) => toast.success(msg);
export const showError   = (msg) => toast.error(msg);
export const showInfo    = (msg) => toast(msg, { icon: 'ℹ️' });
export const showLoading = (msg) => toast.loading(msg);
export const dismiss     = (id)  => toast.dismiss(id);

export default toast;

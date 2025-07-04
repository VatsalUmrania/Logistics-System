import { Toaster } from 'react-hot-toast';

const ToastConfig = ({
  position = "bottom-right",
  reverseOrder = false,
  gutter = 8,
  containerClassName = "",
  containerStyle = {},
}) => {
  return (
    <Toaster
      position={position}
      reverseOrder={reverseOrder}
      gutter={gutter}
      containerClassName={containerClassName}
      containerStyle={containerStyle}
      toastOptions={{
        // Enhanced default options
        className: '',
        duration: 4000,
        style: {
          background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
          color: '#F9FAFB',
          borderRadius: '16px',
          fontSize: '14px',
          fontWeight: '500',
          padding: '16px 20px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(16px)',
          maxWidth: '420px',
          minWidth: '300px',
        },
        
        // Enhanced success toast styling
        success: {
          duration: 3500,
          style: {
            background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)',
            color: '#ffffff',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.2), 0 10px 10px -5px rgba(16, 185, 129, 0.1)',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#059669',
          },
        },
        
        // Enhanced error toast styling
        error: {
          duration: 5000,
          style: {
            background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)',
            color: '#ffffff',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.2), 0 10px 10px -5px rgba(239, 68, 68, 0.1)',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#DC2626',
          },
        },
        
        // Enhanced loading toast styling
        loading: {
          duration: Infinity,
          style: {
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 50%, #1E40AF 100%)',
            color: '#ffffff',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.2), 0 10px 10px -5px rgba(59, 130, 246, 0.1)',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#2563EB',
          },
        },
        
        // Enhanced info/custom toast styling
        custom: {
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #0891B2 0%, #0E7490 50%, #155E75 100%)',
            color: '#ffffff',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            boxShadow: '0 20px 25px -5px rgba(6, 182, 212, 0.2), 0 10px 10px -5px rgba(6, 182, 212, 0.1)',
          },
        },
        
        // Warning toast styling (new addition)
        warning: {
          duration: 4500,
          style: {
            background: 'linear-gradient(135deg, #D97706 0%, #B45309 50%, #92400E 100%)',
            color: '#ffffff',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.2), 0 10px 10px -5px rgba(245, 158, 11, 0.1)',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#D97706',
          },
        },
      }}
    />
  );
};

export default ToastConfig;

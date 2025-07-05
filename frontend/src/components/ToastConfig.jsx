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
        className: '',
        duration: 3500, // Slightly longer duration for a smooth feel
        style: {
          background: '#FFFFFF',  // Clean white background
          color: '#333',  // Dark text for clarity
          borderRadius: '12px',  // Slightly more rounded edges for a modern feel
          fontSize: '16px',  // Comfortable font size
          fontWeight: '500',  // A refined font weight
          padding: '16px 20px',  // Spacious padding
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',  // Modern floating shadow
          border: 'none',
          backdropFilter: 'blur(12px)',  // Soft blur effect for added depth
          maxWidth: '480px',
          minWidth: '300px',
          transition: 'all 0.3s ease-in-out',  // Smooth transition for all changes
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          textAlign: 'left',
          letterSpacing: '0.5px',
          lineHeight: '1.5',
          zIndex: 9999,
        },

        hoverStyle: {
          transform: 'scale(1.05)',  // Slightly enlarge when hovered
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.2)',  // Subtle stronger shadow
          cursor: 'pointer',
        },

        iconStyle: {
          width: '24px',
          height: '24px',
          color: '#fff',
          opacity: 0.85,
          transition: 'opacity 0.3s ease',
        },

        buttonStyle: {
          backgroundColor: '#2563EB',  // Modern Indigo button
          color: '#fff',
          fontWeight: '600',
          borderRadius: '8px',
          padding: '8px 16px',
          cursor: 'pointer',
          border: 'none',
          transition: 'background-color 0.3s ease, transform 0.3s ease',
        },

        buttonHoverStyle: {
          backgroundColor: '#1D4ED8',  // Slightly darker on hover
          transform: 'scale(1.05)',  // Smooth scaling effect on hover
        },

        success: {
          duration: 3500,
          style: {
            background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)',  // Fresh green gradient
            color: '#fff',
            border: '1px solid rgba(16, 185, 129, 0.3)',  // Subtle border
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2), 0 8px 8px -4px rgba(16, 185, 129, 0.1)',  // Light, floating shadow
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#059669',
          },
        },

        error: {
          duration: 4500,
          style: {
            background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)',  // Deep red gradient
            color: '#fff',
            border: '1px solid rgba(239, 68, 68, 0.3)',  // Subtle border for error toasts
            boxShadow: '0 10px 30px rgba(239, 68, 68, 0.2), 0 8px 8px -4px rgba(239, 68, 68, 0.1)',  // Clean, modern shadow
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#DC2626',
          },
        },

        loading: {
          duration: Infinity,
          style: {
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 50%, #1E40AF 100%)',  // Fresh blue gradient
            color: '#fff',
            border: '1px solid rgba(59, 130, 246, 0.3)',  // Subtle blue border
            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.2), 0 8px 8px -4px rgba(59, 130, 246, 0.1)',  // Soft floating shadow
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#2563EB',
          },
        },

        custom: {
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #3B82F6 0%, #9333EA 100%)',  // Smooth blue to purple gradient
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2), 0 12px 12px -6px rgba(59, 130, 246, 0.1)',  // Modern shadow with depth
            padding: '18px 24px',
            fontSize: '17px',
            fontWeight: '500',
            textAlign: 'center',
            letterSpacing: '0.5px',
            textTransform: 'capitalize',
            lineHeight: '1.5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'all 0.3s ease-in-out',
          },
          hoverStyle: {
            transform: 'scale(1.05)',  // Slight hover effect for interactivity
            boxShadow: '0 10px 40px rgba(59, 130, 246, 0.25), 0 12px 10px -6px rgba(59, 130, 246, 0.2)',  // Stronger shadow on hover
          },
        },

        warning: {
          duration: 4500,
          style: {
            background: 'linear-gradient(135deg, #D97706 0%, #B45309 50%, #92400E 100%)',  // Subtle orange gradient
            color: '#fff',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            boxShadow: '0 10px 30px rgba(245, 158, 11, 0.2), 0 8px 8px -4px rgba(245, 158, 11, 0.1)',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#D97706',
          },
        },
      }}
    />
  );
};

export default ToastConfig;

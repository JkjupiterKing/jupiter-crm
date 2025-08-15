// src/components/SendAlertModal.tsx
'use client';

import Modal from './Modal';
import { useToast } from './ToastProvider';

interface ServiceJob {
  id: number;
  customer: {
    fullName: string;
    mobile?: string | null;
  };
  customerProduct: {
    product: {
      name: string;
    };
  };
}

interface SendAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceJob | null;
}

export default function SendAlertModal({
  isOpen,
  onClose,
  service,
}: SendAlertModalProps) {
  const { addToast } = useToast();

  if (!service) return null;

  const hasPhoneNumber = service.customer.mobile && service.customer.mobile.trim() !== '';

  const productName = service.customerProduct?.product?.name || 'your product';

  const message = `Dear ${service.customer.fullName}, this is a reminder that your ${productName} is due for service. Please contact us to schedule an appointment. Thank you.`;

  const handleSend = (method: 'WhatsApp' | 'SMS') => {
    // In Phase 1, we just simulate the send action.
    addToast(`✅ Reminder sent to ${service.customer.fullName} via ${method}.`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Service Reminder">
      <div className="space-y-4">
        <p className="text-gray-700">{message}</p>
        <div className="flex justify-end space-x-2 pt-4">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <div className="relative group">
            <button
              onClick={() => handleSend('SMS')}
              disabled={!hasPhoneNumber}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send via SMS
            </button>
            {!hasPhoneNumber && (
              <div className="absolute bottom-full mb-2 w-max bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 pointer-events-none">
                Customer phone number not available.
              </div>
            )}
          </div>
          <div className="relative group">
            <button
              onClick={() => handleSend('WhatsApp')}
              disabled={!hasPhoneNumber}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send via WhatsApp
            </button>
            {!hasPhoneNumber && (
              <div className="absolute bottom-full mb-2 w-max bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 pointer-events-none">
                Customer phone number not available.
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

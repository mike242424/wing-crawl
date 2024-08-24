import { Button } from '@/components/ui/button';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  locationName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  locationName: string;
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
        <p className="mb-6">
          Do you want to guess that <strong>{locationName}</strong> will win?
        </p>
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} className="bg-gray-300 text-gray-700">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-primary text-white">
            Yes, I&apos;m sure
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

interface DeleteConfirmationDialogProps {
  subscriptionName: string;
  onConfirmDelete: () => void;
  open: boolean;
  onClose: () => void;
}

export function DeleteConfirmationDialog({ subscriptionName, onConfirmDelete, open, onClose }: DeleteConfirmationDialogProps) {

  const handleDelete = () => {
    onConfirmDelete();
    onClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Subscription Package</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{subscriptionName}"?
            This action cannot be undone and will permanently remove the subscription package.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete Package
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

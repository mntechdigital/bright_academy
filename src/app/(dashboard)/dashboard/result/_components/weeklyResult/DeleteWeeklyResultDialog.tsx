"use client";

import { ReactNode, useState, useTransition } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showErrorToast, showSuccessToast } from "@/src/utils/toastMessage";
import { deleteWeeklyResultByClassAndSection } from "@/src/services/weeklyResult";

interface DeleteWeeklyResultDialogProps {
  id?: string;
  stdClassId?: string;
  batchId?: string;
  week?: string;
  trigger?: ReactNode;
  onDeleteSuccess?: () => void;
}

const DeleteWeeklyResultDialog = ({ id, stdClassId, batchId, week, trigger, onDeleteSuccess }: DeleteWeeklyResultDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    console.log("Delete button clicked with payload:", { id, stdClassId, batchId, week });
    startTransition(async () => {
      const payload: Record<string, any> = {};

      if (id) payload.id = id;
      if (stdClassId) payload.stdClassId = stdClassId;
      if (batchId) payload.batchId = batchId;
      if (week) payload.week = week;
      const result = await deleteWeeklyResultByClassAndSection(payload);
      
      if (result.statusCode === 200) {
        setIsOpen(false);
        showSuccessToast(result.message);
        onDeleteSuccess?.();
      } else {
        setIsOpen(false);
        showErrorToast(result.message);
      }
    });
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 text-red-400 cursor-pointer hover:text-red-600"
            >
              <Trash2 size={18} />
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="bg-[#18181b] text-white border border-[#232326]">
          <DialogHeader>
            <DialogTitle className="text-white">
              Are you absolutely sure?
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              This action cannot be undone. This will permanently delete this
              weekly result{batchId ? ` for the selected batch` : ``} and remove their data from our servers.
            </DialogDescription>
            <div className="flex justify-end space-x-2 mt-4">
              <DialogClose asChild>
                <Button className="bg-[#232326] text-gray-200 hover:bg-[#2c2c31] border border-[#232326] cursor-pointer">
                  Cancel
                </Button>
              </DialogClose>

              <Button
                onClick={handleDelete}
                disabled={isPending}
                className="bg-red-600 text-white hover:bg-red-700 border border-red-600 cursor-pointer"
              >
                {isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteWeeklyResultDialog;
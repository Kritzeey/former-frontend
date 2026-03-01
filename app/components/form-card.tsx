import { Link } from "react-router";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { getApiUrl, getCookie } from "~/lib/utils";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface Question {
  id: number | string;
  question: string;
}

interface Form {
  id: number | string;
  _title: string;
  response?: number;
  questions?: Question[];
  userId?: string;
}

interface FormCardProps {
  form: Form;
  isOwner?: boolean;
  onDeleteSuccess?: (id: string | number) => void;
}

export default function FormCard({
  form,
  isOwner,
  onDeleteSuccess,
}: FormCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const url = getApiUrl(`/api/forms/${form.id}`);
      const token = getCookie("accessToken");

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete form");
      }

      toast.success("Form deleted successfully");

      setIsModalOpen(false);

      if (onDeleteSuccess) {
        onDeleteSuccess(form.id);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex w-full justify-between items-center p-4 hover:bg-primary/20 rounded-xl transition-colors">
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-bold">{form._title}</div>

          <div className="text-base text-primary font-medium">
            {form.questions?.length || 0}{" "}
            Questions&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            {form.response || 0} Responses
          </div>
        </div>

        <div className="flex gap-2 items-center">
          {isOwner && (
            <>
              <Button
                variant="outline"
                className="rounded-md cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300 transition-colors"
                onClick={() => setIsModalOpen(true)}
              >
                Delete
              </Button>
              <Link to={`/forms/edit/${form.id}`}>
                <Button
                  variant="outline"
                  className="rounded-md cursor-pointer hover:opacity-90"
                >
                  Edit
                </Button>
              </Link>
            </>
          )}

          <Link to={`/forms/${form.id}`}>
            <Button className="rounded-md cursor-pointer hover:opacity-90">
              Details
            </Button>
          </Link>
        </div>
      </div>

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent className="rounded-md w-full max-w-md">
          <AlertDialogHeader className="flex flex-col gap-2 items-center">
            <AlertDialogTitle className="text-2xl font-bold text-center text-primary">
              Delete Form
            </AlertDialogTitle>

            <AlertDialogDescription className="text-sm text-center text-secondary">
              Are you sure you want to delete{" "}
              <strong className="text-primary">{form._title}</strong>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex flex-col w-full gap-2 mt-2">
            <Button
              variant="outline"
              className="w-full rounded-md cursor-pointer"
              onClick={() => setIsModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              className="border border-destructive w-full rounded-md cursor-pointer"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

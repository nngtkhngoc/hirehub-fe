import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllJobTypes,
  createJobType,
  updateJobType,
  deleteJobType,
} from "@/api/systemOptions";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Empty,
  EmptyContent,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";

interface JobType {
  id: number;
  type: string;
}

export const JobTypeManagement = () => {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<JobType | null>(null);
  const [inputValue, setInputValue] = useState("");

  const { data: types = [], isLoading } = useQuery({
    queryKey: ["jobTypes"],
    queryFn: getAllJobTypes,
  });

  const createMutation = useMutation({
    mutationFn: createJobType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobTypes"] });
      toast.success("Thêm loại công việc thành công!");
      setIsCreateDialogOpen(false);
      setInputValue("");
    },
    onError: () => {
      toast.error("Thêm loại công việc thất bại!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, type }: { id: number; type: string }) =>
      updateJobType(id, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobTypes"] });
      toast.success("Cập nhật loại công việc thành công!");
      setIsEditDialogOpen(false);
      setSelectedType(null);
      setInputValue("");
    },
    onError: () => {
      toast.error("Cập nhật loại công việc thất bại!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJobType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobTypes"] });
      toast.success("Xóa loại công việc thành công!");
      setIsDeleteDialogOpen(false);
      setSelectedType(null);
    },
    onError: () => {
      toast.error("Xóa loại công việc thất bại!");
    },
  });

  const handleCreate = () => {
    if (inputValue.trim()) {
      createMutation.mutate(inputValue.trim());
    }
  };

  const handleEdit = () => {
    if (selectedType && inputValue.trim()) {
      updateMutation.mutate({ id: selectedType.id, type: inputValue.trim() });
    }
  };

  const handleDelete = () => {
    if (selectedType) {
      deleteMutation.mutate(selectedType.id);
    }
  };

  const openEditDialog = (type: JobType) => {
    setSelectedType(type);
    setInputValue(type.type);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (type: JobType) => {
    setSelectedType(type);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="h-10 px-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          Thêm loại công việc
        </Button>
      </div>

      {types.length === 0 ? (
        <Empty>
          <EmptyContent>
            <EmptyMedia variant="icon">
              <Briefcase className="text-primary" />
            </EmptyMedia>
            <EmptyTitle>Chưa có loại công việc nào</EmptyTitle>
            <EmptyDescription>
              Thêm loại công việc đầu tiên để bắt đầu
            </EmptyDescription>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="w-24 px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Loại công việc
                  </th>
                  <th className="w-40 px-6 py-4 text-right text-sm font-semibold text-gray-600">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {types.map((type: JobType) => (
                  <tr
                    key={type.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-600">#{type.id}</td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">
                        {type.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 px-4"
                          onClick={() => openEditDialog(type)}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Sửa
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 px-4 text-destructive hover:text-destructive"
                          onClick={() => openDeleteDialog(type)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Xóa
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl">
              Thêm loại công việc mới
            </DialogTitle>
            <DialogDescription className="text-base">
              Nhập tên loại công việc mới
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label htmlFor="type" className="text-base font-medium">
                Loại công việc
              </Label>
              <Input
                id="type"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="VD: Full-time"
                className="h-12 text-base"
              />
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setInputValue("");
              }}
              className="h-11 px-6"
            >
              Hủy
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!inputValue.trim()}
              className="h-11 px-6"
            >
              Thêm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl">
              Chỉnh sửa loại công việc
            </DialogTitle>
            <DialogDescription className="text-base">
              Cập nhật tên loại công việc
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label htmlFor="edit-type" className="text-base font-medium">
                Loại công việc
              </Label>
              <Input
                id="edit-type"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="VD: Full-time"
                className="h-12 text-base"
              />
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedType(null);
                setInputValue("");
              }}
              className="h-11 px-6"
            >
              Hủy
            </Button>
            <Button
              onClick={handleEdit}
              disabled={!inputValue.trim()}
              className="h-11 px-6"
            >
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa loại công việc "{selectedType?.type}"?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedType(null);
              }}
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

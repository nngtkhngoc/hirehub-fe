import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllWorkTypes,
  createWorkType,
  updateWorkType,
  deleteWorkType,
} from "@/api/systemOptions";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Home } from "lucide-react";
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
import { Empty, EmptyContent, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

interface WorkType {
  id: number;
  workspace: string;
}

export const WorkTypeManagement = () => {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<WorkType | null>(null);
  const [inputValue, setInputValue] = useState("");

  const { data: types = [], isLoading } = useQuery({
    queryKey: ["workTypes"],
    queryFn: getAllWorkTypes,
  });

  const createMutation = useMutation({
    mutationFn: createWorkType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workTypes"] });
      toast.success("Thêm hình thức làm việc thành công!");
      setIsCreateDialogOpen(false);
      setInputValue("");
    },
    onError: () => {
      toast.error("Thêm hình thức làm việc thất bại!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, workspace }: { id: number; workspace: string }) =>
      updateWorkType(id, workspace),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workTypes"] });
      toast.success("Cập nhật hình thức làm việc thành công!");
      setIsEditDialogOpen(false);
      setSelectedType(null);
      setInputValue("");
    },
    onError: () => {
      toast.error("Cập nhật hình thức làm việc thất bại!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWorkType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workTypes"] });
      toast.success("Xóa hình thức làm việc thành công!");
      setIsDeleteDialogOpen(false);
      setSelectedType(null);
    },
    onError: () => {
      toast.error("Xóa hình thức làm việc thất bại!");
    },
  });

  const handleCreate = () => {
    if (inputValue.trim()) {
      createMutation.mutate(inputValue.trim());
    }
  };

  const handleEdit = () => {
    if (selectedType && inputValue.trim()) {
      updateMutation.mutate({ id: selectedType.id, workspace: inputValue.trim() });
    }
  };

  const handleDelete = () => {
    if (selectedType) {
      deleteMutation.mutate(selectedType.id);
    }
  };

  const openEditDialog = (type: WorkType) => {
    setSelectedType(type);
    setInputValue(type.workspace);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (type: WorkType) => {
    setSelectedType(type);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsCreateDialogOpen(true)} className="h-10 px-6">
          <Plus className="w-5 h-5 mr-2" />
          Thêm hình thức
        </Button>
      </div>

      {types.length === 0 ? (
        <Empty>
          <EmptyContent>
            <EmptyMedia variant="icon">
              <Home className="text-primary" />
            </EmptyMedia>
            <EmptyTitle>Chưa có hình thức làm việc nào</EmptyTitle>
            <EmptyDescription>
              Thêm hình thức làm việc đầu tiên để bắt đầu
            </EmptyDescription>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="w-24 px-6 py-4 text-left text-sm font-semibold text-gray-600">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Hình thức làm việc</th>
                  <th className="w-40 px-6 py-4 text-right text-sm font-semibold text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {types.map((type: WorkType) => (
                  <tr key={type.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-600">#{type.id}</td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{type.workspace}</span>
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
            <DialogTitle className="text-2xl">Thêm hình thức làm việc mới</DialogTitle>
            <DialogDescription className="text-base">
              Nhập tên hình thức làm việc mới
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label htmlFor="workspace" className="text-base font-medium">Hình thức làm việc</Label>
              <Input
                id="workspace"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="VD: Remote"
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
            <Button onClick={handleCreate} disabled={!inputValue.trim()} className="h-11 px-6">
              Thêm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl">Chỉnh sửa hình thức làm việc</DialogTitle>
            <DialogDescription className="text-base">
              Cập nhật tên hình thức làm việc
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label htmlFor="edit-workspace" className="text-base font-medium">Hình thức làm việc</Label>
              <Input
                id="edit-workspace"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="VD: Remote"
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
            <Button onClick={handleEdit} disabled={!inputValue.trim()} className="h-11 px-6">
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa hình thức làm việc "{selectedType?.workspace}"?
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


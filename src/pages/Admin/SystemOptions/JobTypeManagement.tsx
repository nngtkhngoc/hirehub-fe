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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
        <Button onClick={() => setIsCreateDialogOpen(true)} size="lg" className="h-11 px-6">
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
        <div className="border rounded-xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-24 py-4 px-6 text-base font-semibold">ID</TableHead>
                <TableHead className="py-4 px-6 text-base font-semibold">Loại công việc</TableHead>
                <TableHead className="w-40 text-right py-4 px-6 text-base font-semibold">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {types.map((type: JobType) => (
                <TableRow key={type.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="py-5 px-6 text-base font-medium text-gray-700">{type.id}</TableCell>
                  <TableCell className="py-5 px-6 text-base font-medium">{type.type}</TableCell>
                  <TableCell className="text-right py-5 px-6">
                    <div className="flex justify-end gap-3">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl">Thêm loại công việc mới</DialogTitle>
            <DialogDescription className="text-base">
              Nhập tên loại công việc mới
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label htmlFor="type" className="text-base font-medium">Loại công việc</Label>
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
            <DialogTitle className="text-2xl">Chỉnh sửa loại công việc</DialogTitle>
            <DialogDescription className="text-base">
              Cập nhật tên loại công việc
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label htmlFor="edit-type" className="text-base font-medium">Loại công việc</Label>
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


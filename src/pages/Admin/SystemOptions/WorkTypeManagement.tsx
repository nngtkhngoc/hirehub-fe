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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Tổng số: <span className="font-semibold">{types.length}</span> hình thức
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
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
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">ID</TableHead>
                <TableHead>Hình thức làm việc</TableHead>
                <TableHead className="w-32 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {types.map((type: WorkType) => (
                <TableRow key={type.id}>
                  <TableCell>{type.id}</TableCell>
                  <TableCell className="font-medium">{type.workspace}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(type)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(type)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm hình thức làm việc mới</DialogTitle>
            <DialogDescription>
              Nhập tên hình thức làm việc mới
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="workspace">Hình thức làm việc</Label>
            <Input
              id="workspace"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="VD: Remote"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setInputValue("");
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleCreate} disabled={!inputValue.trim()}>
              Thêm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa hình thức làm việc</DialogTitle>
            <DialogDescription>
              Cập nhật tên hình thức làm việc
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="edit-workspace">Hình thức làm việc</Label>
            <Input
              id="edit-workspace"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="VD: Remote"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedType(null);
                setInputValue("");
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleEdit} disabled={!inputValue.trim()}>
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


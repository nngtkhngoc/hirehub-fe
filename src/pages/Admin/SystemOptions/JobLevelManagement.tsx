import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllJobLevels,
  createJobLevel,
  updateJobLevel,
  deleteJobLevel,
} from "@/api/systemOptions";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, TrendingUp } from "lucide-react";
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

interface JobLevel {
  id: number;
  level: string;
}

export const JobLevelManagement = () => {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<JobLevel | null>(null);
  const [inputValue, setInputValue] = useState("");

  const { data: levels = [], isLoading } = useQuery({
    queryKey: ["jobLevels"],
    queryFn: getAllJobLevels,
  });

  const createMutation = useMutation({
    mutationFn: createJobLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobLevels"] });
      toast.success("Thêm cấp độ thành công!");
      setIsCreateDialogOpen(false);
      setInputValue("");
    },
    onError: () => {
      toast.error("Thêm cấp độ thất bại!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, level }: { id: number; level: string }) =>
      updateJobLevel(id, level),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobLevels"] });
      toast.success("Cập nhật cấp độ thành công!");
      setIsEditDialogOpen(false);
      setSelectedLevel(null);
      setInputValue("");
    },
    onError: () => {
      toast.error("Cập nhật cấp độ thất bại!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJobLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobLevels"] });
      toast.success("Xóa cấp độ thành công!");
      setIsDeleteDialogOpen(false);
      setSelectedLevel(null);
    },
    onError: () => {
      toast.error("Xóa cấp độ thất bại!");
    },
  });

  const handleCreate = () => {
    if (inputValue.trim()) {
      createMutation.mutate(inputValue.trim());
    }
  };

  const handleEdit = () => {
    if (selectedLevel && inputValue.trim()) {
      updateMutation.mutate({ id: selectedLevel.id, level: inputValue.trim() });
    }
  };

  const handleDelete = () => {
    if (selectedLevel) {
      deleteMutation.mutate(selectedLevel.id);
    }
  };

  const openEditDialog = (level: JobLevel) => {
    setSelectedLevel(level);
    setInputValue(level.level);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (level: JobLevel) => {
    setSelectedLevel(level);
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
          Thêm cấp độ
        </Button>
      </div>

      {levels.length === 0 ? (
        <Empty>
          <EmptyContent>
            <EmptyMedia variant="icon">
              <TrendingUp className="text-primary" />
            </EmptyMedia>
            <EmptyTitle>Chưa có cấp độ nào</EmptyTitle>
            <EmptyDescription>
              Thêm cấp độ đầu tiên để bắt đầu
            </EmptyDescription>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="border rounded-xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-24 py-4 px-6 text-base font-semibold">ID</TableHead>
                <TableHead className="py-4 px-6 text-base font-semibold">Cấp độ</TableHead>
                <TableHead className="w-40 text-right py-4 px-6 text-base font-semibold">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {levels.map((level: JobLevel) => (
                <TableRow key={level.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="py-5 px-6 text-base font-medium text-gray-700">{level.id}</TableCell>
                  <TableCell className="py-5 px-6 text-base font-medium">{level.level}</TableCell>
                  <TableCell className="text-right py-5 px-6">
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-4"
                        onClick={() => openEditDialog(level)}
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Sửa
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-4 text-destructive hover:text-destructive"
                        onClick={() => openDeleteDialog(level)}
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
            <DialogTitle className="text-2xl">Thêm cấp độ mới</DialogTitle>
            <DialogDescription className="text-base">
              Nhập tên cấp độ công việc mới
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label htmlFor="level" className="text-base font-medium">Cấp độ</Label>
              <Input
                id="level"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="VD: Junior"
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
            <DialogTitle className="text-2xl">Chỉnh sửa cấp độ</DialogTitle>
            <DialogDescription className="text-base">
              Cập nhật tên cấp độ công việc
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label htmlFor="edit-level" className="text-base font-medium">Cấp độ</Label>
              <Input
                id="edit-level"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="VD: Junior"
                className="h-12 text-base"
              />
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedLevel(null);
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
              Bạn có chắc chắn muốn xóa cấp độ "{selectedLevel?.level}"?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedLevel(null);
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


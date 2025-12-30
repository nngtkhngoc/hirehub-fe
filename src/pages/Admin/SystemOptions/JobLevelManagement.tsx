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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Tổng số: <span className="font-semibold">{levels.length}</span> cấp độ
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
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
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">ID</TableHead>
                <TableHead>Cấp độ</TableHead>
                <TableHead className="w-32 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {levels.map((level: JobLevel) => (
                <TableRow key={level.id}>
                  <TableCell>{level.id}</TableCell>
                  <TableCell className="font-medium">{level.level}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(level)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(level)}
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
            <DialogTitle>Thêm cấp độ mới</DialogTitle>
            <DialogDescription>
              Nhập tên cấp độ công việc mới
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="level">Cấp độ</Label>
            <Input
              id="level"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="VD: Junior"
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
            <DialogTitle>Chỉnh sửa cấp độ</DialogTitle>
            <DialogDescription>
              Cập nhật tên cấp độ công việc
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="edit-level">Cấp độ</Label>
            <Input
              id="edit-level"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="VD: Junior"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedLevel(null);
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


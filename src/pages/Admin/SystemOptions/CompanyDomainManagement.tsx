import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllCompanyDomains,
  createCompanyDomain,
  updateCompanyDomain,
  deleteCompanyDomain,
} from "@/api/systemOptions";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";
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

interface CompanyDomain {
  id: number;
  domain: string;
}

export const CompanyDomainManagement = () => {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<CompanyDomain | null>(null);
  const [inputValue, setInputValue] = useState("");

  const { data: domains = [], isLoading } = useQuery({
    queryKey: ["companyDomains"],
    queryFn: getAllCompanyDomains,
  });

  const createMutation = useMutation({
    mutationFn: createCompanyDomain,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyDomains"] });
      toast.success("Thêm lĩnh vực thành công!");
      setIsCreateDialogOpen(false);
      setInputValue("");
    },
    onError: () => {
      toast.error("Thêm lĩnh vực thất bại!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, domain }: { id: number; domain: string }) =>
      updateCompanyDomain(id, domain),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyDomains"] });
      toast.success("Cập nhật lĩnh vực thành công!");
      setIsEditDialogOpen(false);
      setSelectedDomain(null);
      setInputValue("");
    },
    onError: () => {
      toast.error("Cập nhật lĩnh vực thất bại!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCompanyDomain,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyDomains"] });
      toast.success("Xóa lĩnh vực thành công!");
      setIsDeleteDialogOpen(false);
      setSelectedDomain(null);
    },
    onError: () => {
      toast.error("Xóa lĩnh vực thất bại!");
    },
  });

  const handleCreate = () => {
    if (inputValue.trim()) {
      createMutation.mutate(inputValue.trim());
    }
  };

  const handleEdit = () => {
    if (selectedDomain && inputValue.trim()) {
      updateMutation.mutate({ id: selectedDomain.id, domain: inputValue.trim() });
    }
  };

  const handleDelete = () => {
    if (selectedDomain) {
      deleteMutation.mutate(selectedDomain.id);
    }
  };

  const openEditDialog = (domain: CompanyDomain) => {
    setSelectedDomain(domain);
    setInputValue(domain.domain);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (domain: CompanyDomain) => {
    setSelectedDomain(domain);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Tổng số: <span className="font-semibold">{domains.length}</span> lĩnh vực
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Thêm lĩnh vực
        </Button>
      </div>

      {domains.length === 0 ? (
        <Empty>
          <EmptyContent>
            <EmptyMedia variant="icon">
              <Building2 className="text-primary" />
            </EmptyMedia>
            <EmptyTitle>Chưa có lĩnh vực nào</EmptyTitle>
            <EmptyDescription>
              Thêm lĩnh vực đầu tiên để bắt đầu
            </EmptyDescription>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">ID</TableHead>
                <TableHead>Tên lĩnh vực</TableHead>
                <TableHead className="w-32 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {domains.map((domain: CompanyDomain) => (
                <TableRow key={domain.id}>
                  <TableCell>{domain.id}</TableCell>
                  <TableCell className="font-medium">{domain.domain}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(domain)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(domain)}
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
            <DialogTitle>Thêm lĩnh vực mới</DialogTitle>
            <DialogDescription>
              Nhập tên lĩnh vực công ty mới
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="domain">Tên lĩnh vực</Label>
            <Input
              id="domain"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="VD: Công nghệ thông tin"
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
            <DialogTitle>Chỉnh sửa lĩnh vực</DialogTitle>
            <DialogDescription>
              Cập nhật tên lĩnh vực công ty
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="edit-domain">Tên lĩnh vực</Label>
            <Input
              id="edit-domain"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="VD: Công nghệ thông tin"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedDomain(null);
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
              Bạn có chắc chắn muốn xóa lĩnh vực "{selectedDomain?.domain}"?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedDomain(null);
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


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
import {
  Empty,
  EmptyContent,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";

interface CompanyDomain {
  id: number;
  domain: string;
}

export const CompanyDomainManagement = () => {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<CompanyDomain | null>(
    null
  );
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
      updateMutation.mutate({
        id: selectedDomain.id,
        domain: inputValue.trim(),
      });
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
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          size="lg"
          className="h-10 px-6"
        >
          <Plus className="w-5 h-5 mr-2" />
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
        <div className="border rounded-xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-24 py-4 px-6 text-base font-semibold">
                  ID
                </TableHead>
                <TableHead className="py-4 px-6 text-base font-semibold">
                  Tên lĩnh vực
                </TableHead>
                <TableHead className="w-40 text-right py-4 px-6 text-base font-semibold">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {domains.map((domain: CompanyDomain) => (
                <TableRow
                  key={domain.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="py-5 px-6 text-base font-medium text-gray-700">
                    {domain.id}
                  </TableCell>
                  <TableCell className="py-5 px-6 text-base font-medium">
                    {domain.domain}
                  </TableCell>
                  <TableCell className="text-right py-5 px-6">
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-4"
                        onClick={() => openEditDialog(domain)}
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Sửa
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-4 text-destructive hover:text-destructive"
                        onClick={() => openDeleteDialog(domain)}
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
            <DialogTitle className="text-2xl">Thêm lĩnh vực mới</DialogTitle>
            <DialogDescription className="text-base">
              Nhập tên lĩnh vực công ty mới
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label htmlFor="domain" className="text-base font-medium">
                Tên lĩnh vực
              </Label>
              <Input
                id="domain"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="VD: Công nghệ thông tin"
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
            <DialogTitle className="text-2xl">Chỉnh sửa lĩnh vực</DialogTitle>
            <DialogDescription className="text-base">
              Cập nhật tên lĩnh vực công ty
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label htmlFor="edit-domain" className="text-base font-medium">
                Tên lĩnh vực
              </Label>
              <Input
                id="edit-domain"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="VD: Công nghệ thông tin"
                className="h-12 text-base"
              />
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedDomain(null);
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

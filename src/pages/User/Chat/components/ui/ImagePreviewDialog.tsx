import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePreviewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    imageName?: string;
}

export const ImagePreviewDialog = ({
    isOpen,
    onClose,
    imageUrl,
    imageName = "image",
}: ImagePreviewDialogProps) => {
    const handleDownload = async () => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = imageName.includes(".") ? imageName : `${imageName}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
            // Fallback: open in new tab if blob fetch fails
            window.open(imageUrl, "_blank");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="max-w-4xl w-[95vw] h-auto max-h-[90vh] p-0 overflow-hidden bg-transparent border-none shadow-none"
                overlayClassName="bg-black/40"
                showCloseButton={false}
            >
                <DialogHeader className="absolute top-4 right-4 z-50 flex-row gap-2 space-y-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDownload}
                        className="text-white hover:bg-white/20 transition-colors"
                        title="Tải xuống"
                    >
                        <Download className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="text-white hover:bg-white/20 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </DialogHeader>
                <div className="flex items-center justify-center w-full h-full min-h-[300px] p-6">
                    <img
                        src={imageUrl}
                        alt={imageName}
                        className="max-w-full max-h-[80vh] object-contain select-none"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

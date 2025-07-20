import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { useEffect } from "react";

export function ToastManual({
    message,
    show,
    setShow,
}: {
    message: string;
    show: boolean;
    setShow: (val: boolean) => void;
}) {
    useEffect(() => {
        if (show) {
            const timeout = setTimeout(() => {
                setShow(false);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [show, setShow]);

    return (
        <div
            className={cn(
                "fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md text-black bg-white shadow transition-all duration-300",
                show
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-10 pointer-events-none"
            )}
        >
            <div className="flex gap-4 items-center">
                <Info />
                {message}
            </div>
        </div>
    );
}

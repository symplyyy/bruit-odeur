import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "light" | "black";
  className?: string;
  priority?: boolean;
  alt?: string;
};

export function Logo({
  variant = "black",
  className,
  priority,
  alt = "B&O'Z",
}: Props) {
  const src = variant === "light" ? "/logo-light.svg" : "/logo-black.svg";
  return (
    <Image
      src={src}
      alt={alt}
      width={200}
      height={200}
      priority={priority}
      className={cn("block select-none", className)}
    />
  );
}

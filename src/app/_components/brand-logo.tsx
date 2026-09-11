import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  priority?: boolean;
}

export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className={className}
      height={675}
      priority={priority}
      sizes="48px"
      src="/brand/neil-rabbit-icon.png"
      width={675}
    />
  );
}

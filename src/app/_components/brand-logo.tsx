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
      height={1080}
      priority={priority}
      sizes="48px"
      src="/brand/logo.png"
      width={1078}
    />
  );
}

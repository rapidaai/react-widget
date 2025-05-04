import { cn } from "@/styles/media";
import { FC, HTMLAttributes } from "react";

/**
 *
 * @param param0
 * @returns
 */
export const Avator: FC<{ name: string } & HTMLAttributes<HTMLDivElement>> = ({
  name,
  className,
}) => {
  /**
   *
   */
  const initial = name.charAt(0).toUpperCase();
  const getColorForName = (name: string) => {
    const colors = [
      "bg-green-600",
      "bg-blue-600",
      "bg-red-600",
      "bg-yellow-600",
      "bg-purple-600",
    ];

    // Simple hash function
    const hash = name.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  return (
    <div
      className={cn(
        className,
        getColorForName(name),
        `w-8 h-8 rounded-full flex items-center justify-center text-white font-medium`
      )}
    >
      {initial}
    </div>
  );
};

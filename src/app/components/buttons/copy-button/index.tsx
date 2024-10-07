import { BorderButton, ButtonProps } from "@/app/components/buttons";
import { CopyIcon } from "@/icons/copy";
import { TickIcon } from "@/icons/tick";
import { cn } from "@/styles/media";
import React, { FC, memo, useState } from "react";

export const CopyButton: FC<
  ButtonProps & { iconClassName: string; withLabel?: boolean }
> = memo((props) => {
  const [isChecked, setIsChecked] = useState(false);

  const copyItem = (item: string) => {
    setIsChecked(true);
    navigator.clipboard.writeText(item);
    setTimeout(() => {
      setIsChecked(false);
    }, 2000); // Reset back after 2 seconds
  };
  return (
    <BorderButton
      className={cn(
        "pks_h-6 pks_w-6 pks_p-0.5 pks_border-[0.2px]",
        props.className
      )}
      onClick={() => {
        copyItem(props.children);
      }}
    >
      {isChecked ? (
        <TickIcon className={props.iconClassName} />
      ) : (
        <CopyIcon className={props.iconClassName} />
      )}
      {props.withLabel && (
        <span className="pks_text-sm pks_mx-1 pks_opacity-60 pks_font-normal">
          Copy
        </span>
      )}
    </BorderButton>
  );
});

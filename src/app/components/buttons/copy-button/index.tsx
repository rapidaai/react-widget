import { BorderButton, ButtonProps } from "@/app/components/buttons";
import { CopyIcon } from "@/icons/copy";
import { TickIcon } from "@/icons/tick";
import { cn } from "@/styles/media";
import React, { useState } from "react";

export function CopyButton(props: ButtonProps) {
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
        <TickIcon className="pks_w-4 pks_h-4 pks_text-green-600" />
      ) : (
        <CopyIcon className="pks_w-4 pks_h-4" />
      )}{" "}
    </BorderButton>
  );
}

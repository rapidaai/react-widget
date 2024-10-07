import { BorderButton, ButtonProps } from "@/app/components/buttons";
import { CopyIcon } from "@/icons/copy";
import { LikeIcon } from "@/icons/like";
import { TickIcon } from "@/icons/tick";
import { cn } from "@/styles/media";
import React, { FC, memo, useEffect, useState } from "react";

export const LikeButton: FC<
  ButtonProps & { iconClassName: string; withLabel?: boolean }
> = memo((props) => {
  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => {
    if (isChecked) {
      setTimeout(() => {
        setIsChecked(false);
      }, 2000); // Reset back after 2 seconds
    }
  }, [isChecked]);

  const check = () => {
    setIsChecked(true);
  };

  return (
    <BorderButton
      className={cn(
        "pks_h-6 pks_w-6 pks_p-0.5 pks_border-[0.2px]",
        props.className
      )}
      onClick={(e) => {
        if (props.onClick) props.onClick(e);
        check();
      }}
    >
      {isChecked ? (
        <TickIcon className={props.iconClassName} />
      ) : (
        <LikeIcon className={props.iconClassName} />
      )}
      {props.withLabel && (
        <span className="pks_text-sm pks_mx-1 pks_opacity-60 pks_font-normal">
          Like
        </span>
      )}
    </BorderButton>
  );
});

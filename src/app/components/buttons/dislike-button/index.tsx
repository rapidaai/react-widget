import { BorderButton, ButtonProps } from "@/app/components/buttons";
import { CopyIcon } from "@/icons/copy";
import { DislikeIcon } from "@/icons/dislike";
import { TickIcon } from "@/icons/tick";
import { cn } from "@/styles/media";
import React, { FC, memo, useEffect, useState } from "react";

export const DislikeButton: FC<ButtonProps & { iconClassName: string }> = memo(
  (props) => {
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
          <DislikeIcon className={props.iconClassName} />
        )}
      </BorderButton>
    );
  }
);

<<<<<<< HEAD
import * as React from "react";
import { cn } from "@/lib/utils";
=======
import * as React from "react"
import { cn } from "@/lib/utils"
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
<<<<<<< HEAD
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
=======
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
          className
        )}
        ref={ref}
        {...props}
      />
<<<<<<< HEAD
    );
  }
);
Input.displayName = "Input";

export { Input };
=======
    )
  }
)
Input.displayName = "Input"

export { Input }
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801

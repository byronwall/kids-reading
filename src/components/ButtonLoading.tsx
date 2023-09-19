import { Button } from "./ui/button";
import { Icons } from "./icons";

type ButtonProps = Parameters<typeof Button>[0];

export function ButtonLoading(props: ButtonProps & { isLoading?: boolean }) {
  const { isLoading, children, ...rest } = props;

  return (
    <Button disabled={isLoading} {...rest}>
      <div className="flex items-center gap-2">
        {children}

        {isLoading && (
          <div className="animate-spin">
            <Icons.spinner />
          </div>
        )}
      </div>
    </Button>
  );
}

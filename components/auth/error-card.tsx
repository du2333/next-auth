import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { CardWrapper } from "./card-wrapper";

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel=""
      backButtonHref="/auth/login"
      backButtonLabel="Back to login page"
    >
      <div className="w-full flex justify-center items-center gap-x-2">
        <ExclamationTriangleIcon className="text-destructive h-4 w-4" />
        <p className="text-destructive">Oops something went wrong!</p>
      </div>
    </CardWrapper>
  );
};

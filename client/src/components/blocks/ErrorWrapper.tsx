import { getLastValidRoute } from "../../utils/routes/routeStore";
import B_Error from "../../whitelabel/src/blocks/b-error/b-error";
import { b_errorData } from "../../whitelabel/src/blocks/b-error/b-error.data";
import type { ErrorTypes } from "../../whitelabel/src/blocks/b-error/b-error.types";

interface ErrorWrapperType extends Partial<ErrorTypes> {}

const ErrorWrapper: React.FC<ErrorWrapperType> = ({ status }) => {
  const lastVisitPage = getLastValidRoute();
  return (
    <B_Error lastVisitPage={lastVisitPage} {...b_errorData} status={status} />
  );
};

export default ErrorWrapper;

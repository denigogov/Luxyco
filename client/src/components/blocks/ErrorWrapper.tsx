import { getLastValidRoute } from "../../utils/routes/routeStore";
import B_Error from "../../whitelabel/src/blocks/b-error/b-error";
import { b_errorData } from "../../whitelabel/src/blocks/b-error/b-error.data";

const ErrorWrapper: React.FC = () => {
  const lastVisitPage = getLastValidRoute();
  return <B_Error lastVisitPage={lastVisitPage} {...b_errorData} />;
};

export default ErrorWrapper;

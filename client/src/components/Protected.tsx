import { Navigate } from "react-router-dom";
import useUserStore from "../store/userStore";

function Protected({ children }: { children: React.ReactNode }) {
  const { user } = useUserStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default Protected;
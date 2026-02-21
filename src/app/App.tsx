import { SessionProvider } from "./store";
import AppRoutes from "./routes";
import Shell from "../ui/layout/Shell";

export default function App() {
  return (
    <SessionProvider>
      <Shell>
        <AppRoutes />
      </Shell>
    </SessionProvider>
  );
}

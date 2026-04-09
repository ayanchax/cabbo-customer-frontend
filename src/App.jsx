import { AppRouter } from "@/routes";
import { Toaster } from "react-hot-toast";
import { DEFAULT_TOAST_OPTIONS } from "@/utils";
function App() {
  return (
    <>
      <AppRouter />
      {/* Industry standard positioning and ordering for toast notifications */}
      <Toaster reverseOrder position="bottom-center" containerStyle={{ bottom: 20 }} toastOptions={DEFAULT_TOAST_OPTIONS} />
    </>
  );
}

export default App;

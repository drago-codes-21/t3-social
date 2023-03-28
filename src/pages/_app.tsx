import { Roboto } from "next/font/google";
import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider>
      <main className={roboto.className}>
        <Toaster position="bottom-center" />
        <Component {...pageProps} />
      </main>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";

// Create a client
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

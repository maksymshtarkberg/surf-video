import "../styles/globals.css";
import type { AppProps } from "next/app";
import BaseLayout from "components/layout/BaseLayout";
import { wrapper } from "store";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BaseLayout>
      <Component {...pageProps} />
    </BaseLayout>
  );
}

export default wrapper.withRedux(MyApp);

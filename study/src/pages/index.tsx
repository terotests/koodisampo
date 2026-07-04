import { Redirect } from "@docusaurus/router";
import useBaseUrl from "@docusaurus/useBaseUrl";

/** Client-side fallback when navigating to site root from another doc page. */
export default function Home() {
  return <Redirect to={useBaseUrl("/docs/intro/")} />;
}

import pageData from "./_data/meta";
import { SITE_NAME } from "./_data/site";

const page = pageData["Home"];

export const metadata = {
  title: page.title,
  description: page.description,
};

export default function Home() {
  return (
    <main>
      <h1>{SITE_NAME}</h1>
    </main>
  );
}

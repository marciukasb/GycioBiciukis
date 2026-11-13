import pageData, { SITE_NAME } from "./_data/meta";

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

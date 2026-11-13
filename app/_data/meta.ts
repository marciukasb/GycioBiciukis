import { Metadata } from "next";
import { SITE_NAME } from "./site";

interface PageData {
  [key: string]: Metadata;
}

const pageData = {
  Home: {
    title: SITE_NAME,
    description: "",
  },
  Posts: {
    title: `Įrašai – ${SITE_NAME}`,
    description: "",
  },
  About: {
    title: `Apie – ${SITE_NAME}`,
    description: "",
  },
  404: {
    title: `Puslapis nerastas – ${SITE_NAME}`,
    description: "",
  },
} as PageData;

export default pageData;

import { Metadata } from "next";

export const SITE_NAME = "Gyčio Bičiūkis";

interface PageData {
  [key: string]: Metadata;
}

const pageData = {
  Home: {
    title: SITE_NAME,
    description: "",
  },
  About: {
    title: `${SITE_NAME} - About`,
    description: "",
  },
  Blog: {
    title: `${SITE_NAME} - Blog`,
    description: "",
  },
  Contacts: {
    title: `${SITE_NAME} - Contacts`,
    description: "",
  },
  404: {
    title: "404 Page not found",
    description: "",
  },
} as PageData;

export default pageData;

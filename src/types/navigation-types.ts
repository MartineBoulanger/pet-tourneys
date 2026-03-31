import { IconType } from 'react-icons';

// =================================================
// Type for the links in the header & the admin page
// =================================================
export type NavigationData = {
  id: number;
  url: string;
  linkText: string;
  text: string;
  imageSrc?: string;
  roleAllowed?: 'admin' | 'author' | 'both';
  children?: Links;
}[];

// =================================================
// Type for the links in the footer
// =================================================
export type FooterData = {
  id: number;
  url: string;
  Icon: IconType;
  name: string;
}[];

// =================================================
// Type for the links on all pages
// =================================================
export type Links = {
  id: number;
  url: string;
  text: string;
}[];

// =================================================
// Type for the partners carousel
// =================================================
export type PartnersData = {
  name: string;
  image: string;
  link: string;
}[];

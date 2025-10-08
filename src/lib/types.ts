import { IconType } from 'react-icons';

// Type for the links in the header and on the admin page
export type NavigationData = {
  id: number;
  url: string;
  linkText: string;
  text: string;
  imageSrc: string;
  roleAllowed?: 'admin' | 'author' | 'both';
  children?: Links;
}[];

// Type for the links in the footer
export type FooterData = {
  id: number;
  url: string;
  Icon: IconType;
  name: string;
}[];

// Type for the links in the drop down menu on the pages
export type Links = {
  id: number;
  url: string;
  text: string;
}[];

// Type for the partners data for the partners carousel on the homepage
export type PartnersData = {
  name: string;
  image: string;
  isPriority?: boolean;
}[];

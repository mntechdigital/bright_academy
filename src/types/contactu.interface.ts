
export interface ContactUsFormData {
  subTitle: string;
  title: string;
  companyNumber: string;
  companyEmail: string;
  companyLocation: string;
  facebookLink: string;
  instagramLink: string;
  youtubeLink: string;
  image: File | null;
}

export interface ContactUsData {
  id: string;
  subTitle: string;
  title: string;
  companyNumber: string;
  companyEmail: string;
  companyLocation: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  image?: string;
}
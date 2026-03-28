export interface ServiceDetail {
  id: string;
  image: string;
  imageMobile: string;
  number: string;
}

export const servicesData: ServiceDetail[] = [
  {
    id: "brandIdentity",
    image: "/img/illustrations/1200x1200_service-image-01.webp",
    imageMobile: "/img/illustrations/800x800_service-image-01.webp",
    number: "01",
  },
  {
    id: "productDesign",
    image: "/img/illustrations/1200x1200_service-image-02.webp",
    imageMobile: "/img/illustrations/800x800_service-image-02.webp",
    number: "02",
  },
  {
    id: "webDesign",
    image: "/img/illustrations/1200x1200_service-image-03.webp",
    imageMobile: "/img/illustrations/800x800_service-image-03.webp",
    number: "03",
  },
  {
    id: "aiAutomation",
    image: "/img/illustrations/1200x1200_service-image-04.webp",
    imageMobile: "/img/illustrations/800x800_service-image-04.webp",
    number: "04",
  },
  {
    id: "marketingPerformance",
    image: "/img/illustrations/1200x1200_service-image-05.webp",
    imageMobile: "/img/illustrations/800x800_service-image-05.webp",
    number: "05",
  },
];

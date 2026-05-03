export const BINEY = {
  name: "Biney Medical Centre",
  alternateName: "Biney Medical Center",
  address: "Italian Flats Comm. 2, Community 2, Tema, Ghana",
  shortAddress: "Italian Flats, Community 2, Tema",
  region: "Greater Accra Region",
  district: "Tema Municipal",
  city: "Tema",
  locality: "Tema Municipal",
  phoneNumbers: [
    {
      label: "0302 202546",
      href: "tel:+233302202546",
    },
    {
      label: "0303 208579",
      href: "tel:+233303208579",
    },
  ],
  facilityType: "Private primary hospital",
  ownership: "Private",
  categories: ["Doctors and Clinics", "Hospitals", "Medical Clinics", "Healthcare Services"],
  listedServices: ["General care", "ENT care", "Pregnancy care"],
  acceptedInsurance: ["NHIS", "Nationwide Medical Insurance"],
  hours: "Monday to Sunday, 08:00 - 20:00",
  doctorsListed: 0,
  reviewsListed: 0,
  sources: [
    {
      label: "Ghana Hospitals",
      href: "https://ghanahospitals.org/regions/fdetails.php?id=1854&r=G.+ACCRA",
    },
    {
      label: "GhanaYello",
      href: "https://www.ghanayello.com/company/50589/Biney_Medical_Center",
    },
    {
      label: "Ghana Business Web",
      href: "https://www.ghanabusinessweb.com/tema-community_2-str_0-biney_medical_centre-9349.html",
    },
    {
      label: "ZMedHealth",
      href: "https://ghana.zmedhealth.com/h-43680/Biney-Medical-Centre",
    },
    {
      label: "Medpages",
      href: "https://www.medpages.info/sf/index.php?orgcode=313846&page=organisation",
    },
    {
      label: "Go Africa Online",
      href: "https://www.goafricaonline.com/gh/973669-biney-medical-centre",
    },
  ],
} as const;

export const serviceHighlights = [
  {
    title: "Everyday medical care",
    description: "We make room for the everyday concerns families bring in: consultations, checks, follow-ups, and practical guidance when something does not feel right.",
  },
  {
    title: "ENT attention",
    description: "Ear, nose, and throat concerns are part of our listed care focus, with a patient-first approach that keeps communication simple and clear.",
  },
  {
    title: "Pregnancy support",
    description: "We support women and families through pregnancy-related visits with the calm, respectful care every patient deserves.",
  },
] as const;

export const staffPlaceholders = [
  "Clinical Team",
  "Nursing Team",
  "Reception Team",
  "Patient Care Team",
] as const;

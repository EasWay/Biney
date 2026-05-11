/**
 * clinic.config.ts
 * ─────────────────────────────────────────────────────────────
 * SINGLE SOURCE OF TRUTH for all clinic-specific data.
 * To white-label this template for a new client, only this file
 * (and the /data knowledge base files) need to change.
 * ─────────────────────────────────────────────────────────────
 */

export const CLINIC_CONFIG = {
  // ── Identity ──────────────────────────────────────────────
  name: "Biney Medical Centre",
  alternateName: "Biney Medical Center",
  tagline: "Quality Healthcare for the Tema Community",

  // ── Location ──────────────────────────────────────────────
  address: "Italian Flats Comm. 2, Community 2, Tema, Ghana",
  shortAddress: "Italian Flats, Community 2, Tema",
  city: "Tema",
  region: "Greater Accra Region",
  district: "Tema Municipal",
  googleMapsQuery: "Biney+Medical+Centre+Tema+Ghana",

  // ── Contact ───────────────────────────────────────────────
  phones: [
    { label: "0302 202546", tel: "+233302202546" },
    { label: "0303 208579", tel: "+233303208579" },
  ],
  emergencyPhone: "+233302202546",  // Primary line for emergency redirect
  nationalEmergency: "112",         // Ghana National Ambulance
  whatsapp: "+233302202546",
  email: "info@bineymedicalcentre.com.gh",
  website: "https://biney-medical-center.vercel.app",

  // ── Hours ─────────────────────────────────────────────────
  hours: "Monday to Sunday, 08:00 – 20:00",
  hoursTable: [
    { day: "Monday – Friday", hours: "08:00 – 20:00" },
    { day: "Saturday",        hours: "08:00 – 20:00" },
    { day: "Sunday",          hours: "08:00 – 20:00" },
    { day: "Public Holidays", hours: "On-call / Emergency only" },
  ],
  timezone: "Africa/Accra",

  // ── Facility ──────────────────────────────────────────────
  facilityType: "Private primary hospital",
  ownership: "Private",

  // ── Departments ───────────────────────────────────────────
  departments: ["General Medicine", "ENT", "Maternity"] as const,

  // ── Insurance ─────────────────────────────────────────────
  acceptedInsurance: ["NHIS", "Nationwide Medical Insurance"],

  // ── AI Persona ────────────────────────────────────────────
  aiPersonaName: "Bobo",
  aiPersonaTagline: "Your Health Buddy",

  // ── Site Routes (used to build WEBSITE_CONTEXT) ───────────
  routes: {
    home:      { path: "/",          label: "Home" },
    about:     { path: "/about",     label: "About" },
    services:  { path: "/services",  label: "Services" },
    resources: { path: "/resources", label: "Health Resources" },
    insurance: { path: "/insurance", label: "Insurance" },
    faq:       { path: "/faq",       label: "FAQ" },
    contact:   { path: "/contact",   label: "Contact" },
  },

  // ── Social / Directory ────────────────────────────────────
  sources: [
    { label: "Ghana Hospitals",      href: "https://ghanahospitals.org/regions/fdetails.php?id=1854&r=G.+ACCRA" },
    { label: "GhanaYello",           href: "https://www.ghanayello.com/company/50589/Biney_Medical_Center" },
    { label: "Ghana Business Web",   href: "https://www.ghanabusinessweb.com/tema-community_2-str_0-biney_medical_centre-9349.html" },
    { label: "ZMedHealth",           href: "https://ghana.zmedhealth.com/h-43680/Biney-Medical-Centre" },
    { label: "Medpages",             href: "https://www.medpages.info/sf/index.php?orgcode=313846&page=organisation" },
    { label: "Go Africa Online",     href: "https://www.goafricaonline.com/gh/973669-biney-medical-centre" },
  ],
} as const;

// ── Derived helpers ────────────────────────────────────────────
export const primaryPhone    = CLINIC_CONFIG.phones[0];
export const emergencyPhone  = CLINIC_CONFIG.emergencyPhone;
export const clinicName      = CLINIC_CONFIG.name;
export const aiPersonaName   = CLINIC_CONFIG.aiPersonaName;

export const siteConfig = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/nyx_club_madrid',
    fetlife: process.env.NEXT_PUBLIC_FETLIFE_URL || 'https://fetlife.com/NYX_BDSM_CLUB',
  },
  contact: {
    email: process.env.NEXT_PUBLIC_EMAIL || 'nyxclubmadrid@gmail.com',
    phone: process.env.NEXT_PUBLIC_PHONE || '+34 602 08 30 14',
    address: {
      street: process.env.NEXT_PUBLIC_ADDRESS || 'Calle de Amaniel 13',
      city: process.env.NEXT_PUBLIC_CITY || 'Madrid',
      country: process.env.NEXT_PUBLIC_COUNTRY || 'España',
      postalCode: process.env.NEXT_PUBLIC_POSTAL_CODE || '28015',
    },
  },
}

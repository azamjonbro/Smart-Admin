<template>
    <div v-html="getIcon(name)" style="cursor: pointer; display:flex; align-items:center  " v-if="iconExists"></div>
  </template>
  
  <script>
  export default {
    name: "IconComponent",
    props: {
      name: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        icons: {
            shop:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M2 2H3.74001C4.82001 2 5.67 2.93 5.58 4L4.75 13.96C4.61 15.59 5.89999 16.99 7.53999 16.99H18.19C19.63 16.99 20.89 15.81 21 14.38L21.54 6.88C21.66 5.22 20.4 3.87 18.73 3.87H5.82001" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.25 22C16.9404 22 17.5 21.4404 17.5 20.75C17.5 20.0596 16.9404 19.5 16.25 19.5C15.5596 19.5 15 20.0596 15 20.75C15 21.4404 15.5596 22 16.25 22Z" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.25 22C8.94036 22 9.5 21.4404 9.5 20.75C9.5 20.0596 8.94036 19.5 8.25 19.5C7.55964 19.5 7 20.0596 7 20.75C7 21.4404 7.55964 22 8.25 22Z" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 8H21" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            settings: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 15.5A3.5 3.5 0 1115.5 12 3.5 3.5 0 0112 15.5zm8.94-3.4a7.07 7.07 0 000-2.2l-2.14-.33a7.43 7.43 0 00-.78-1.88l1.26-1.82a8 8 0 00-1.54-1.54l-1.82 1.26a7.43 7.43 0 00-1.88-.78l-.33-2.14a7.07 7.07 0 00-2.2 0l-.33 2.14a7.43 7.43 0 00-1.88.78L6.9 5.43a8 8 0 00-1.54 1.54l1.26 1.82a7.43 7.43 0 00-.78 1.88l-2.14.33a7.07 7.07 0 000 2.2l2.14.33a7.43 7.43 0 00.78 1.88l-1.26 1.82a8 8 0 001.54 1.54l1.82-1.26a7.43 7.43 0 001.88.78l.33 2.14a7.07 7.07 0 002.2 0l.33-2.14a7.43 7.43 0 001.88-.78l1.82 1.26a8 8 0 001.54-1.54l-1.26-1.82a7.43 7.43 0 00.78-1.88zm-8.94 2.9A4.5 4.5 0 1116.5 12a4.5 4.5 0 01-4.5 4.5z"/></svg>`,
            rightArrowIcon:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14.43 5.93005L20.5 12.0001L14.43 18.0701" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.5 12H20.33" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            arrowTop:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M19.9201 15.05L13.4001 8.53C12.6301 7.76 11.3701 7.76 10.6001 8.53L4.08008 15.05" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
            deleteIcon:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M21 5.98C17.67 5.65 14.32 5.48 10.98 5.48C9 5.48 7.02 5.58 5.04 5.78L3 5.98M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97M18.85 9.14L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14M10.33 16.5H13.66M9.5 12.5H14.5" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
            editIcon:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M10.9998 2H8.99976C3.99976 2 1.99976 4 1.99976 9V15C1.99976 20 3.99976 22 8.99976 22H14.9998C19.9998 22 21.9998 20 21.9998 15V13" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16.0396 3.02001L8.15963 10.9C7.85963 11.2 7.55963 11.79 7.49963 12.22L7.06963 15.23C6.90963 16.32 7.67964 17.08 8.76964 16.93L11.7796 16.5C12.1996 16.44 12.7896 16.14 13.0996 15.84L20.9796 7.96001C22.3396 6.60001 22.9796 5.02001 20.9796 3.02001C18.9796 1.02001 17.3996 1.66001 16.0396 3.02001Z" stroke="#000" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M14.9097 4.14999C15.5797 6.53999 17.4497 8.40999 19.8497 9.08999" stroke="#000" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
            allPriceIcon:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M17.7514 7.04997C17.5114 7.00997 17.2614 6.99998 17.0014 6.99998H7.00141C6.72141 6.99998 6.45141 7.01998 6.19141 7.05998C6.33141 6.77998 6.53141 6.52001 6.77141 6.28001L10.0214 3.02C11.3914 1.66 13.6114 1.66 14.9814 3.02L16.7314 4.78996C17.3714 5.41996 17.7114 6.21997 17.7514 7.04997Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M9 19C9 19.75 8.79 20.46 8.42 21.06C7.73 22.22 6.46 23 5 23C3.54 23 2.27 22.22 1.58 21.06C1.21 20.46 1 19.75 1 19C1 16.79 2.79 15 5 15C7.21 15 9 16.79 9 19Z" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M6.49172 18.9795H3.51172" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M5 17.5195V20.5095" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M22 12V17C22 20 20 22 17 22H7.63C7.94 21.74 8.21 21.42 8.42 21.06C8.79 20.46 9 19.75 9 19C9 16.79 7.21 15 5 15C3.8 15 2.73 15.53 2 16.36V12C2 9.28 3.64 7.38 6.19 7.06C6.45 7.02 6.72 7 7 7H17C17.26 7 17.51 7.00999 17.75 7.04999C20.33 7.34999 22 9.26 22 12Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M22 12.5H19C17.9 12.5 17 13.4 17 14.5C17 15.6 17.9 16.5 19 16.5H22" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
allIncrIcon:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M22 6V8.42C22 10 21 11 19.42 11H16V4.01C16 2.9 16.91 2 18.02 2C19.11 2.01 20.11 2.45 20.83 3.17C21.55 3.9 22 4.9 22 6Z" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M2 7V21C2 21.83 2.94 22.3 3.6 21.8L5.31 20.52C5.71 20.22 6.27 20.26 6.63 20.62L8.29 22.29C8.68 22.68 9.32 22.68 9.71 22.29L11.39 20.61C11.74 20.26 12.3 20.22 12.69 20.52L14.4 21.8C15.06 22.29 16 21.82 16 21V4C16 2.9 16.9 2 18 2H7H6C3 2 2 3.79 2 6V7Z" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M9 13.01H12" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M9 9.01001H12" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M5.99561 13H6.00459" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M5.99561 9H6.00459" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
birOylikIcon:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H7.63C7.94 21.74 8.21 21.42 8.42 21.06C8.79 20.46 9 19.75 9 19C9 16.79 7.21 15 5 15C4.06 15 3.19 15.33 2.5 15.88V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M2.5 12.4101V7.8401C2.5 6.6501 3.23 5.59006 4.34 5.17006L12.28 2.17006C13.52 1.70006 14.85 2.62009 14.85 3.95009V7.75008" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M22.5588 13.9702V16.0302C22.5588 16.5802 22.1188 17.0302 21.5588 17.0502H19.5988C18.5188 17.0502 17.5288 16.2602 17.4388 15.1802C17.3788 14.5502 17.6188 13.9602 18.0388 13.5502C18.4088 13.1702 18.9188 12.9502 19.4788 12.9502H21.5588C22.1188 12.9702 22.5588 13.4202 22.5588 13.9702Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M7 12H14" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M9 19C9 19.75 8.79 20.46 8.42 21.06C8.21 21.42 7.94 21.74 7.63 22C6.93 22.63 6.01 23 5 23C3.54 23 2.27 22.22 1.58 21.06C1.21 20.46 1 19.75 1 19C1 17.74 1.58 16.61 2.5 15.88C3.19 15.33 4.06 15 5 15C7.21 15 9 16.79 9 19Z" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M6.49171 18.9795H3.51172" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M5 17.5195V20.5095" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
birOylikMinusIcon:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M22.0015 6V8.42C22.0015 10 21.0015 11 19.4215 11H16.0015V4.01C16.0015 2.9 16.9115 2 18.0215 2C19.1115 2.01 20.1115 2.45 20.8315 3.17C21.5515 3.9 22.0015 4.9 22.0015 6Z" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M2.00146 7V21C2.00146 21.83 2.94146 22.3 3.60146 21.8L5.31146 20.52C5.71146 20.22 6.27146 20.26 6.63146 20.62L8.29147 22.29C8.68147 22.68 9.32146 22.68 9.71146 22.29L11.3915 20.61C11.7415 20.26 12.3015 20.22 12.6915 20.52L14.4015 21.8C15.0615 22.29 16.0015 21.82 16.0015 21V4C16.0015 2.9 16.9015 2 18.0015 2H7.00146H6.00146C3.00146 2 2.00146 3.79 2.00146 6V7Z" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M6.25146 10H11.7515" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
birKunlikIcon:`<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
  <path d="M8.71289 14.3298C8.71289 15.6198 9.70289 16.6598 10.9329 16.6598H13.4429C14.5129 16.6598 15.3829 15.7498 15.3829 14.6298C15.3829 13.4098 14.8529 12.9798 14.0629 12.6998L10.0329 11.2998C9.24289 11.0198 8.71289 10.5898 8.71289 9.36984C8.71289 8.24984 9.58289 7.33984 10.6529 7.33984H13.1629C14.3929 7.33984 15.3829 8.37984 15.3829 9.66984" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12.041 6V18" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12.041 22C17.5639 22 22.041 17.5228 22.041 12C22.041 6.47715 17.5639 2 12.041 2C6.51817 2 2.04102 6.47715 2.04102 12C2.04102 17.5228 6.51817 22 12.041 22Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
birKunlikMinusIcon:`<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
  <path d="M6.74585 19.7C7.56585 18.82 8.81586 18.89 9.53586 19.85L10.5459 21.2C11.3559 22.27 12.6659 22.27 13.4759 21.2L14.4859 19.85C15.2059 18.89 16.4558 18.82 17.2758 19.7C19.0558 21.6 20.5059 20.97 20.5059 18.31V7.04C20.5059 3.01 19.5659 2 15.7859 2H8.22586C4.44586 2 3.50586 3.01 3.50586 7.04V18.3C3.51586 20.97 4.97585 21.59 6.74585 19.7Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M9.26758 10H14.7676" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
allProductIcon:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M12.92 2.26009L19.43 5.77009C20.19 6.18009 20.19 7.35009 19.43 7.76009L12.92 11.2701C12.34 11.5801 11.66 11.5801 11.08 11.2701L4.57 7.76009C3.81 7.35009 3.81 6.18009 4.57 5.77009L11.08 2.26009C11.66 1.95009 12.34 1.95009 12.92 2.26009Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M3.61 10.1299L9.66 13.1599C10.41 13.5399 10.89 14.3099 10.89 15.1499V20.8699C10.89 21.6999 10.02 22.2299 9.28 21.8599L3.23 18.8299C2.48 18.4499 2 17.6799 2 16.8399V11.1199C2 10.2899 2.87 9.75993 3.61 10.1299Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M20.3899 10.1299L14.3399 13.1599C13.5899 13.5399 13.1099 14.3099 13.1099 15.1499V20.8699C13.1099 21.6999 13.9799 22.2299 14.7199 21.8599L20.7699 18.8299C21.5199 18.4499 21.9999 17.6799 21.9999 16.8399V11.1199C21.9999 10.2899 21.1299 9.75993 20.3899 10.1299Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
pendingIcon:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M15.7099 15.18L12.6099 13.33C12.0699 13.01 11.6299 12.24 11.6299 11.61V7.51001" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
onlyCard:`<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
  <path d="M2.03027 8.505H22.0303" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M6.03027 16.505H8.03027" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10.5303 16.505H14.5303" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M6.47027 3.505H17.5803C21.1403 3.505 22.0303 4.385 22.0303 7.895V16.105C22.0303 19.615 21.1403 20.495 17.5903 20.495H6.47027C2.92027 20.505 2.03027 19.625 2.03027 16.115V7.895C2.03027 4.385 2.92027 3.505 6.47027 3.505Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
perechisleniya:`<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
  <path d="M12.0386 5.56006H22.0386" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M14.2586 2H19.8186C21.5986 2 22.0386 2.44 22.0386 4.2V8.31C22.0386 10.07 21.5986 10.51 19.8186 10.51H14.2586C12.4786 10.51 12.0386 10.07 12.0386 8.31V4.2C12.0386 2.44 12.4786 2 14.2586 2Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M2.03857 17.0601H12.0386" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4.25858 13.5H9.81857C11.5986 13.5 12.0386 13.94 12.0386 15.7V19.81C12.0386 21.57 11.5986 22.01 9.81857 22.01H4.25858C2.47858 22.01 2.03857 21.57 2.03857 19.81V15.7C2.03857 13.94 2.47858 13.5 4.25858 13.5Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M22.0386 15C22.0386 18.87 18.9086 22 15.0386 22L16.0886 20.25" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M2.03857 9C2.03857 5.13 5.16857 2 9.03857 2L7.98859 3.75" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
terminal:`<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
  <path d="M20.0554 7.04V16.96C20.0554 18.48 19.9154 19.56 19.5554 20.33C19.5554 20.34 19.5454 20.36 19.5354 20.37C19.3154 20.65 19.0254 20.79 18.6854 20.79C18.1554 20.79 17.5154 20.44 16.8254 19.7C16.0054 18.82 14.7454 18.89 14.0254 19.85L13.0154 21.19C12.6154 21.73 12.0854 22 11.5554 22C11.0254 22 10.4954 21.73 10.0954 21.19L9.07544 19.84C8.36544 18.89 7.11541 18.82 6.29541 19.69L6.2854 19.7C5.1554 20.91 4.15544 21.09 3.57544 20.37C3.56544 20.36 3.55542 20.34 3.55542 20.33C3.19542 19.56 3.05542 18.48 3.05542 16.96V7.04C3.05542 5.52 3.19542 4.44 3.55542 3.67C3.55542 3.66 3.55544 3.65 3.57544 3.64C4.14544 2.91 5.1554 3.09 6.2854 4.3L6.29541 4.31C7.11541 5.18 8.36544 5.11 9.07544 4.16L10.0954 2.81C10.4954 2.27 11.0254 2 11.5554 2C12.0854 2 12.6154 2.27 13.0154 2.81L14.0254 4.15C14.7454 5.11 16.0054 5.18 16.8254 4.3C17.5154 3.56 18.1554 3.21 18.6854 3.21C19.0254 3.21 19.3154 3.36 19.5354 3.64C19.5554 3.65 19.5554 3.66 19.5554 3.67C19.9154 4.44 20.0554 5.52 20.0554 7.04Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M8.05542 10.25H16.0554" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M8.05542 13.75H14.0554" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
naqtPullar:`<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
  <path d="M19.3263 7.91998V13.07C19.3263 16.15 17.5663 17.47 14.9263 17.47H6.13632C5.68632 17.47 5.25632 17.43 4.85632 17.34C4.60632 17.3 4.36633 17.23 4.14633 17.15C2.64633 16.59 1.73633 15.29 1.73633 13.07V7.91998C1.73633 4.83998 3.49632 3.52002 6.13632 3.52002H14.9263C17.1663 3.52002 18.7763 4.47001 19.2063 6.64001C19.2763 7.04001 19.3263 7.44998 19.3263 7.91998Z" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M22.3274 10.9201V16.0701C22.3274 19.1501 20.5674 20.4701 17.9274 20.4701H9.13742C8.39742 20.4701 7.72743 20.3701 7.14743 20.1501C5.95743 19.7101 5.14742 18.8001 4.85742 17.3401C5.25742 17.4301 5.68742 17.4701 6.13742 17.4701H14.9274C17.5674 17.4701 19.3274 16.1501 19.3274 13.0701V7.9201C19.3274 7.4501 19.2874 7.03014 19.2074 6.64014C21.1074 7.04014 22.3274 8.38011 22.3274 10.9201Z" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10.5248 13.1399C11.9828 13.1399 13.1648 11.9579 13.1648 10.4999C13.1648 9.04185 11.9828 7.85986 10.5248 7.85986C9.06675 7.85986 7.88477 9.04185 7.88477 10.4999C7.88477 11.9579 9.06675 13.1399 10.5248 13.1399Z" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4.80615 8.30005V12.7001" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16.248 8.30029V12.7003" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
menuIcon:`<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
  <path d="M5.01562 10H7.01562C9.01562 10 10.0156 9 10.0156 7V5C10.0156 3 9.01562 2 7.01562 2H5.01562C3.01562 2 2.01562 3 2.01562 5V7C2.01562 9 3.01562 10 5.01562 10Z" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M17.0156 10H19.0156C21.0156 10 22.0156 9 22.0156 7V5C22.0156 3 21.0156 2 19.0156 2H17.0156C15.0156 2 14.0156 3 14.0156 5V7C14.0156 9 15.0156 10 17.0156 10Z" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M17.0156 22H19.0156C21.0156 22 22.0156 21 22.0156 19V17C22.0156 15 21.0156 14 19.0156 14H17.0156C15.0156 14 14.0156 15 14.0156 17V19C14.0156 21 15.0156 22 17.0156 22Z" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M5.01562 22H7.01562C9.01562 22 10.0156 21 10.0156 19V17C10.0156 15 9.01562 14 7.01562 14H5.01562C3.01562 14 2.01562 15 2.01562 17V19C2.01562 21 3.01562 22 5.01562 22Z" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
historyIcon:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M8 12.2H15" stroke="#FFF" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M8 16.2H12.38" stroke="#FFF" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10 6H14C16 6 16 5 16 4C16 2 15 2 14 2H10C9 2 8 2 8 4C8 6 9 6 10 6Z" stroke="#FFF" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16 4.02002C19.33 4.20002 21 5.43002 21 10V16C21 20 20 22 15 22H9C4 22 3 20 3 16V10C3 5.44002 4.67 4.20002 8 4.02002" stroke="#FFF" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
arrowBottom:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="9" viewBox="0 0 18 9" fill="none">
  <path d="M16.9201 0.950012L10.4001 7.47001C9.63008 8.24001 8.37008 8.24001 7.60008 7.47001L1.08008 0.950012" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
          },
      };
    },
    computed: {
      iconExists() {
        return !!this.icons[this.name];
      },
    },
    methods: {
      getIcon(name) {
        return this.icons[name] || `<span>Icon not found</span>`;
      },
    },
  };
  </script>
  
  <style scoped>
  </style>
  
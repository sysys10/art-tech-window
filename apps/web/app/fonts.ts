import localFont from 'next/font/local'

const cafe24ssurround = localFont({
  src: [
    {
      path: '../assets/fonts/cafe24ssurround/Cafe24Ssurround-v2.0.woff2',
      weight: '45 920',
      style: 'normal',
    },
  ],
  variable: '--font-cafe24',
})
export { cafe24ssurround }

import fs from 'fs';
import path from 'path';

const srcImg = 'C:\\Users\\user\\Desktop\\BRANDING\\branding\\src\\assets\\suave_products_no_background (1).png';
const targets = [
  'C:\\Users\\user\\Desktop\\BRANDING\\branding\\src\\assets\\suave_products_no_background.png',
  'C:\\Users\\user\\Desktop\\BRANDING\\branding\\public\\suave_products_no_background.png'
];

targets.forEach(t => {
  if (fs.existsSync(srcImg)) {
    fs.copyFileSync(srcImg, t);
    console.log('Copied to ' + t);
  }
});

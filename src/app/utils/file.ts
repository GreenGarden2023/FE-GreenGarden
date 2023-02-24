import { RcFile } from "antd/es/upload";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};
const getBase64Preview = (img: RcFile) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => reader.result as string);
  reader.readAsDataURL(img);
  return reader.result as string
};

const utilsFile = {
    getBase64,
    getBase64Preview
}

export default utilsFile
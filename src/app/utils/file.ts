import { RcFile } from "antd/es/upload";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

const utilsFile = {
    getBase64
}

export default utilsFile
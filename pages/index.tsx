import { Button, Upload } from "antd";
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import ColorThief from "colorthief";
import { useState } from "react";
import { useRef } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [colorHex, setColorHex] = useState<string>();
  const imageRef = useRef<HTMLImageElement>(null);

  function getBase64(img: Blob, cb: (result: string) => void) {
    const reader = new FileReader();
    reader.addEventListener("load", () => cb(reader.result as string));
    reader.readAsDataURL(img);
  }

  function handleChange({ file }: UploadChangeParam<UploadFile>) {
    if (file.status === "uploading") {
      setIsLoading(true);
    }

    if (file.status === "done") {
      getBase64(file.originFileObj, (imgUrl) => {
        setImageUrl(imgUrl);
      });
    }
  }

  function rgbToHex(rgb: number[]): string {
    return `#${rgb
      .map((r) => {
        const hex = r.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")}`;
  }

  function handleImageLoad() {
    const colorThief = new ColorThief();
    const hex = rgbToHex(colorThief.getColor(imageRef.current));

    setColorHex(hex);
  }

  return (
    <>
      <Upload
        onChange={handleChange}
        accept="image/png, image/jpeg"
        name="color"
        listType="picture-card"
        showUploadList={false}
        style={{ width: "100px", height: "100px" }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            style={{ width: "100%" }}
            ref={imageRef}
            onLoad={handleImageLoad}
          />
        ) : (
          <div>
            {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>
      <pre>Your color hex code is : {colorHex}</pre>
    </>
  );
}

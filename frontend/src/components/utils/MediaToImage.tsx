import { useEffect, useState, type ImgHTMLAttributes } from "react";
import { axiosInstance } from "@/lib/axios";

async function getUrlById(id: string) {
  const res = await axiosInstance.get(`media/${id}`);
  return res.data as string;
}

type MediaImageProps = {
  mediaId: string;
} & ImgHTMLAttributes<HTMLImageElement>;


export function MediaImage({ mediaId, ...props }: MediaImageProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!mediaId) return;
    getUrlById(mediaId).then(setUrl);
  }, [mediaId]);

  return <img src={url} {...props} />;
}

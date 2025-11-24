import { useEffect, useState, type ImgHTMLAttributes } from "react";
import { axiosInstance } from "@/lib/axios";
import ImageNotFound from '@/images/ImageNotFound.png'


async function getUrlById(id: string | undefined) {
  try {
    const res = await axiosInstance.get(`media/${id}`);
    return res.data as string;
  } catch (error){
      return ImageNotFound
  }
}

type MediaImageProps = {
  mediaId: string | undefined;
} & ImgHTMLAttributes<HTMLImageElement>;


export function MediaImage({ mediaId, ...props }: MediaImageProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    getUrlById(mediaId).then(setUrl);

  }, [mediaId]);
  return <img src={url} {...props} />;
}

// type MediaVideoProps = {
//   mediaId: string | undefined;
// } & ImgHTMLAttributes<HTMLVideoElement>;

// export function MediaVideo({mediaId, ...props}: MediaVideoProps){
//   const [url, setUrl] = useState("")

//   useEffect(() => {
//     getUrlById(mediaId, 'video').then(setUrl);
//   console.log(url)

//   }, [mediaId]);

//   return <video src='https://nest-library-api-mahwayji.s3.ap-southeast-2.amazonaws.com/images/NotFound.png
// ' {...props} controls/>;
  
// }
import { useEffect, useState, type ImgHTMLAttributes } from "react";
import { axiosInstance } from "@/lib/axios";
import ImageNotFound from '@/images/ImageNotFound.png'
import VideoNotFound from '@/images/VideoNotFound.mp4'

async function getUrlById(id: string | undefined, type: string) {
  try {
    const res = await axiosInstance.get(`media/${id}`);
    return res.data as string;
  } catch (error){
    if(type === 'image')
      return ImageNotFound
    else if(type === 'video')
      return VideoNotFound
    else return ''
  }
}

type MediaImageProps = {
  mediaId: string | undefined;
} & ImgHTMLAttributes<HTMLImageElement>;


export function MediaImage({ mediaId, ...props }: MediaImageProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    getUrlById(mediaId, 'image').then(setUrl);

  }, [mediaId]);
  return <img src={url} {...props} />;
}

type MediaVideoProps = {
  mediaId: string | undefined;
} & ImgHTMLAttributes<HTMLVideoElement>;

export function MediaVideo({mediaId, ...props}: MediaVideoProps){
  const [url, setUrl] = useState("")

  useEffect(() => {
    getUrlById(mediaId, 'video').then(setUrl);
  }, [mediaId]);


  return <video src= {url}
   {...props} controls/>;
  
}
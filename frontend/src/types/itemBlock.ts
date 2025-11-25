export type TextStyle = {
  font?: string;
  weight?: string | number;
  size?: number;
  color?: string;
  align?: "left" | "center" | "right";
  italic?: boolean;
  underline?: boolean;
};

export type ItemBlock =
    | { //text return
        id: string;
        type: 'text';
        text: string;
        style?: TextStyle;
        orderIndex: number;
        createdAt: string;
        updatedAt: string;
        }
    | { //image return
        id: string;
        type: 'image';
        url: string;
        mediaId: string
        alt?: string;
        caption?: string;
        aspectRatio?: string;
        orderIndex: number;
        createdAt: string;
        updatedAt: string;
        }
    | { //video return
        id: string;
        type: 'video';
        url: string;
        mediaId: string,
        controls?: boolean;
        muted?: boolean;
        width: number,
        height: number,
        orderIndex: number;
        createdAt: string;
        updatedAt: string;
        };
export type ItemBlock =
    | { //text return
        id: string;
        type: 'text';
        text: string;
        style?: {
            fontSize?: string;
            fontWeight?: string;
            color?: string;
            lineHeight?: string,
        };
        orderIndex: number;
        createdAt: string;
        updatedAt: string;
        }
    | { //image return
        id: string;
        type: 'image';
        url: string;
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
        provider?: string;
        caption?: string;
        controls?: boolean;
        muted?: boolean;
        startAt?: number;
        endAt?: number;
        aspectRatio?: string;
        orderIndex: number;
        createdAt: string;
        updatedAt: string;
        };
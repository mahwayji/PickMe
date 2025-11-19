export type UserProfile = {
    id: string,
    username: string,
    firstName: string,
    lastName: string, 
    profileMediaId: string,
    description: string,
    location: string,
    visibility: Visibility
}

export enum Visibility {
    "PUBLIC",
    "UNLISTED",
    "PRIVATE",
}

export const visibilityOption = [
    { label: "Public", value: Visibility.PUBLIC },
    { label: "Private", value: Visibility.PRIVATE },
    { label: "Unlisted", value: Visibility.UNLISTED },
];

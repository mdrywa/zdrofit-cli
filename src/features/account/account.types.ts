export type Account = {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type AccountInput = {
    name: string;
    email: string;
    password: string;
}



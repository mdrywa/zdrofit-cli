export type Account = {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type CreateAccountInput = {
    name: string;
    email: string;
    password: string;
}

export type NewAccountScreenProps = {
    activeAccount: string;
    sessionActive: string;
    returnClick: () => void;
    onSubmit: (input: CreateAccountInput) => Promise<void>;
}

export type AccountScreenProps = {
    accounts: Account[];
    isLoading: boolean;
    error: string | null;
    activeAccount: string;
    sessionActive: string;
    returnClick: () => void;
    newAccountClick: () => void;
    accountChangeClick: (accountId: string) => Promise<void>;
    deleteAccountClick: (accountId: string) => Promise<void>;
}

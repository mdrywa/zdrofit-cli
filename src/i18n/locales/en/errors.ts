export const errorMessages = {
    general: {
        unexpected: "Something unexpected went wrong. Please try again.",
        startupFailed: (details: string) =>
            `Zdrofit CLI could not start. ${details}`,
        translationsUnavailable:
            "Translations are unavailable because the translation provider is missing.",
    },

    accounts: {
        nameRequired: "Enter a name for the account.",
        emailRequired: "Enter the email address associated with your Zdrofit account.",
        passwordRequired: "Enter your Zdrofit account password.",
        alreadyExists: "An account with this email address already exists.",
        notFound: "This account no longer exists. Refresh the account list and try again.",
        noActiveAccount: "Select an account before continuing.",
        unexpected: "Something went wrong while managing your accounts. Please try again.",
        passwordNotFound:
            "The password for the active account could not be found in your system credential store. Remove the account and add it again.",
        loginFailed: (details: string) =>
            `We could not sign you in. ${details}`,
        sessionCheckFailed: (details: string) =>
            `We could not verify your session. ${details}`,
        emptySessionId:
            "Your session could not be saved because the website returned an empty session ID.",
        passwordVerificationFailed:
            "Your password could not be verified in the system credential store. Please remove the account and add it again.",
    },

    clubs: {
        loadFailed: "We could not load the clubs. Check your connection and try again.",
        requestFailed: (status: number) =>
            `We could not load the clubs (HTTP ${status}). Please try again later.`,
    },

    classes: {
        loadFailed: "We could not load the classes. Check your connection and try again.",
        requestFailed: (status: number) =>
            `We could not load the classes (HTTP ${status}). Please try again later.`,
        noActiveAccount: "Select an account before booking or cancelling a class.",
        noActiveClub: "Select a club before booking or cancelling a class.",
        actionUnavailable:
            "This class cannot be booked or cancelled in its current state.",
        updateFailed:
            "We could not update your booking. Please check your connection and try again.",
        activeSessionRequired:
            "Your session has expired. Sign in again and retry.",
        bookingFailed: (status: number) =>
            `We could not book this class (HTTP ${status}). Please try again.`,
        bookingFormFailed:
            "We could not prepare the booking. Please try again.",
        bookingTokenMissing:
            "We could not prepare the booking because the website returned an unexpected response. Please try again.",
        cancellationFailed: (status: number) =>
            `We could not cancel this booking (HTTP ${status}). Please try again.`,
        cancellationFormFailed:
            "We could not prepare the cancellation. Please try again.",
        cancellationTokenMissing:
            "We could not prepare the cancellation because the website returned an unexpected response. Please try again.",
    },

    reservations: {
        loadFailed:
            "We could not load your reservations. Check your connection and try again.",
        createFailed: "We could not save this reservation. Please try again.",
        removeFailed: "We could not remove this reservation. Please try again.",
        operationFailed:
            "We could not complete the reservation request. Please try again.",
    },

    browser: {
        loginCancelled:
            "Sign-in was cancelled because the browser window was closed.",
        sessionCookieMissing: (cookieName: string) =>
            `You signed in, but the website did not return the required ${cookieName} session cookie. Please try again.`,
    },
};

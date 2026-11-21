import { toaster } from "@/lib/toast/toaster";

type UsePresenterResult = {
    // The one toaster of the app, which `showToast` fills.
    toaster: typeof toaster;
};

export const usePresenter = (): UsePresenterResult => {
    return { toaster };
};

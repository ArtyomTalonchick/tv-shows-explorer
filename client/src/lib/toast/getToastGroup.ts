// The element that holds the toasts of <Toaster />, or nothing while none is shown. A modal drawer keeps it pressable,
// so Undo works over the drawer, and a press on a toast does not close the drawer.
export const getToastGroup = (): HTMLElement | null =>
    document.querySelector<HTMLElement>('[data-scope="toast"][data-part="group"]');

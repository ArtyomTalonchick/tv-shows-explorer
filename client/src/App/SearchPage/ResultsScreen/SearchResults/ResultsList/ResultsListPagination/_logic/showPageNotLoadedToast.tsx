import { showToast } from "~/lib/toast/showToast";

// The toast after another page whose shows did not load; the shown page stays.
export const showPageNotLoadedToast = (page: number): void => {
    showToast({
        icon: "alert",
        tone: "accent",
        urgent: true,
        text: (
            <>
                Couldn’t load page <b>{page}</b>
            </>
        ),
    });
};

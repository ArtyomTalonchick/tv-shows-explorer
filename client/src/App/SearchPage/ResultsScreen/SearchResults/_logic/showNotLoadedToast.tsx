import { showToast } from "@/lib/toast/showToast";

// The toast after another genre or page whose shows did not load; the shown results stay. `page` is the page asked
// for; without it, a genre was.
export const showNotLoadedToast = (page?: number): void => {
    const text =
        page === undefined ? (
            <>Couldn’t change the genre</>
        ) : (
            <>
                Couldn’t load page <b>{page}</b>
            </>
        );
    showToast({ icon: "alert", tone: "accent", urgent: true, text });
};

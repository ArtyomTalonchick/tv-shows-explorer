import type { PageRange } from "@/lib/components/Pagination/Pagination";

// «Shows 4–6 of 8»; a page of one show names just it: «Shows 10 of 10».
export const formatShownRange = ({ first, last, total }: PageRange): string => {
    if (first === last) {
        return `Shows ${first} of ${total}`;
    }
    return `Shows ${first}–${last} of ${total}`;
};

import sprite from "../../../../../design/library/icons.svg?raw";
import { ICON_NAMES } from "../usePresenter";

describe("Icon", () => {
  it("names exactly the icons of the design sprite", () => {
    const ids = [...sprite.matchAll(/<symbol id="([^"]+)"/g)].map((match) => match[1]);

    expect([...ICON_NAMES].sort()).toEqual(ids.sort());
  });
});

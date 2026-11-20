import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("пропускает lastmod для страниц без известной даты обновления", () => {
    const urlsWithLastmod = sitemap()
      .filter((entry) => entry.lastModified !== undefined)
      .map((entry) => entry.url);

    expect(urlsWithLastmod).toEqual([]);
  });
});

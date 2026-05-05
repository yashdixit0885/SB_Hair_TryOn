import { describe, it, expect } from "vitest";

import { renderWithProviders } from "@/test-utils/render";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

describe("Tabs", () => {
  it("renders tabs and panels and passes axe", async () => {
    const { container, getByRole } = renderWithProviders(
      <Tabs defaultValue="native">
        <TabsList>
          <TabsTrigger value="native">Native</TabsTrigger>
          <TabsTrigger value="brand">Brand-published</TabsTrigger>
        </TabsList>
        <TabsContent value="native">Native review pane</TabsContent>
        <TabsContent value="brand">Brand review pane</TabsContent>
      </Tabs>,
    );
    expect(getByRole("tab", { name: "Native" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(container).toHaveNoViolations();
  });
});

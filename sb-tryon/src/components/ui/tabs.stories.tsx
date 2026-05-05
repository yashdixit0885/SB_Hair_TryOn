import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="native" className="w-80">
      <TabsList>
        <TabsTrigger value="native">Native</TabsTrigger>
        <TabsTrigger value="brand">Brand-published</TabsTrigger>
      </TabsList>
      <TabsContent value="native" className="pt-4">
        Native review pane content.
      </TabsContent>
      <TabsContent value="brand" className="pt-4">
        Brand-published review pane content.
      </TabsContent>
    </Tabs>
  ),
};

export const ThreeTabs: Story = {
  render: () => (
    <Tabs defaultValue="color" className="w-96">
      <TabsList>
        <TabsTrigger value="color">Color</TabsTrigger>
        <TabsTrigger value="texture">Texture</TabsTrigger>
        <TabsTrigger value="brand">Brand</TabsTrigger>
      </TabsList>
      <TabsContent value="color" className="pt-4">
        Color filter contents.
      </TabsContent>
      <TabsContent value="texture" className="pt-4">
        Texture filter contents.
      </TabsContent>
      <TabsContent value="brand" className="pt-4">
        Brand filter contents.
      </TabsContent>
    </Tabs>
  ),
};

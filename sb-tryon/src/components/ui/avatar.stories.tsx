import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="" alt="Maya Patel" />
      <AvatarFallback>MP</AvatarFallback>
    </Avatar>
  ),
};

export const ImageLoaded: Story = {
  render: () => (
    <Avatar>
      {/* data URI avoids network dependency in CI while exercising the image-loaded path */}
      <AvatarImage
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQAABjE+ibYAAAAASUVORK5CYII="
        alt="Stylist portrait"
      />
      <AvatarFallback>SK</AvatarFallback>
    </Avatar>
  ),
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "./button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormSubmit,
} from "./form";
import { Input } from "./input";

const meta = {
  title: "UI/Form",
  component: Form,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Form className="w-80">
      <FormField name="email">
        <FormLabel>Email address</FormLabel>
        <FormControl asChild>
          <Input type="email" placeholder="you@example.com" required />
        </FormControl>
        <FormDescription>
          We use this to email your saved looks. Never sold.
        </FormDescription>
        <FormMessage match="valueMissing">
          Please enter your email
        </FormMessage>
        <FormMessage match="typeMismatch">
          Please enter a valid email
        </FormMessage>
      </FormField>
      <FormSubmit asChild>
        <Button>Save email</Button>
      </FormSubmit>
    </Form>
  ),
};

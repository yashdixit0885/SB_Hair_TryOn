import { describe, it, expect } from "vitest";

import { renderWithProviders } from "@/test-utils/render";
import { Input } from "./input";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormSubmit,
} from "./form";

describe("Form", () => {
  it("renders a labelled field and passes axe", async () => {
    const { container, getByLabelText } = renderWithProviders(
      <Form>
        <FormField name="email">
          <FormLabel>Email address</FormLabel>
          <FormControl asChild>
            <Input type="email" />
          </FormControl>
        </FormField>
        <FormSubmit asChild>
          <button type="submit">Save</button>
        </FormSubmit>
      </Form>,
    );
    expect(getByLabelText("Email address")).toBeInTheDocument();
    await expect(container).toHaveNoViolations();
  });
});

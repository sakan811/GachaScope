import { render, screen } from "@testing-library/react";
import Header from "../src/components/Header";
import { describe, it, expect } from "vitest";

describe("Header Component", () => {
  it("renders the header with the correct title", () => {
    render(<Header />);
    const titleElement = screen.getByText(
      "Honkai: Star Rail In-App Purchase Analysis",
    );
    expect(titleElement).toBeTruthy();
  });
});

describe("Header Component Edge Cases", () => {
  it("should have appropriate ARIA roles for accessibility", () => {
    render(<Header />);
    const headerElement = screen.getAllByRole("banner");
    expect(headerElement[0]).toBeTruthy();
  });

  it("should render correctly with default classes only (no className prop)", () => {
    const { container } = render(<Header />);
    const el = container.firstChild as HTMLElement | null;
    // Should have the default classes
    expect(el?.className).toContain("w-full");
    expect(el?.className).toContain("bg-indigo-700");
  });
});

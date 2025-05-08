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

  it("should render correctly with additional className props", () => {
    const { container } = render(<Header className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });
});

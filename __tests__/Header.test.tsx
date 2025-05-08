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

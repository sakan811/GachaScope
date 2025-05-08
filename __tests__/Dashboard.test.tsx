import { render, screen } from "@testing-library/react";
import Dashboard from "../src/components/Dashboard";
import { describe, it, expect, vi } from "vitest";
import * as tableauUtils from "../src/app/tableauUtils";

describe("Dashboard Component", () => {
  it("renders the loading message initially", () => {
    render(<Dashboard />);
    const loadingMessage = screen.getByText("Loading dashboard...");
    expect(loadingMessage).not.toBeNull(); // Standard assertion
  });
});

describe("Dashboard Component Integration", () => {
  it("should call tableauUtils functions during initialization", () => {
    const createParamsSpy = vi.spyOn(tableauUtils, "createParams");
    const createNoscriptFallbackSpy = vi.spyOn(
      tableauUtils,
      "createNoscriptFallback",
    );
    const loadScriptSpy = vi.spyOn(tableauUtils, "loadScript");

    render(<Dashboard />);

    expect(createParamsSpy).toHaveBeenCalled();
    expect(createNoscriptFallbackSpy).toHaveBeenCalled();
    expect(loadScriptSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Function),
    );

    createParamsSpy.mockRestore();
    createNoscriptFallbackSpy.mockRestore();
    loadScriptSpy.mockRestore();
  });
});

describe("Dashboard Component Edge Cases", () => {
  it("should display an error message if the Tableau script fails to load", () => {
    const loadScriptSpy = vi.spyOn(tableauUtils, "loadScript").mockImplementation((_, onLoad) => {
      throw new Error("Failed to load script");
    });

    render(<Dashboard />);

    const errorMessage = screen.getByText("Failed to load script");
    expect(errorMessage).toBeTruthy();

    loadScriptSpy.mockRestore();
  });
});

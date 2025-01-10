import { render, screen } from "@testing-library/react";
import LatestNumber from "./LatestNumber";
import { describe, it } from "vitest";

describe("LatestNumber", (): void => {
  it("Renders LatestNumberComponent", (): void => {
    render(<LatestNumber />);

    screen.debug(); // prints out the jsx in the App component unto the command line
  });
});

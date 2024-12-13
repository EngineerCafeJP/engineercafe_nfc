import { render, screen, describe, it } from "@testing-library/react";
import LatestNumber from "./LatestNumber";

describe("LatestNumber", () => {
  it("Renders LatestNumberComponent", () => {
    render(<LatestNumber />);

    screen.debug(); // prints out the jsx in the App component unto the command line
  });
});

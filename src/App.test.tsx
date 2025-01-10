import { render, screen } from "@testing-library/react";
import App from "./App";
import { describe, it } from "vitest";

describe.skip("App", (): void => {
  it("renders the App component", (): void => {
    render(<App />);

    screen.debug(); // prints out the jsx in the App component unto the command line
  });
});

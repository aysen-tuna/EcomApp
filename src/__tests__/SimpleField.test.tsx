import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { SimpleField } from "@/components/SimpleField";

describe("SimpleField component", () => {
  it("should render label and value", () => {
    render(
      <SimpleField id="title" label="Title" value="Bike" onChange={() => {}} />,
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Bike")).toBeInTheDocument();
  });

  it("should call onChange when typing", async () => {
    const user = userEvent.setup();
    const onChangeMock = jest.fn();

    render(
      <SimpleField id="title" label="Title" value="" onChange={onChangeMock} />,
    );

    await user.type(screen.getByLabelText("Title"), "Bike");

    expect(onChangeMock).toHaveBeenCalled();
  });

  it("should NOT call onChange when typing a negative number", async () => {
    const user = userEvent.setup();
    const onChangeMock = jest.fn();

    render(
      <SimpleField
        id="stock"
        label="Stock"
        type="number"
        value=""
        onChange={onChangeMock}
      />,
    );

    await user.type(screen.getByLabelText("Stock"), "-5");

    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it("should render without modifications", () => {
    const { container } = render(
      <SimpleField id="title" label="Title" value="Bike" onChange={() => {}} />,
    );

    expect(container).toMatchSnapshot();
  });
});

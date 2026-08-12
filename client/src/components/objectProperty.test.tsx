import { fireEvent, render, screen } from '@testing-library/react';
import ObjectPropertiesPanel from './objectProperty';

// Minimal props for the component
const sampleProps = {
  Class: 'IfcWall',
  GlobalId: '0x123',
  Name: 'Test Wall',
  Position: '0,0,0',
  Battery: '-',
  Status: 'OK',
};

describe('ObjectPropertiesPanel', () => {
  test('renders header and provided properties', () => {
    render(
      <ObjectPropertiesPanel
        properties={sampleProps}
        mode="light"
        pinned={false}
        onPin={jest.fn()}
        onClose={jest.fn()}
      />
    );

    // Header should be present
    expect(screen.getByText(/object properties/i)).toBeInTheDocument();

    // Each property key should be rendered
    Object.keys(sampleProps).forEach((key) => {
      expect(screen.getByText(key)).toBeInTheDocument();
    });
  });

  test('calls onPin and onClose callbacks when buttons are clicked', () => {
    const onPin = jest.fn();
    const onClose = jest.fn();
    render(
      <ObjectPropertiesPanel
        properties={sampleProps}
        mode="dark"
        pinned={true}
        onPin={onPin}
        onClose={onClose}
      />
    );

    // Pin button (PushPinIcon) and Close button (CloseIcon) are rendered as IconButton
    // IconButton components do not have accessible names by default, so we fall back to selecting by role order.
    const buttons = screen.getAllByRole('button');
    // Expect two buttons: pin and close
    expect(buttons).toHaveLength(2);
    fireEvent.click(buttons[0]); // pin button
    fireEvent.click(buttons[1]); // close button

    expect(onPin).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

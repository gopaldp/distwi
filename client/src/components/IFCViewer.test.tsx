// Test for IFCViewer component
import { render, screen } from '@testing-library/react';
import IFCViewer from './IFCViewer';

// Mock the external web-ifc library used inside the component
jest.mock('web-ifc', () => ({
  // Provide minimal implementation needed for the component to mount
  IfcAPI: jest.fn().mockImplementation(() => ({
    Init: jest.fn(),
    OpenModel: jest.fn().mockResolvedValue(1),
    GetAllLines: jest.fn().mockReturnValue([]),
    // Add other methods as needed for the component's logic
  })),
}));

describe('IFCViewer', () => {
  test('renders without crashing and displays a canvas element', () => {
    render(<IFCViewer />);
    // The component should render a <canvas> element for the 3D view
    const canvas = screen.getByRole('img', { hidden: true }) as HTMLCanvasElement;
    expect(canvas).toBeInTheDocument();
    // The canvas should have an id that the component uses to initialize the viewer
    expect(canvas.id).toMatch(/ifc-canvas/);
  });
});

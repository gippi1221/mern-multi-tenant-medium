const express = jest.fn(() => ({
  use: jest.fn(),
  listen: jest.fn((port, cb) => cb && cb()),
}));
express.Router = jest.fn(() => ({
  use: jest.fn(),
  post: jest.fn(),
  get: jest.fn(),
  delete: jest.fn(),
}));
export default express;

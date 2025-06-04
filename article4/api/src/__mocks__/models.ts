export const Tenant = {
  findOne: jest.fn(),
};

export const Book = {
  create: jest.fn(),
  find: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

export const User = {
  findOne: jest.fn(),
  create: jest.fn(),
};

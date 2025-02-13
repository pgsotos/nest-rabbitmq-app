// Enable Jest mocking functionality
global.jest = {
  mock: (moduleName, factory) => {
    const actualModule = require(moduleName);
    const mockModule = factory();
    jest.doMock(moduleName, () => mockModule);
    return mockModule;
  },
  fn: () => {
    const mockFn = (...args) => {
      mockFn.mock.calls.push(args);
      return mockFn.mockImplementation ? mockFn.mockImplementation(...args) : undefined;
    };
    mockFn.mock = { calls: [] };
    mockFn.mockImplementation = (fn) => {
      mockFn.mockImplementation = fn;
      return mockFn;
    };
    mockFn.mockResolvedValue = (value) => {
      return mockFn.mockImplementation(() => Promise.resolve(value));
    };
    mockFn.mockRejectedValue = (value) => {
      return mockFn.mockImplementation(() => Promise.reject(value));
    };
    mockFn.mockClear = () => {
      mockFn.mock.calls = [];
      return mockFn;
    };
    return mockFn;
  },
  doMock: (moduleName, factory) => {
    const mock = factory();
    require.cache[require.resolve(moduleName)] = {
      exports: mock
    };
  },
  requireActual: (moduleName) => require(moduleName),
  clearAllMocks: () => {
    for (const key in require.cache) {
      delete require.cache[key];
    }
  }
};

// Initialize mock functions
global.jest.spyOn = (object, method) => {
  const original = object[method];
  const mockFn = jest.fn();
  object[method] = mockFn;
  mockFn.mockRestore = () => {
    object[method] = original;
  };
  return mockFn;
};
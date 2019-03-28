const Analytics = jest.genMockFromModule('analytics-node');

Analytics.mocks = {
  identify: jest.fn(),
  group: jest.fn(),
  track: jest.fn()
};

Analytics.mockImplementation(() => Analytics.mocks);

export default Analytics;

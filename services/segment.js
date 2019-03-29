import Analytics from 'analytics-node';

export const analytics = new Analytics(process.env.SEGMENT_WRITE_KEY);

export const identify = ({
  id,
  firstName,
  lastName,
  email,
  stripeCustomerId,
  createdAt,
  updatedAt,
  teamId
}) => {
  const segmentAnalytics = new Analytics(process.env.SEGMENT_WRITE_KEY);
  return segmentAnalytics.identify({
    userId: id,
    traits: {
      firstName,
      lastName,
      email,
      stripeCustomerId,
      teamId,
      createdAt,
      updatedAt
    }
  });
};

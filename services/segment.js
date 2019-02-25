import Analytics from 'analytics-node';

const segAnalytics = new Analytics(process.env.SEGMENT_WRITE_KEY);

export const identify = user => {
  const { id, firstName, lastName, email, stripeCustomerId, createdAt, updatedAt, teamId } = user;

  return segAnalytics.identify({
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

export const analytics = segAnalytics;

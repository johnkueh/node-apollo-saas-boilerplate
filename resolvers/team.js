import { analytics } from '../services/segment';

export default {
  Mutation: {
    async createTeam(parent, { name }, { user, models }, info) {
      const team = await models.team.create({
        name
      });
      await user.update({ teamId: team.id });

      if (process.env.SEGMENT_WRITE_KEY) {
        analytics.group({
          userId: user.id,
          groupId: team.id,
          traits: {
            name: team.name
          }
        });
      }

      return team;
    },
    async updateTeam(parent, { name }, { user, models }, info) {
      const dbUser = await models.user.findOne({
        where: { id: user.id },
        include: [{ model: models.team }]
      });

      if (dbUser.team) {
        return dbUser.team.update({ name });
      }

      throw new Error('Unable to update team - please create a team first.');
    }
  }
};

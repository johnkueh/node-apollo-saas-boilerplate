# SAAS App Boilerplate

Tech stack

1. Node.js, Express.js
2. GraphQL
3. Sequelize

Features:

1. JWT authentication
2. Can create Stripe customers, add card, subscribe to plan
3. Can see Stripe payment history for customer
4. Handles Stripe's subscription webhooks and updates customer's periodEnd
5. Uses Apollo custom schemaDirectives for auth and analytics, to keep resolvers clean. eg:

```
extend type Mutation {
  createTeam(name: String!): Team!
    @requireAuth
    @analytics(type: "track", event: "Create Team")
    @analytics_group(type: "group")
  updateTeam(name: String!): Team! @requireAuth @analytics(type: "track", event: "Update Team")
}
```

Services

1. Emails - Sendgrid
2. Plans, billing & subscriptions - can be fully managed on Stripe's Billing dashboard
3. Analytics - Segment

import { graphql } from '~/lib/datocms/graphql';
import { PageUrlFragment } from '~/lib/datocms/gqlUrlBuilder/page';

/**
 * Let's define the GraphQL fragment needed for the component to function.
 *
 * GraphQL fragment colocation keeps queries near the components using them,
 * improving maintainability and encapsulation. Fragment composition enables
 * building complex queries from reusable parts, promoting code reuse and
 * efficiency. Together, these practices lead to more modular, maintainable, and
 * performant GraphQL implementations by allowing precise data fetching and
 * easier code management.
 *
 * Routing fields (e.g. `slug`) are not declared here directly: instead, the
 * fragment composes `PageUrlFragment` so that this component and the URL
 * builder stay in sync as the routing scheme evolves.
 *
 * Learn more: https://gql-tada.0no.co/guides/fragment-colocation
 */

export const PageLinkFragment = graphql(
  /* GraphQL */ `
    fragment PageLinkFragment on PageRecord {
      ... on RecordInterface {
        id
        __typename
      }
      ... on PageRecord {
        title
        ...PageUrlFragment
      }
    }
  `,
  [PageUrlFragment],
);

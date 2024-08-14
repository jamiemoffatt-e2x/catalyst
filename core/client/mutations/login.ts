import { client } from '..';
import { graphql } from '../graphql';

const LOGIN_MUTATION = graphql(`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      customerAccessToken {
        value
      }
      customer {
        entityId
        firstName
        lastName
        email
      }
    }
  }
`);

export const login = async (email: string, password: string) => {
  const response = await client.fetch({
    document: LOGIN_MUTATION,
    variables: { email, password },
  });

  console.log(response);

  return response.data.login;
};

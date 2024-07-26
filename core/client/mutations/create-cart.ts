import { getSessionCustomerAccessToken } from '~/auth';

import { client } from '..';
import { graphql, VariablesOf } from '../graphql';

const CREATE_CART_MUTATION = graphql(`
  mutation CreateCart($createCartInput: CreateCartInput!) {
    cart {
      createCart(input: $createCartInput) {
        cart {
          entityId
        }
      }
    }
  }
`);

type Variables = VariablesOf<typeof CREATE_CART_MUTATION>;
type LineItems = Variables['createCartInput']['lineItems'];

export const createCart = async (cartItems: LineItems) => {
  const customerAccessToken = await getSessionCustomerAccessToken();

  const response = await client.fetch({
    document: CREATE_CART_MUTATION,
    variables: {
      createCartInput: {
        lineItems: cartItems,
      },
    },
    customerAccessToken,
    fetchOptions: { cache: 'no-store' },
  });

  return response.data.cart.createCart?.cart;
};

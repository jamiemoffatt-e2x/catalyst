'use server';

import { revalidatePath } from 'next/cache';

import {
  DeleteWishlists,
  deleteWishlists as deleteWishlistsMutation,
} from '~/client/mutations/delete-wishlists';

export const deleteWishlists = async (wishlists: DeleteWishlists) => {
  try {
    const result = await deleteWishlistsMutation(wishlists);

    revalidatePath('/account/wishlists', 'page');

    if (result === 'success') {
      return {
        status: 'success' as const,
      };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        status: 'error' as const,
        message: error.message,
      };
    }
  }

  return { status: 'error' as const, message: 'Unknown error.' };
};

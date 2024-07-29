import { useFormatter } from 'next-intl';

import { graphql, ResultOf } from '~/client/graphql';
import { BcImage } from '~/components/bc-image';
import { PricingFragment } from '~/components/product-card';
import { cn } from '~/lib/utils';
import { Link } from '~/navigation';

export const ProductCardFragment = graphql(
  `
    fragment ProductCardFragment on Product {
      entityId
      name
      defaultImage {
        altText
        url: urlTemplate
      }
      path
      brand {
        name
      }

      ...PricingFragment
    }
  `,
  [PricingFragment],
);

interface Props {
  product: ResultOf<typeof ProductCardFragment>;
  imageSize?: 'tall' | 'wide' | 'square';
  brandSize?: string;
  productSize?: string;
  imagePriority?: boolean;
}

export const ProductSnippet = ({
  product,
  imageSize = 'square',
  imagePriority = false,
  brandSize,
  productSize,
}: Props) => {
  const format = useFormatter();
  const { name, defaultImage, brand, path, prices } = product;
  const showPriceRange = prices?.priceRange.min.value !== prices?.priceRange.max.value;

  return (
    <div className="group relative flex flex-col overflow-visible">
      <div className="relative flex justify-center pb-3">
        <div
          className={cn('relative flex-auto', {
            'aspect-square': imageSize === 'square',
            'aspect-[4/5]': imageSize === 'tall',
            'aspect-[7/5]': imageSize === 'wide',
          })}
        >
          {defaultImage?.url ? (
            <BcImage
              alt={defaultImage.altText || name}
              className="object-contain"
              fill
              priority={imagePriority}
              sizes="(max-width: 768px) 50vw, (max-width: 1536px) 25vw, 500px"
              src={defaultImage.url}
            />
          ) : (
            <div className="h-full w-full bg-gray-200" />
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1">
        {brand ? <p className={cn('text-base text-gray-500', brandSize)}>{brand.name}</p> : null}
        <h3 className={cn('text-base font-semibold', productSize)}>
          <Link
            className="focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-primary/20 focus-visible:ring-0"
            href={path}
          >
            <span aria-hidden="true" className="absolute inset-0 bottom-20" />
            {name}
          </Link>
        </h3>
        <div className="flex flex-wrap items-end justify-between pt-1">
          {prices && (
            <p>
              {showPriceRange ? (
                <>
                  {format.number(prices.priceRange.min.value, {
                    style: 'currency',
                    currency: prices.price.currencyCode,
                  })}{' '}
                  -{' '}
                  {format.number(prices.priceRange.max.value, {
                    style: 'currency',
                    currency: prices.price.currencyCode,
                  })}
                </>
              ) : (
                <>
                  {prices.retailPrice?.value !== undefined && (
                    <>
                      MSRP:{' '}
                      <span className="line-through">
                        {format.number(prices.retailPrice.value, {
                          style: 'currency',
                          currency: prices.price.currencyCode,
                        })}
                      </span>
                      <br />
                    </>
                  )}
                  {prices.salePrice?.value !== undefined &&
                  prices.basePrice?.value !== undefined ? (
                    <>
                      Was:{' '}
                      <span className="line-through">
                        {format.number(prices.basePrice.value, {
                          style: 'currency',
                          currency: prices.price.currencyCode,
                        })}
                      </span>
                      <br />
                      <>
                        Now:{' '}
                        {format.number(prices.price.value, {
                          style: 'currency',
                          currency: prices.price.currencyCode,
                        })}
                      </>
                    </>
                  ) : (
                    prices.price.value && (
                      <>
                        {format.number(prices.price.value, {
                          style: 'currency',
                          currency: prices.price.currencyCode,
                        })}
                      </>
                    )
                  )}
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

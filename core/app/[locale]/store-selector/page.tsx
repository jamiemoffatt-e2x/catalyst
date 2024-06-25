import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { Link } from '~/components/link';
import { StoreLogo, StoreLogoFragment } from '~/components/store-logo';
import { NavigationMenu, NavigationMenuLink } from '~/components/ui/navigation-menu';
import { locales, LocaleType } from '~/i18n';

import { LocaleLink } from './_components/locale-link';

export const metadata = {
  title: 'Location selector',
};

const StoreSelectorPageQuery = graphql(
  `
    query LocationSelectorPageQuery {
      site {
        settings {
          ...StoreLogoFragment
        }
      }
    }
  `,
  [StoreLogoFragment],
);

export default async function StoreSelector({
  params: { locale: selectedLocale },
}: {
  params: { locale: LocaleType };
}) {
  unstable_setRequestLocale(selectedLocale);

  const t = await getTranslations('StoreSelector');

  const { data } = await client.fetch({
    document: StoreSelectorPageQuery,
  });

  const storeSettings = data.site.settings;

  return (
    <>
      <header>
        <NavigationMenu>
          <NavigationMenuLink asChild>
            {storeSettings && (
              <Link className="p-0" href="/">
                <StoreLogo data={storeSettings} />
              </Link>
            )}
          </NavigationMenuLink>
        </NavigationMenu>
      </header>

      <div className="px-4 lg:container sm:px-10 lg:mx-auto lg:max-w-[1000px] lg:px-12">
        <h1 className="text-3xl font-black lg:text-4xl">{t('heading')}</h1>
        <p className="py-2 text-lg">{t('message')}</p>

        <div className="grid grid-cols-1 gap-6 py-6 md:grid-cols-3 md:gap-11 lg:grid-cols-4 lg:gap-8">
          {locales.map((locale) => (
            <LocaleLink key={locale} locale={locale} selected={selectedLocale === locale} />
          ))}
        </div>
      </div>
    </>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamic = 'force-static';

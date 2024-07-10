import { Style, TextInput } from '@makeswift/runtime/controls';

import { Button } from '~/components/ui/button';
import { runtime } from '~/lib/makeswift/runtime';
import { cn } from '~/lib/utils';

interface Props {
  className?: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
}

runtime.registerComponent(
  function Slide({ className, title, description, ctaText, ctaUrl }: Props) {
    return (
      <div className={cn('flex flex-col gap-4 bg-gray-100 px-12 pb-48 pt-36', className)} key={2}>
        <h2 className="text-5xl font-black lg:text-6xl">{title}</h2>
        <p className="max-w-xl">{description}</p>
        <Button asChild className="w-fit">
          <a href={ctaUrl}>{ctaText}</a>
        </Button>
      </div>
    );
  },
  {
    type: 'catalyst-slide',
    label: 'Catalyst / Slideshow / Slide',
    props: {
      className: Style(),
      title: TextInput({ label: 'Title', defaultValue: 'Great Deals' }),
      description: TextInput({
        label: 'Description',
        defaultValue:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
      }),
      ctaText: TextInput({ label: 'CTA Text', defaultValue: 'Shop now' }),
      ctaUrl: TextInput({ label: 'CTA URL', defaultValue: '/#' }),
    },
  },
);

import { List, Slot, Style } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { Slideshow } from './slideshow';

runtime.registerComponent(Slideshow, {
  type: 'catalyst-slideshow',
  label: 'Catalyst / Slideshow / Slideshow',
  props: {
    className: Style(),
    slides: List({
      label: 'Slides',
      type: Slot(),
    }),
  },
});

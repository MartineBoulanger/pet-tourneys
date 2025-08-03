import { Links } from '@/lib/types';
import { Container, PageHeading, PageMenu } from '@/components/ui';
import Carousel from '@/components/carousel';

export async function generateMetadata() {
  return {
    title: 'Tournaments Prizes',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL!}/tournaments/prizes`,
    },
  };
}

export default function TournamentsPrizesPage() {
  const links: Links = [
    {
      id: 1,
      url: `/tournaments/rules`,
      text: 'Rules',
    },
    {
      id: 2,
      url: `/tournaments/stages`,
      text: 'Stages',
    },
    {
      id: 3,
      url: '/tournaments/schedule',
      text: 'Schedule',
    },
    {
      id: 4,
      url: '/tournaments/sign-ups',
      text: 'Sign-ups',
    },
    {
      id: 5,
      url: '/tournaments',
      text: 'Tournaments List',
    },
  ];

  const items = [
    {
      desktop: {
        image: {
          alt: 'frog band',
          height: 600,
          src: 'https://images.ctfassets.net/j4gvxrppq5bi/6biBiOZi4kHOPqQNKUfiw0/f4df53b90a971f7b8a4be6d4d54e36ac/swamp-frogs-desktop.png',
          width: 1792,
        },
      },
      mobile: {
        image: {
          alt: 'frog band',
          height: 800,
          src: 'https://images.ctfassets.net/j4gvxrppq5bi/4w3rKIcmF02bi8vwnrsNwO/933e050dff9958c9ec9803066ca1737e/swamp-frogs-mobile.png',
          width: 640,
        },
      },
    },
    {
      desktop: {
        image: {
          alt: 'waterfall',
          height: 600,
          src: 'https://images.ctfassets.net/j4gvxrppq5bi/3OUZZHQHmbhxGSlRwD7Rkd/a04cabf626e133ed5c94a6eca29b21bc/waterfall-desktop.png',
          width: 1792,
        },
      },
      mobile: {
        image: {
          alt: 'waterfall',
          height: 800,
          src: 'https://images.ctfassets.net/j4gvxrppq5bi/6wteM668lMrHDRCRhAjsTJ/63d49711b5254ba3150a077475c84093/waterfall-mobile.png',
          width: 640,
        },
      },
    },
    {
      desktop: {
        image: {
          alt: 'space',
          height: 600,
          src: 'https://images.ctfassets.net/j4gvxrppq5bi/1goYV4rX04rRB1UjyEvrl5/3f1c5e43a410bf16f7b6d88a046963ef/space-desktop.png',
          width: 1792,
        },
      },
      mobile: {
        image: {
          alt: 'space',
          height: 800,
          src: 'https://images.ctfassets.net/j4gvxrppq5bi/3M8NaXkRrPnHuuPohy4O0I/5baab66e340b7d40beef496014b82968/space-mobile.png',
          width: 640,
        },
      },
    },
    {
      desktop: {
        image: {
          alt: 'urban',
          height: 600,
          src: 'https://images.ctfassets.net/j4gvxrppq5bi/4FXdWBJ23JAx9x7cpM4bgy/0a420b0f5121f407025f626af0e7c1f9/urban-desktop.png',
          width: 1792,
        },
      },
      mobile: {
        image: {
          alt: 'urban',
          height: 800,
          src: 'https://images.ctfassets.net/j4gvxrppq5bi/10xIMlsPTg0nPseAdGezdK/0138a095a8145392ccd9d34fb5c3e2a6/urban-mobile.png',
          width: 640,
        },
      },
    },
    {
      desktop: {
        image: {
          alt: 'tropical',
          height: 600,
          src: 'https://images.ctfassets.net/j4gvxrppq5bi/6FqTDslwGnDkwWW4SrtBJW/d06937d60528b96d1e6d0c013e79e472/tropical-desktop.png',
          width: 1792,
        },
      },
      mobile: {
        image: {
          alt: 'tropical',
          height: 800,
          src: 'https://images.ctfassets.net/j4gvxrppq5bi/2Wk5USyMsJHvSFkDtWW9xX/6129bb30c1c276d526bb689e65823e37/tropical-mobile.png',
          width: 640,
        },
      },
    },
  ];

  return (
    <Container>
      <PageHeading heading='Tournament Prizes'>
        <PageMenu links={links} />
      </PageHeading>
      <div>{'Prizes Page'}</div>
      <Carousel
        breakpoint='sm'
        items={items}
        pauseOnHover
        loadingComponent={<p>Loading...</p>}
        // noAutoPlay
        showControls
        // thumbnails={[1, 2, 3, 4, 5]}
        thumbnails={items}
      />
    </Container>
  );
}

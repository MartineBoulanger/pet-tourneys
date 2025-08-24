'use server';

export const contentful = async (
  query: string,
  preview = false,
  tags = ['guides']
) => {
  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID! || '';
  const environment =
    process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT! || 'master';
  const deliveryToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN! || '';
  const previewToken = process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_TOKEN! || '';

  if (!deliveryToken || !previewToken) {
    console.error('Contentful API tokens are missing');
    throw new Error('Contentful API tokens are not configured');
  }

  const token = preview ? previewToken : deliveryToken;

  // Directly validate the token length - most Contentful tokens are ~40+ characters
  if (token.length < 20) {
    console.error('Token appears suspiciously short - may be invalid');
  }

  const url = `https://graphql.contentful.com/content/v1/spaces/${spaceId}/environments/${environment}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
      next: { tags },
    });

    if (!response.ok) {
      console.error(
        'Contentful response not OK:',
        response.status,
        response.statusText
      );
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(
        `Contentful API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      throw new Error(
        `GraphQL errors: ${data.errors
          .map((e: { message: string }) => e.message)
          .join(', ')}`
      );
    }

    return data;
  } catch (error) {
    console.error('Error fetching from Contentful:', error);
    throw error;
  }
};

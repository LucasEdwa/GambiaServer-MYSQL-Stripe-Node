import Cosmic from '@cosmicjs/sdk';

// Call Cosmic as a function, not as a constructor
const cosmic = Cosmic();

const bucket = cosmic.bucket({
  slug: process.env.COSMIC_BUCKET_SLUG as string,
  read_key: process.env.COSMIC_READ_KEY,
  write_key: process.env.COSMIC_WRITE_KEY,
});

export async function insertProductCosmic(product: {
  title: string;
  content?: string;
  metadata?: Record<string, any>;
}) {
  const params = {
    type: 'products', // Change to 'projects' if you want to add projects
    title: product.title,
    content: product.content,
    metadata: product.metadata,
  };
  const response = await bucket.addObject(params);
  return response.object;
}

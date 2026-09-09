import { z } from 'zod';

export const productSchema = z.object({
  image: z.instanceof(File, {
    message: 'Product image is required'
  }),

  name: z.string().trim().min(2, 'Product name is too short'),

  price: z.coerce.number().positive('Price must be greater than 0'),

  discount: z.coerce
    .number()
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount cannot be more than 100'),

  bgcolor: z.string().trim().min(1, 'Background color is required'),

  panelcolor: z.string().trim().min(1, 'Panel color is required'),

  textcolor: z.string().trim().min(1, 'Text color is required')
});

export const updateProductSchema = productSchema.extend({
  image: z.union([z.instanceof(File), z.string()]).optional()
});

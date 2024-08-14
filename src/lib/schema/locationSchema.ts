import { z } from 'zod';

export const createLocationSchema = z.object({
	street: z.string().min(1, 'Street is required'),
	city: z.string().min(1, 'City is required'),
	state: z.string().min(1, 'State is required'),
	zip: z.string().min(1, 'ZIP code is required'),
	country: z.string().min(1, 'Country is required'),
	userId: z.string().min(1, 'User is required')
});

// Update Location Schema
export const updateLocationSchema = z.object({
	id: z.string().min(1).optional(),
	street: z.string().min(1).optional(),
	city: z.string().min(1).optional(),
	state: z.string().min(1).optional(),
	zip: z.string().min(1).optional(),
	country: z.string().min(1).optional(),
	userId: z.string().min(1, 'User is required')
});

// Delete Location Schema
export const deleteLocationSchema = z.object({
	id: z.string().min(1).optional()
});

export type CreateLocationInput = z.infer<typeof createLocationSchema>;
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;
export type DeleteLocationInput = z.infer<typeof deleteLocationSchema>;

import z from 'zod';
import { currentUserSchema } from '../../@types/user';

export const updateUserSchema = z.object({
  id: z.uuid().min(1, 'O id é obrigatório.'),
  first_name: z.string('O nome é obrigatório.').min(2, 'O nome deve ter no mínimo 2 caractéres.').optional(),
  last_name: z
    .string('O sobrenome é obrigatório.')
    .min(2, 'O sobrenome deve conter no mínimo 2 caractéres.')
    .optional(),
  email: z
    .email('O email é obrigatório.')
    .refine(val => val.includes('@lotarianacional.co.ao'), { error: 'O email deve pertencer à Lotaria Nacional' })
    .optional(),
  password: z
    .string('O palavra-passe é obrigatória.')
    .min(6, 'A palavra-passe deve ter no mínimo 6 dígitos/caractéres')
    .optional(),

  reset_password_token: z.string().optional(),

  user: currentUserSchema,
});

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;

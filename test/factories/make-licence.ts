import { CreateLicenceDTO } from '../../src/features/licence/schemas/create-licence.schema';

export function makeLicence(override?: Partial<CreateLicenceDTO>) {
  return {
    number: 'numb-example',
    description: 'desc-example',
    limit: 2,
    emitted_at: new Date('2025-08-10'),
    expires_at: new Date('2026-08-11'),
    ...override,
  } as CreateLicenceDTO;
}

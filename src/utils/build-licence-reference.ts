export type LicenceRefProps = {
  name?: string;
  number?: string;
  year: Date;
  desc?: string;
};

export function buildLicenceReference(props: LicenceRefProps) {
  const { name = 'unknown', number = 'unknown', year, desc = 'unknown' } = props;
  const newYear = new Date(year).getFullYear();

  return `${name}-N${number}-${newYear}-PT${desc ?? ''}`.toUpperCase();
}

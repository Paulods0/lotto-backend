export type LicenceRefProps = {
  name?: string;
  number?: string;
  year?: number;
  desc?: string;
};

export function buildReference(props: LicenceRefProps) {
  const { name = 'unknown', number = 'unknown', year = 'unknown', desc = 'unknown' } = props;
  return `${name}-N${number}-${year}-PT${desc ?? ''}`.toUpperCase();
}

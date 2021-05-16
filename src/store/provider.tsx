import { Provider as ArmorProvider } from './armor/index';
import { Provider as SkillProvider } from './skill/index';
import { Provider as DecorationProvider } from './decoration/index';
import { Props } from './types';

const providers = [ArmorProvider, SkillProvider, DecorationProvider];

const Provider = (props: Props): any =>
  providers.reduceRight(
    (children, Parent) => <Parent>{children}</Parent>,
    props.children
  );

export default Provider;
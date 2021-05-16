import { Card } from 'antd';
import { Build } from '../../data/types';
import './index.css';

export interface BuildViewProps {
  build: Build;
}

export const BuildView = (props: BuildViewProps) => {
  const { build } = props;
  const slotListView = Array.from(build.availableSlots.entries()).map((s) => (
    <div key={s.toString()}>{`${s[0]} => ${s[1]}`}</div>
  ));
  const skillListView = Array.from(build.skills.entries()).map((s) => (
    <div key={s.toString()}>{`${s[0]} => ${s[1]}`}</div>
  ));

  return (
    <Card>
      <div className="build-view flex-row">
        <div>
          <div>{build.head}</div>
          <div>{build.chest}</div>
          <div>{build.brace}</div>
          <div>{build.belt}</div>
          <div>{build.leg}</div>
          <div>
            <div>{slotListView}</div>
          </div>
          <div>Requirements: {build.requirementsScore}</div>
        </div>
        <div>
          Skills
          <div>{skillListView}</div>
        </div>
      </div>
    </Card>
  );
};

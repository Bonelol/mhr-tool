import { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, Drawer, Rate } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { Skill } from '../../data';
import { useState as useSkillState } from '../../store/skill';
import { sortBy } from '../../utils/sortBy';
import './index.css';

const defaultOptions = [2, 3];

export interface SkillSelectViewProps {
  selected?: Map<string, number>;
  onSelected?: (skill: Skill, level: number) => void;
}

export const SkillSelectView = (props: SkillSelectViewProps) => {
  const { selected, onSelected } = props;
  const skillsRef = useRef<HTMLDivElement>(null);
  const snapshot = useRef(-1);
  const initState = useSkillState();
  const [selectedRareOptions, onSelectedRareOptions] = useState(defaultOptions);
  const rareOptions = Array.from(new Set(initState.map((s) => s.rare || 0)))
    .sort()
    .reverse()
    .map((o) => ({
      label: `Rare ${o}`,
      value: o,
    }));
  const [drawerVisible, setDrawerVisible] = useState(false);
  const skills = sortBy(initState, (s) => (selected && selected.get(s.name) ? 0 : 1)).filter(
    (s) => (selected && selected.get(s.name)) || selectedRareOptions.includes(s.rare || 0)
  );

  const handleRateChange = (skill: Skill) => (value: number) => {
    snapshot.current = skillsRef.current
      ? skillsRef.current.scrollHeight - skillsRef.current.scrollTop
      : 0;

    if (onSelected) {
      onSelected(skill, value);
    }
  };

  const skillList = skills.map((skill) => (
    <tr key={skill.name} className="skill-list-item">
      <td className="skill-list-item-title">{skill.name}</td>
      <td>
        <Rate
          defaultValue={selected?.get(skill.name)}
          count={skill.max}
          onChange={handleRateChange(skill)}
        />
      </td>
    </tr>
  ));

  useEffect(() => {
    if (skillsRef.current && snapshot.current >= 0) {
      skillsRef.current.scrollTop = skillsRef.current.scrollHeight - snapshot.current;
    }
  }, [selected]);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', height: '100%' }}>
      <div style={{ textAlign: 'right' }}>
        <Button icon={<SettingOutlined />} onClick={() => setDrawerVisible(true)}></Button>
      </div>
      <div ref={skillsRef} className="skill-list-wrapper">
        <table className="skill-list">
          <tbody>{skillList}</tbody>
        </table>
      </div>
      <Drawer
        title="技能稀有度"
        placement="top"
        closable={false}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        getContainer={false}
        style={{ position: 'absolute' }}
        headerStyle={{ backgroundColor: '#e3f2fd' }}
        bodyStyle={{ backgroundColor: '#e3f2fd' }}
      >
        <Checkbox.Group
          options={rareOptions}
          defaultValue={defaultOptions}
          onChange={(values) => onSelectedRareOptions(values as number[])}
        />
      </Drawer>
    </div>
  );
};

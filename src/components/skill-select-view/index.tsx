import { Rate } from 'antd';
import { Skill } from '../../data';
import { useState } from '../../store/skill'
import { sortBy } from '../../utils/sortBy';
import './index.css';

export interface SkillSelectViewProps {
  selected?: Map<string, number>;
  onSelected?: (skill: Skill, level: number) => void;
}

export const SkillSelectView = (props: SkillSelectViewProps) => {
  const { selected, onSelected } = props;
  const initState = useState();
  const skills = sortBy(initState, s => selected && selected.get(s.name) ? 0 : 1);
  const handleRateChange = (skill: Skill) => (value: number) => {
    if (onSelected) {
      onSelected(skill, value)
    }
  }
  const skillList = skills.map((skill) => (
    <tr key={skill.name} className="skill-list-item">
      <td className="skill-list-item-title">{skill.name}</td>
      <td>
        <Rate defaultValue={selected?.get(skill.name)} count={skill.max} onChange={handleRateChange(skill)}/>
      </td>
    </tr>
  ));

  return <table className="skill-list"><tbody>{skillList}</tbody></table>;
};

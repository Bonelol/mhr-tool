import { Rate, Tag, Card, Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { Skill, Talisman } from '../../data/types';
import { SkillSelectView } from '../skill-select-view';
import './index.css';

export interface MyTalismanProps {
  talisman?: Talisman;
  talismanChanged?: (talisman: Talisman) => void;
}

export const MyTalisman = (props: MyTalismanProps) => {
  const { talisman, talismanChanged } = props;
  const [visible, setVisible] = useState(false);
  const [skills, setSkills] = useState(
    talisman?.skills || new Map<string, number>()
  );
  const [slots, setSlots] = useState(
    talisman?.slots || new Map<number, number>()
  );
  const onSelected = (s: Skill, level: number) => {
    setSkills(new Map(skills.set(s.name, level)));
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const talismanSkillsList = Array.from(skills.entries())
    .filter((s) => s[1] > 0)
    .map((e) => (
      <Tag key={e[0]}>
        {e[0]}: {e[1]}
      </Tag>
    ));

  const slotListView = Array.from(slots.entries())
    .filter((s) => s[1] > 0)
    .map((s) => <div key={s.toString()}>{`S${s[0]} => ${s[1]}`}</div>);

  useEffect(() => {
    const s1 = new Map(Array.from(slots.entries()).filter((s) => s[1] > 0));
    const s2 = new Map(Array.from(skills.entries()).filter((s) => s[1] > 0));

    if (talismanChanged) talismanChanged({ slots: s1, skills: s2 });
  }, [slots, skills]);

  return (
    <div className="my-talisman flex-row">
      <div>
        <Card
          className="my-talisman-card"
          title="护石"
          size="small"
          extra={
            <Button type="link" onClick={showModal}>
              编辑
            </Button>
          }
          style={{ background: '#f1f8e9' }}
        >
          <div className="flex-row">
            <div>插槽</div>
            <div>{slotListView}</div>
          </div>
          <div className="flex-row">
            <div>技能</div>
            <div>{talismanSkillsList}</div>
          </div>
        </Card>
      </div>
      <Modal
        title="编辑护石"
        visible={visible}
        footer={null}
        onCancel={handleOk}
      >
        <div className="my-talisman-content">
          <div className="my-talisman-slots">
            <table>
              <tbody>
                <tr>
                  <td>Lv3 Slot count</td>
                  <td>
                    <Rate
                      defaultValue={slots.get(3)}
                      count={3}
                      character={({ index }: { index: number }) => index + 1}
                      onChange={(n) => setSlots(slots.set(3, n))}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Lv2 Slot count</td>
                  <td>
                    <Rate
                      defaultValue={slots.get(2)}
                      count={3}
                      character={({ index }: { index: number }) => index + 1}
                      onChange={(n) => setSlots(slots.set(2, n))}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Lv1 Slot count</td>
                  <td>
                    <Rate
                      defaultValue={slots.get(1)}
                      count={3}
                      character={({ index }: { index: number }) => index + 1}
                      onChange={(n) => setSlots(slots.set(1, n))}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="my-talisman-skills">
            <SkillSelectView selected={skills} onSelected={onSelected} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

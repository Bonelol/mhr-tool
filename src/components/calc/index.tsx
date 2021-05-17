import React, { useEffect, useRef, useState } from 'react';
import { Button, List } from 'antd';
import { Build, Decoration, Skill, skills, Talisman } from '../../data';
import { SkillSelectView } from '../skill-select-view';
import { useState as useArmorState } from '../../store/armor';
import { useState as useDecorationState } from '../../store/decoration';
import { sortBy, sortDescBy } from '../../utils/sortBy';
import { flatMap } from '../../utils/flatMap';
import { MyTalisman } from '../my-talisman';
import { State as Armors } from '../../store/armor/types';
import { BuildView } from '../build-view';
import './index.css';

export const Calc = () => {
  const [selected, setSelected] = useState(new Map<string, number>());
  const [talisman, setTalisman] = useState<Talisman>();
  const [builds, setBuilds] = useState<Build[]>([]);
  const armors = useArmorState();
  const decorations = useDecorationState();
  const skillsRef = useRef<HTMLDivElement>(null);
  const [snapshot, setSnapshot] = useState(-1);

  const onSelected = (s: Skill, level: number) => {
    setSnapshot(
      skillsRef.current
        ? skillsRef.current.scrollHeight - skillsRef.current.scrollTop
        : 0
    );
    setSelected(new Map(selected).set(s.name, level));
  };

  const onTalismanChanged = (t: Talisman) => {
    setTalisman(t);
  };

  const calc = () => {
    const builds = findBuilds(selected, talisman, armors, decorations);
    setBuilds(builds);
  };

  useEffect(() => {
    if (skillsRef.current && snapshot >= 0) {
      skillsRef.current.scrollTop = skillsRef.current.scrollHeight - snapshot;
    }
  }, [selected]);

  return (
    <div className="calc">
      <div ref={skillsRef}>
        <SkillSelectView selected={selected} onSelected={onSelected} />
      </div>
      <div className="calc-main-view">
        <div className=" flex-row">
          <div style={{ width: '80%' }}>
            <MyTalisman
              talisman={talisman}
              talismanChanged={onTalismanChanged}
            />
          </div>
          <div>
            <Button type="primary" onClick={calc}>
              Calc
            </Button>
          </div>
        </div>
        <div className="build-list">
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={builds}
            renderItem={(b) => (
              <List.Item>
                <BuildView build={b} />
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
};

const preSort = (builds: Build[], decorations: Decoration[]) => {
  return sortBy(
    sortDescBy(builds, (b) => b.availableSlotsScore),
    (b) => b.preAddDecorations(decorations)
  );
};

const sort = (builds: Build[]) => {
  return sortBy(
    sortDescBy(builds, (b) => b.availableSlotsScore),
    (b) => b.requirementsScore
  );
};

const findBuilds = (
  selected: Map<string, number>,
  talisman: Talisman | null | undefined,
  armors: Armors,
  decorations: Decoration[]
) => {
  const slots = talisman?.slots || new Map<number, number>();
  const skills = talisman?.skills || new Map<string, number>();
  const t: number[] = [];

  Array.from(slots.entries()).forEach((s) => {
    for (let i = 0; i < s[1]; i++) {
      t.push(s[0]);
    }
  });

  Array.from(skills.entries()).map((s) => ({ name: s[0], level: s[1] }));
  const build = new Build(selected).add({
    type: 6,
    name: 'Talisman',
    skills: Array.from(skills.entries()).map((s) => ({
      name: s[0],
      level: s[1],
    })),
    slots: t,
  });
  let builds = preSort(
    armors.head.map((h) => build.add(h)),
    decorations
  );
  builds = preSort(
    flatMap(
      builds.slice(0, 100).map((b) => armors.chest.map((h) => b.add(h))),
      (arr) => arr
    ),
    decorations
  );
  builds = preSort(
    flatMap(
      builds.slice(0, 100).map((b) => armors.brace.map((h) => b.add(h))),
      (arr) => arr
    ),
    decorations
  );
  builds = preSort(
    flatMap(
      builds.slice(0, 100).map((b) => armors.belt.map((h) => b.add(h))),
      (arr) => arr
    ),
    decorations
  );
  builds = preSort(
    flatMap(
      builds.slice(0, 1000).map((b) => armors.leg.map((h) => b.add(h))),
      (arr) => arr
    ),
    decorations
  );

  builds.forEach((b) => b.addDecorations(decorations));
  builds = sort(builds);
  const winners = builds.slice(0, 100);
  console.log(winners);

  return winners;
};

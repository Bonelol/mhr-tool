import { sumBy } from '../utils/sumBy';

export interface Armor {
  type: number;
  rare?: number;
  name: string;
  slots: number[];
  skills: { name: string; level: number; [others: string]: any }[];
  [others: string]: any;
}

export interface Skill {
  name: string;
  max: number;
  rare?: number;
  [others: string]: any;
}

export interface Decoration {
  name: string;
  skill: string;
  level: number;
  [others: string]: any;
}

export interface Talisman {
  slots: Map<number, number>;
  skills: Map<string, number>;
}

export class Build {
  head: string = '';
  chest: string = '';
  brace: string = '';
  belt: string = '';
  leg: string = '';
  slots: Map<number, number> = new Map();
  availableSlots: Map<number, number> = new Map();
  skills: Map<string, number> = new Map();
  decorations: Map<string, number> = new Map();
  requirements: Map<string, number>;

  get requirementsScore() {
    return sumBy(Array.from(this.requirements.values()), (r) => r);
  }

  get availableSlotsScore() {
    return sumBy(Array.from(this.availableSlots.entries()), ([slot, num]) => (slot === 3 ? 9 : slot === 2 ? 4 : 1) * num);
  }

  constructor(requirements: Map<string, number>) {
    this.requirements = new Map(requirements);
  }

  clone() {
    const b = new Build(this.requirements);
    b.head = this.head;
    b.chest = this.chest;
    b.brace = this.brace;
    b.belt = this.belt;
    b.leg = this.leg;
    b.slots = new Map(this.slots);
    b.availableSlots = new Map(this.availableSlots);
    b.skills = new Map(this.skills);
    b.decorations = new Map(this.decorations);

    return b;
  }

  add(armor: Armor) {
    const clone = this.clone();

    switch (armor.type) {
      case 1:
        clone.head = armor.name;
        break;
      case 2:
        clone.chest = armor.name;
        break;
      case 3:
        clone.brace = armor.name;
        break;
      case 4:
        clone.belt = armor.name;
        break;
      case 5:
        clone.leg = armor.name;
        break;
    }

    clone.updateSlots(armor.slots);
    clone.updateSkills(armor.skills);

    return clone;
  }

  updateSlots(slots: number[]) {
    slots.forEach((s) => {
      const num = (this.slots.get(s) || 0) + 1;
      this.slots.set(s, num);
      this.availableSlots.set(s, num);
    });
  }

  updateSkills(
    skills: { name: string; level: number; [others: string]: any }[]
  ) {
    skills.forEach((s) => {
      this.skills.set(s.name, (this.skills.get(s.name) || 0) + s.level);

      if (this.requirements.has(s.name)) {
        const level = (this.requirements.get(s.name) || 0) - s.level;
        this.requirements.set(s.name, level < 0 ? 0 : level);
      }
    });
  }

  addDecorations(decorations: Array<Decoration>) {
    const map: { [level: number]: string[] } = {
      1: [],
      2: [],
      3: [],
    };

    this.requirements.forEach((v, k) => {
      if (v <= 0) {
        return;
      }

      const decoration = decorations.find((d) => d.skill === k);

      if (!decoration) return;

      map[decoration.level].push(decoration.skill);
    });

    const levels = Object.keys(map).map((k) => Number.parseInt(k));
    const maxLevel = Math.max(...levels);

    for (let i of levels.sort().reverse()) {
      map[i].forEach((s) => {
        const level = this.requirements.get(s) || 0;

        if (level <= 0) {
          return;
        }

        for (let k = i; k <= maxLevel; k++) {
          const slot = this.availableSlots.get(k) || 0;

          if (slot === 0) {
            continue;
          }

          const available = slot - level;

          if (available >= 0) {
            this.skills.set(s, (this.skills.get(s) || 0) + level);
          }

          this.availableSlots.set(k, slot - level < 0 ? 0 : slot - level);
          this.requirements.set(s, level - slot < 0 ? 0 : level - slot);
        }
      });
    }
  }

  preAddDecorations(decorations: Array<Decoration>) {
    const map: { [level: number]: string[] } = {
      1: [],
      2: [],
      3: [],
    };
    const skills = new Map(this.skills);
    const requirements = new Map(this.requirements);
    const availableSlots = new Map(this.availableSlots);

    requirements.forEach((v, k) => {
      if (v <= 0) {
        return;
      }

      const decoration = decorations.find((d) => d.skill === k);

      if (!decoration) return;

      map[decoration.level].push(decoration.skill);
    });

    const levels = Object.keys(map).map((k) => Number.parseInt(k));
    const maxLevel = Math.max(...levels);

    for (let i of levels.sort().reverse()) {
      map[i].forEach((s) => {
        const level = requirements.get(s) || 0;

        if (level <= 0) {
          return;
        }

        for (let k = i; k <= maxLevel; k++) {
          const slot = availableSlots.get(k) || 0;

          if (slot === 0) {
            continue;
          }

          const available = slot - level;

          if (available >= 0) {
            skills.set(s, (skills.get(s) || 0) + level);
          }

          availableSlots.set(k, slot - level < 0 ? 0 : slot - level);
          requirements.set(s, level - slot < 0 ? 0 : level - slot);
        }
      });
    }

    return sumBy(Array.from(requirements.values()), (r) => r);
  }
}

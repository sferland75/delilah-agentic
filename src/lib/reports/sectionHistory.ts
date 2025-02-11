interface SectionVersion {
  content: string;
  timestamp: number;
  prompt?: {
    system: string;
    human: string;
  };
}

export class SectionHistory {
  private versions: Map<string, SectionVersion[]>;
  private maxVersions: number = 5;  // Keep last 5 versions

  constructor() {
    this.versions = new Map();
  }

  addVersion(sectionKey: string, content: string, prompt?: { system: string; human: string }) {
    if (!this.versions.has(sectionKey)) {
      this.versions.set(sectionKey, []);
    }

    const versions = this.versions.get(sectionKey)!;
    versions.push({
      content,
      timestamp: Date.now(),
      prompt
    });

    // Keep only the last N versions
    if (versions.length > this.maxVersions) {
      versions.shift();
    }

    this.versions.set(sectionKey, versions);
  }

  getVersions(sectionKey: string): SectionVersion[] {
    return this.versions.get(sectionKey) || [];
  }

  getLastVersion(sectionKey: string): SectionVersion | undefined {
    const versions = this.versions.get(sectionKey);
    return versions?.[versions.length - 1];
  }

  clear(sectionKey: string) {
    this.versions.delete(sectionKey);
  }
}
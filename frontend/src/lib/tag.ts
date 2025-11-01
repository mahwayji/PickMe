export function parseTags(input:string, limit = 10): string[]{

    if(!input) return[];
    const raw = input.split(",").map(s => s.trim()).filter(Boolean);
    const cleaned = raw.map(tag => {

        let t = tag.startsWith("#") ? tag.slice(1) : tag;
        t = t.toLowerCase().normalize("NFKC");
        t = t.replace(/[^\p{L}\p{N}\p{M}_-]+/gu, "");
        return t;
    }).filter(Boolean)

    const uniq = Array.from(new Set(cleaned))
        .map(t => t.slice(0, 24))
        .slice(0, limit);

    return uniq;
}

export function tagsToInput(tags: string[] = []): string {
  return tags.map(t => `#${t}`).join(", ");
}
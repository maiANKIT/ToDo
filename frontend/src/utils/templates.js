const TEMPLATES_KEY = "todoflow-templates";
const MAX_TEMPLATES = 20;

export function getTemplates() {
  try {
    return JSON.parse(localStorage.getItem(TEMPLATES_KEY) || "[]");
  } catch {
    return [];
  }
}

/**
 * Saves { name, title, description, link, status } as a new template.
 * Newest first, capped at MAX_TEMPLATES so the list can't grow forever.
 */
export function saveTemplate(template) {
  const templates = getTemplates();
  const newTemplate = { id: `tpl_${Date.now()}`, ...template };
  const updated = [newTemplate, ...templates].slice(0, MAX_TEMPLATES);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updated));
  return newTemplate;
}

export function deleteTemplate(id) {
  const updated = getTemplates().filter((t) => t.id !== id);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updated));
  return updated;
}
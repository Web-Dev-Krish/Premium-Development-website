import { setCors } from '../server/admin-utils.js';
import categoriesHandler from '../server/handlers/categories.js';
import projectsHandler from '../server/handlers/projects.js';
import featuredWebsitesHandler from '../server/handlers/featured-websites.js';
import leadsHandler from '../server/handlers/leads.js';
import hostingPlansHandler from '../server/handlers/hosting-plans.js';
import foundersHandler from '../server/handlers/founders.js';
import websiteSkinsHandler from '../server/handlers/website-skins.js';
import faqsHandler from '../server/handlers/faqs.js';
import siteSettingsHandler from '../server/handlers/site-settings.js';
import uploadHandler from '../server/handlers/upload.js';
import storageStatusHandler from '../server/handlers/storage-status.js';

const handlers = {
  categories: categoriesHandler,
  projects: projectsHandler,
  'featured-websites': featuredWebsitesHandler,
  leads: leadsHandler,
  'hosting-plans': hostingPlansHandler,
  founders: foundersHandler,
  'website-skins': websiteSkinsHandler,
  faqs: faqsHandler,
  'site-settings': siteSettingsHandler,
  upload: uploadHandler,
  'storage-status': storageStatusHandler,
};

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  const segments = req.query['...path'] || [];
  const route = Array.isArray(segments) ? segments[0] : segments;

  const matched = handlers[route];
  if (!matched) {
    return res.status(404).json({ error: 'Not found' });
  }

  return matched(req, res);
}
